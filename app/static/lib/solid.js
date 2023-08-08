import {
  log,
  meiFileName,
  fileLocationType,
  github, // instance
  meiFileLocation,
  setStandoffAnnotationEnabledStatus,
  storage,
  version,
} from './main.js';

import { nsp, politeness } from './linked-data.js';

export const solid = solidClientAuthentication.default;

// mei-friend resource containers (internal path within Solid storage)
export const friendContainer = 'at.ac.mdw.mei-friend/';
export const annotationContainer = friendContainer + 'oa/';
export const musicalObjectContainer = friendContainer + 'mao/';
export const selectionContainer = musicalObjectContainer + 'selection/';
export const extractContainer = musicalObjectContainer + 'extract/';
export const musicalMaterialContainer = musicalObjectContainer + 'musicalMaterial/';
export const discoveryFragment = 'discovery/';

// resource templates
export const resources = {
  ldpContainer: {
    '@type': [nsp.LDP + 'Container', nsp.LDP + 'BasicContainer'],
  },
  maoExtract: {
    '@type': [nsp.MAO + 'Extract'],
  },
  maoSelection: {
    '@type': [nsp.MAO + 'Selection'],
  },
  maoMusicalMaterial: {
    '@type': [nsp.MAO + 'MusicalMaterial'],
  },
};

export function getCurrentFileUri() {
  let fileUri;
  switch (fileLocationType) {
    case 'file':
      fileUri = 'https://localhost' + meiFileName; // or should we just not allow local files at all?
      break;
    case 'url':
      fileUri = meiFileLocation;
      break;
    case 'github':
      fileUri = github.rawGithubUri;
      break;
    default:
      fileUri = meiFileLocation;
      console.error('Unexpected fileLocationType: ', fileLocationType);
  }
  return fileUri;
}

export async function postResource(containerUri, resource) {
  console.log('Call to postResource', containerUri, resource);
  resource['@id'] = ''; // document base URI
  const webId = solid.getDefaultSession().info.webId;
  resource[nsp.DCT + 'creator'] = { '@id': webId };
  resource[nsp.DCT + 'created'] = new Date(Date.now()).toISOString();
  const versionString = env === environments.production ? version : `${env}-${version}`;
  resource[nsp.DCT + 'provenance'] = `Generated using mei-friend v.${versionString}: https://mei-friend.mdw.ac.at`;
  return establishContainerResource(containerUri)
    .then((containerUriResource) => {
      return solid
        .fetch(containerUriResource, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify(resource),
        })
        .then(async (postResp) => {
          console.log('GOT POST RESPONSE:', postResp);
          return postResp;
        })
        .catch((e) => {
          console.error("Couldn't post resource to container: ", e, containerUriResource, resource);
        });
    })
    .catch((e) => {
      console.error("Couldn't establish container: ", e, containerUri);
    });
}

/**
 * Safely append to the specified resource:
 * 1. Get fresh copy of resource from URI, noting its etag
 * 2. Apply patch to the obtained resource copy
 * 3. Conditionally PUT specifying if-match on the etag
 *  - if it matches, do PUT
 *  - if it doesn't match, GO TO 1
 * n.b. in the glorious future, this should be done using HTTP PATCH.
 * but while the implementation of this in Solid is still under discussion,
 * we do this instead.
 */
export async function safelyPatchResource(uri, patch) {
  let etag;
  solid
    .fetch(uri, {
      headers: {
        Accept: 'application/ld+json',
      },
    })
    .then((resp) => {
      etag = resp.headers.get('ETag');
      return resp.json();
    })
    .then((freshlyFetched) => {
      console.log('Found freshlyFetched resource at URI: ', freshlyFetched, uri);
      console.log('Applied patch: ', patch);
      const patched = jsonpatch.applyPatch(freshlyFetched, patch).newDocument;
      console.log('applied patch!', patch, patched);
      solid
        .fetch(uri, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/ld+json',
            'If-Match': etag,
          },
          body: JSON.stringify(patched),
        })
        .then((putResp) => {
          if (putResp.status === 412) {
            console.info('Precondition failed: resource has changed while we were trying to patch it. Retrying...');
            setTimeout(safelyPatchResource(uri, patch), politeness);
          } else if (putResp.status >= 400) {
            console.warn("Couldn't PUT patched resource: ", putResp);
          } else {
            console.log('Patched successfully: ', uri);
          }
        })
        .catch((e) => {
          console.warn('Failed to apply patch to resource: ', uri, patch, e);
        });
    });
}

export async function establishResource(uri, resource) {
  resource['@id'] = uri;
  // check whether a resource exists at uri
  // if not, create one initialised to the supplied resource
  const solidButton = document.getElementById('solid_logo');
  solidButton.classList.add('clockwise');
  let resp = await solid
    .fetch(uri, {
      method: 'HEAD',
      headers: {
        Accept: 'application/ld+json',
      },
    })
    .then(async (headResp) => {
      console.log('GOT HEAD RESPONSE:', headResp);
      if (headResp.ok) {
        return headResp;
      } else if (headResp.status === 404) {
        // resource doesn't yet exist - let's try to create it
        let putResp = await solid
          .fetch(uri, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(resource),
          })
          .catch((e) => {
            log('Sorry, network error while trying to initialize resource at ', uri, e);
          });
        return putResp;
      } else if (headResp.status === 403) {
        // user needs to authorize mei-friend application to access their Pod
        log(
          'Unauthorized - please provide mei-friend application access to your Solid Pod: ' +
            headResp.status +
            ' ' +
            headResp.statusText
        );
        return headResp;
      } else {
        // another problem...
        log('Sorry, unable to establish resource in your Solid Pod: ' + headResp.status + ' ' + headResp.statusText);
      }
    })
    .finally(() => solidButton.classList.remove('clockwise'));
  return resp;
}

export async function getSolidStorage() {
  return getProfile().then(async (profile) => {
    if (nsp.PIM + 'storage' in profile) {
      let storage = Array.isArray(profile[nsp.PIM + 'storage'])
        ? profile[nsp.PIM + 'storage'][0] // TODO what if more than one storage?
        : profile[nsp.PIM + 'storage'];
      if (typeof storage === 'object') {
        if ('@id' in storage) {
          storage = storage['@id'];
        } else {
          console.warn('Unexpected pim:storage object in your Solid Pod profile: ', profile);
        }
      }
      return storage;
    } else {
      log("Sorry, couldn't establish storage location from your Solid Pod's profile ", profile);
      throw Error(profile);
    }
  });
}

export async function establishContainerResource(container) {
  return getSolidStorage().then(async (storage) => {
    // establish container resource
    let resource = structuredClone(resources.ldpContainer);
    return establishResource(storage + container, resource)
      .then(async (resp) => {
        if (resp) {
          if (resp.ok) {
            console.log('Response OK:', resp, storage, container);
            return storage + container;
          } else {
            console.warn('Response not OK:', resp, storage, container);
            return null;
          }
        }
      })
      .catch(() => console.error("Couldn't establish resource:", storage + container, resource));
  });
}

export async function createMAOMusicalObject(selectedElements, label = '') {
  // Function to build a Musical Object according to the Music Annotation Ontology:
  // https://dl.acm.org/doi/10.1145/3543882.3543891
  // For the purposes of mei-friend, we want to build a composite structure encompassing MusicalMaterial,
  // Extract, and Selection (see paper)
  let currentFileUri = getCurrentFileUri();
  return establishContainerResource(friendContainer)
    .then(async (storageResource) => {
      // first, establish discovery resource for the current MEI file
      let currentFileUriHash = encodeURIComponent(currentFileUri);
      let discoveryUri = storageResource + discoveryFragment + currentFileUriHash;
      console.log(
        'Have current file and discovery URI',
        currentFileUri,
        storageResource + discoveryFragment,
        discoveryUri
      );
      return establishContainerResource(friendContainer + discoveryFragment).then(async () => {
        console.log('1: ', discoveryUri);
        return establishContainerResource(musicalObjectContainer).then(async (musicalObjectContainer) => {
          console.log('2: ', discoveryUri);
          return createMAOSelection(selectedElements, currentFileUri, discoveryUri, label).then(
            async (selectionResource) => {
              console.log('3: ', discoveryUri);
              return createMAOExtract(selectionResource, currentFileUri, discoveryUri, label).then(
                async (extractResource) => {
                  return createMAOMusicalMaterial(extractResource, currentFileUri, discoveryUri, label).then(
                    async (musMatResource) => {
                      // establish a discovery resource (if it doesn't already exist)
                      return establishResource(discoveryUri, {
                        '@type': nsp.SCHEMA + 'ItemList',
                        [nsp.SCHEMA + 'description']: 'List of resources about ' + currentFileUri,
                        [nsp.SCHEMA + 'itemListOrder']: nsp.SCHEMA + 'itemListUnordered',
                        [nsp.SCHEMA + 'about']: { '@id': currentFileUri },
                        [nsp.SCHEMA + 'itemListElement']: [],
                      }).then(async () => {
                        // patch the now-established discovery resource with our new MAO objects
                        return safelyPatchResource(discoveryUri, [
                          {
                            op: 'add',
                            // escape ~ and / characters according to JSON POINTER spec
                            // use '-' at end of path specification to indicate new array item to be created
                            path: `/${nsp.SCHEMA.replaceAll('~', '~0').replaceAll('/', '~1')}itemListElement/-`,
                            value: {
                              '@type': `${nsp.SCHEMA}listItem`,
                              [`${nsp.SCHEMA}additionalType`]: { '@id': `${nsp.MAO}MusicalMaterial` },
                              [`${nsp.SCHEMA}url`]: {
                                '@id': new URL(storageResource).origin + musMatResource.headers.get('Location'),
                              },
                            },
                          },
                          {
                            op: 'add',
                            // escape ~ and / characters according to JSON POINTER spec
                            // use '-' at end of path specification to indicate new array item to be created
                            path: `/${nsp.SCHEMA.replaceAll('~', '~0').replaceAll('/', '~1')}itemListElement/-`,
                            value: {
                              '@type': `${nsp.SCHEMA}listItem`,
                              [`${nsp.SCHEMA}additionalType`]: { '@id': `${nsp.MAO}Extract` },
                              [`${nsp.SCHEMA}url`]: {
                                '@id': new URL(storageResource).origin + extractResource.headers.get('Location'),
                              },
                            },
                          },
                          {
                            op: 'add',
                            // escape ~ and / characters according to JSON POINTER spec
                            // use '-' at end of path specification to indicate new array item to be created
                            path: `/${nsp.SCHEMA.replaceAll('~', '~0').replaceAll('/', '~1')}itemListElement/-`,
                            value: {
                              '@type': `${nsp.SCHEMA}listItem`,
                              [`${nsp.SCHEMA}additionalType`]: { '@id': `${nsp.MAO}Selection` },
                              [`${nsp.SCHEMA}url`]: {
                                '@id': new URL(storageResource).origin + selectionResource.headers.get('Location'),
                              },
                            },
                          },
                        ]).then(() => {
                          return musMatResource;
                        }); // finally, return the musMat resource to the UI
                      });
                    }
                  );
                }
              );
            }
          );
        });
      });
    })
    .catch((e) => {
      console.error('Failed to create nsp.MAO Musical Object:', e);
    });
}

async function createMAOSelection(selection, aboutUri, discoveryUri, label = '') {
  // private function -- called *after* friendContainer and musicalObjectContainer already established
  console.log('createMAOSelection: ', selection, aboutUri, discoveryUri, label);
  let resource = structuredClone(resources.maoSelection);
  let baseFileUri = getCurrentFileUri();
  resource[nsp.FRBR + 'part'] = selection.map((s) => {
    return {
      '@id': `${baseFileUri}#${s}`,
    };
  });
  if (label) {
    resource[nsp.RDFS + 'label'] = label;
  }
  // resource(s) this MAO object is about
  aboutUri = Array.isArray(aboutUri) ? aboutUri : [aboutUri];
  resource[nsp.SCHEMA + 'about'] = aboutUri.map((uri) => {
    return { '@id': uri };
  });
  // itemList resource(s) in our discoveryContainer that point to this MAO object
  discoveryUri = Array.isArray(discoveryUri) ? discoveryUri : [discoveryUri];
  resource[nsp.SCHEMA + 'subjectOf'] = discoveryUri.map((uri) => {
    return { '@id': uri };
  });

  let response = await postResource(selectionContainer, resource);
  console.log('GOT RESPONSE: ', response);
  return response;
}

async function createMAOExtract(postSelectionResponse, aboutUri, discoveryUri, label = '') {
  console.log('createMAOExtract: ', postSelectionResponse, aboutUri, discoveryUri, label);
  let selectionUri = new URL(postSelectionResponse.url).origin + postSelectionResponse.headers.get('location');
  let resource = structuredClone(resources.maoExtract);
  resource[nsp.FRBR + 'embodiment'] = [{ '@id': selectionUri }];
  if (label) {
    resource[nsp.RDFS + 'label'] = label;
  }
  // resource(s) this MAO object is about
  aboutUri = Array.isArray(aboutUri) ? aboutUri : [aboutUri];
  resource[nsp.SCHEMA + 'about'] = aboutUri.map((uri) => {
    return { '@id': uri };
  });
  // itemList resource(s) in our discoveryContainer that point to this MAO object
  discoveryUri = Array.isArray(discoveryUri) ? discoveryUri : [discoveryUri];
  resource[nsp.SCHEMA + 'subjectOf'] = discoveryUri.map((uri) => {
    return { '@id': uri };
  });
  return postResource(extractContainer, resource);
}

async function createMAOMusicalMaterial(postExtractResponse, aboutUri, discoveryUri, label = '') {
  console.log('createMAOMusicalMaterial: ', postExtractResponse, aboutUri, discoveryUri, label);
  let extractUri = new URL(postExtractResponse.url).origin + postExtractResponse.headers.get('location');
  let resource = structuredClone(resources.maoMusicalMaterial);
  resource[nsp.MAO + 'setting'] = { '@id': extractUri };
  if (label) {
    resource[nsp.RDFS + 'label'] = label;
  }
  // resource(s) this MAO object is about
  aboutUri = Array.isArray(aboutUri) ? aboutUri : [aboutUri];
  resource[nsp.SCHEMA + 'about'] = aboutUri.map((uri) => {
    return { '@id': uri };
  });
  // itemList resource(s) in our discoveryContainer that point to this MAO object
  discoveryUri = Array.isArray(discoveryUri) ? discoveryUri : [discoveryUri];
  resource[nsp.SCHEMA + 'subjectOf'] = discoveryUri.map((uri) => {
    return { '@id': uri };
  });
  return postResource(musicalMaterialContainer, resource);
}

export async function populateSolidTab() {
  const solidTab = document.getElementById('solidTab');
  if (solid.getDefaultSession().info.isLoggedIn) {
    solidTab.innerHTML = await populateLoggedInSolidTab();
    document.getElementById('solidLogout').addEventListener('click', solidLogout);
  } else {
    solidTab.innerHTML = populateLoggedOutSolidTab();
    document.getElementById('solidLogin').addEventListener('click', () => {
      loginAndFetch();
    });
  }
  setStandoffAnnotationEnabledStatus();
}

export async function getProfile() {
  const webId = solid.getDefaultSession().info.webId;
  const solidButton = document.getElementById('solidButton');
  solidButton.classList.add('clockwise');
  const profile = await solid
    .fetch(webId, {
      headers: {
        Accept: 'application/ld+json',
      },
    })
    .then((resp) => resp.json())
    .then((json) => jsonld.expand(json))
    .then((profile) => {
      let me = Array.from(profile).filter((e) => '@id' in e && e['@id'] === webId);
      if (me.length) {
        if (me.length > 1) {
          console.warn('User profile contains multiple entries for webId: ', me);
        }
        return me[0];
      } else {
        // TODO proper error handling
        console.warn('User profile contains no entry matching their webId: ', profile, webId);
      }
    })
    .finally(() => solidButton.classList.remove('clockwise'));
  return profile;
}

async function populateLoggedInSolidTab() {
  const webId = solid.getDefaultSession().info.webId;
  const solidButton = document.getElementById('solidButton');
  solidButton.classList.add('clockwise');
  const profile = await solid
    .fetch(webId, {
      headers: {
        Accept: 'application/ld+json',
      },
    })
    .then((resp) => resp.json())
    .then((json) => jsonld.expand(json))
    .finally(() => solidButton.classList.remove('clockwise'));
  let name = webId;
  // try to find entry for 'me' (i.e. the user's webId) in profile:
  let me = Array.from(profile).filter((e) => '@id' in e && e['@id'] === webId);
  if (me.length) {
    if (me.length > 1) {
      console.warn("User's solid profile has multiple entries for their webId!");
    }
    if (`${nsp.FOAF}name` in me[0]) {
      let foafName = me[0][`${nsp.FOAF}name`][0]; // TODO decide what to do in case of multiple foaf:names
      if (typeof foafName === 'string') {
        name = foafName;
      } else if (typeof foafName === 'object' && '@value' in foafName) {
        name = foafName['@value'];
      }
    }
  }

  return `
  <div>Welcome, <span id='welcomeName' title='${webId}'>${name}</span>!</div>
  <div><a id="solidLogout">Log out</a></div>`;
}

function populateLoggedOutSolidTab() {
  let providerContainer = document.createElement('div');
  let provider = document.createElement('select');
  provider.setAttribute('name', 'provider');
  provider.setAttribute('id', 'providerSelect');
  provider.innerHTML = `
    <option value="https://solidcommunity.net">SolidCommunity.net</option>
    <option value="https://login.inrupt.net">Inrupt</option>
    <option value="https://trompa-solid.upf.edu">TROMPA @ UPF</option>
  `;
  providerContainer.insertAdjacentElement('afterbegin', provider);
  let msg = document.createElement('div');
  msg.innerHTML = 'Please choose a provider and <a id="solidLogin">click here to log in!</a>';
  msg.insertAdjacentElement('afterbegin', providerContainer);
  return msg.outerHTML;
}

export async function loginAndFetch() {
  // 1. Call `handleIncomingRedirect()` to complete the authentication process.
  //    If called after the user has logged in with the Solid Identity Provider,
  //      the user's credentials are stored in-memory, and
  //      the login process is complete.
  //   Otherwise, no-op.
  solid.handleIncomingRedirect({ restorePreviousSession: true }).then((info) => {
    // 2. Start the Login Process if not already logged in.
    if (!info.isLoggedIn) {
      storage.restoreSolidSession = true;
      let providerEl = document.getElementById('providerSelect');
      if (providerEl) {
        let provider = providerEl.value;
        solid.login({
          // Specify the URL of the user's Solid Identity Provider;
          // e.g., "https://login.inrupt.com".
          oidcIssuer: provider,
          // Provide a name for the application when sending to the Solid Identity Provider
          clientName: 'mei-friend',
        });
      } else {
        console.warn("Couldn't handle incoming redirect from Solid: no provider element");
      }
    } else {
      populateSolidTab();
    }
  });
}
export function solidLogout() {
  solid.logout().then(() => {
    storage.removeItem('restoreSolidSession');
    populateSolidTab();
  });
}
