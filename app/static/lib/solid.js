import {
  log,
  meiFileName,
  fileLocationType,
  github, // instance
  meiFileLocation,
  storage,
  version
} from './main.js';

import { 
  nsp, politeness
} from './linked-data.js';


export const solid = solidClientAuthentication.default;

// mei-friend resource containers (internal path within Solid storage)
export const friendContainer = "at.ac.mdw.mei-friend/";
export const annotationContainer = friendContainer + "oa/";
export const musicalObjectContainer = friendContainer + "mao/";
export const selectionContainer = musicalObjectContainer + "selection/";
export const extractContainer = musicalObjectContainer + "extract/";
export const musicalMaterialContainer = musicalObjectContainer + "musicalMaterial/";

// resource templates
export const resources = {
  ldpContainer:  { 
    "@type": [nsp.LDP+"Container", nsp.LDP+"BasicContainer"]
  },
  maoExtract:{ 
    "@type": [nsp.MAO + "Extract"]
  },
  maoSelection:{ 
    "@type": [nsp.MAO + "Selection"]
  },
  maoMusicalMaterial: { 
    "@type": [nsp.MAO + "MusicalMaterial"]
  }

}

export async function postResource(containerUri, resource) { 
  console.log("Call to postResource", containerUri, resource);
  resource["@id"] = ""; // document base URI
  const webId = solid.getDefaultSession().info.webId;
  resource[nsp.DCT + "creator"] = { "@id": webId};
  resource[nsp.DCT + "created"] = new Date(Date.now()).toISOString();
  const versionString = (env === environments.production ? version : `${env}-${version}`);
  resource[nsp.DCT + "provenance"] = `Generated using mei-friend v.${versionString}: https://mei-friend.mdw.ac.at`;
  return establishContainerResource(containerUri).then((containerUriResource) => {
    return solid.fetch(containerUriResource, {
      method: 'POST',
      headers: { 
        "Content-Type": 'application/ld+json'
      },
      body: JSON.stringify(resource)
    }).then(async postResp => {
      console.log("GOT POST RESPONSE:", postResp);
      return postResp;
    }).catch(e => { 
      console.error("Couldn't post resource to container: ", e, containerUriResource, resource)
    })
  }).catch(e => {
    console.error("Couldn't establish container: ", e, containerUri)
  })
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
  solid.fetch(uri, {
    headers: { 
      Accept: 'application/ld+json'
    }
  }).then(resp => {
    let etag = resp.headers.get("ETag");
    return resp.json();
  }).then(freshlyFetched => {
    console.log("Found freshlyFetched resource at URI: ", freshlyFetched, uri);
    const patched = jsonpatch.applyPatch(freshlyFetched, patch).newDocument;
    solid.fetch(uri, { 
      method: 'PUT',   
      headers: { 
        "Content-Type": 'application/ld+json',
        "If-Match": etag, 
      },
      body: JSON.stringify(patched)
    }).then(putResp => { 
      if(putResp.status === 412) { 
        console.info("Precondition failed: resource has changed while we were trying to patch it. Retrying...");
        setTimeout(safelyPatchResource(uri, patch), politeness)
      } else if(putResp.status >= 400) {
        throw Error(putResp)
      } else { 
        console.log("Patched successfully: ", uri);
      }
    }).catch(e => {
      console.warn("Failed to apply patch to resource: ", uri, patch, e)
    })
  })
}

export async function establishResource(uri, resource) { 
  resource["@id"] = uri;
  // check whether a resource exists at uri
  // if not, create one initialised to the supplied resource
  const solidButton = document.getElementById('solid_logo');
  solidButton.classList.add('clockwise');
  let resp = await solid.fetch(uri, { 
    method: 'HEAD',
    headers: { 
      Accept: 'application/ld+json'
    }
   }).then(async headResp=> { 
    console.log("GOT HEAD RESPONSE:", headResp)
    if(headResp.ok) { 
      return headResp;
    } else if(headResp.status === 404) {
      // resource doesn't yet exist - let's try to create it
      let putResp = await solid.fetch(uri, { 
        method: 'PUT',   
        headers: {
        'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(resource)
      }).catch(e => { 
        log("Sorry, network error while trying to initialize resource at ", uri, e);
      });
      return putResp;
    } else if(headResp.status === 403) { 
      // user needs to authorize mei-friend application to access their Pod
      log("Unauthorized - please provide mei-friend application access to your Solid Pod: " + headResp.status + " " + headResp.statusText);
      return headResp;
    } else { 
      // another problem...
      log("Sorry, unable to establish resource in your Solid Pod: " + headResp.status + " " + headResp.statusText)
    }
  }).finally(() => solidButton.classList.remove("clockwise"));
  return resp;
}

export async function getSolidStorage() { 
  return getProfile().then(async (profile) => { 
    if(nsp.PIM + 'storage' in profile) { 
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
  })
}

export async function establishContainerResource(container){ 
  return getSolidStorage().then(async (storage) => {
    // establish container resource
    let resource = structuredClone(resources.ldpContainer);
    return establishResource(storage + container, resource).then(async (resp) => {
      if(resp) {
        if(resp.ok) {
          console.log("Response OK:", resp, storage, container);
          return storage + container;
        } else { 
          console.warn("Response not OK:", resp, storage, container);
          return null;
        }  
      }
    })
    .catch(() => console.error("Couldn't establish resource:", storage + container, resource));
  });
}


export async function createMAOMusicalObject(selectedElements, label = "") {
  // Function to build a Musical Object according to the Music Annotation Ontology:
  // https://dl.acm.org/doi/10.1145/3543882.3543891
  // For the purposes of mei-friend, we want to build a composite structure encompassing MusicalMaterial, 
  // Extract, and Selection (see paper)
  return establishContainerResource(friendContainer).then(async () => { 
    return establishContainerResource(musicalObjectContainer).then(async (musicalObjectContainer) => { 
      return createMAOSelection(selectedElements, label).then(async selectionResource => { 
        return createMAOExtract(selectionResource, label).then(async extractResource => { 
          return createMAOMusicalMaterial(extractResource, label)
        })
      })
    })
  })
  .catch(e => { console.error("Failed to create nsp.MAO Musical Object:", e) })
}

async function createMAOSelection(selection, label = "") {
  // private function -- called *after* friendContainer and musicalObjectContainer already established
  let resource = structuredClone(resources.maoSelection);
  let baseFileUri;
  switch(fileLocationType) { 
    case 'file':
      baseFileUri = "https://localhost" + meiFileName; // or should we just not allow local files at all?
      break;
    case 'url':
      baseFileUri = meiFileLocation;
      break;
    case 'github':
      baseFileUri = github.rawGithubUri;
      break;
    default: 
      baseFileUri = meiFileLocation;
      console.error("Unexpected fileLocationType: ", fileLocationType);
  }
  resource[nsp.FRBR + "part"] = selection.map(s => { 
    return {
      "@id": `${baseFileUri}#${s}` 
    } 
  });
  if(label) { 
    resource[nsp.RDFS + "label"] = label;
  }
  let response = await postResource(selectionContainer, resource);
  console.log("GOT RESPONSE: ", response);
  return response;
}
 
async function createMAOExtract(postSelectionResponse, label = "") {
  console.log("createMAOExtract: ", postSelectionResponse);
  let selectionUri = new URL(postSelectionResponse.url).origin +  
    postSelectionResponse.headers.get("location");
  let resource = structuredClone(resources.maoExtract);
  resource[nsp.FRBR + "embodiment"] = { "@id": selectionUri };
  if(label) { 
    resource[nsp.RDFS + "label"] = label;
  }
  return postResource(extractContainer, resource);
}

async function createMAOMusicalMaterial(postExtractResponse, label = "") {
  console.log("createMAOMusicalMaterial: ", postExtractResponse);
  let extractUri = new URL(postExtractResponse.url).origin + 
    postExtractResponse.headers.get("location");
  let resource = structuredClone(resources.maoMusicalMaterial);
  resource[nsp.MAO + "setting"] = { "@id": extractUri }
  if(label) { 
    resource[nsp.RDFS + "label"] = label;
  }
  return postResource(musicalMaterialContainer, resource);
}

export async function populateSolidTab() { 
  const solidTab = document.getElementById("solidTab");
  if(solid.getDefaultSession().info.isLoggedIn) {
    solidTab.innerHTML = await populateLoggedInSolidTab();
    document.getElementById('solidLogout').addEventListener('click', solidLogout)
  } else {
    solidTab.innerHTML = populateLoggedOutSolidTab();
    document.getElementById('solidLogin').addEventListener('click', loginAndFetch)
  }
}

export async function getProfile() { 
  const webId = solid.getDefaultSession().info.webId;
  const solidButton = document.getElementById('solidButton');
  solidButton.classList.add('clockwise');
  const profile = await solid.fetch(webId, { 
    headers: { 
      Accept: "application/ld+json"
    }
  })
  .then(resp => resp.json())
  .then(json => jsonld.expand(json))
  .then((profile) => {
    let me = Array.from(profile).filter(e => "@id" in e && e["@id"] === webId);
    if(me.length) {
      if(me.length > 1) { 
        console.warn("User profile contains multiple entries for webId: ", me);
      } 
      return me[0];
    } else { 
      // TODO proper error handling
      console.warn("User profile contains no entry matching their webId: ", profile, webId);
    }
  }).finally(() => solidButton.classList.remove("clockwise"));
  return profile;
}

async function populateLoggedInSolidTab() { 
  const webId = solid.getDefaultSession().info.webId;
  const solidButton = document.getElementById('solidButton');
  solidButton.classList.add('clockwise');
  const profile = await solid.fetch(webId, { 
    headers: { 
      Accept: "application/ld+json"
    }
  }).then(resp => resp.json())
    .then(json => jsonld.expand(json))
    .finally(() => solidButton.classList.remove("clockwise"));
  let name = webId;
  // try to find entry for 'me' (i.e. the user's webId) in profile:
  let me = Array.from(profile).filter(e => "@id" in e && e["@id"] === webId);
  if(me.length) { 
    if(me.length > 1) { 
      console.warn("User's solid profile has multiple entries for their webId!");
    }
    if(`${nsp.FOAF}name` in me[0]) {
      let foafName = me[0][`${nsp.FOAF}name`][0]; // TODO decide what to do in case of multiple foaf:names
      if(typeof foafName === "string") { 
        name = foafName;
      } else if(typeof foafName === "object" && "@value" in foafName) { 
        name = foafName["@value"];
      }
    }     
  }
  
  return `
  <div>Welcome, <span id='welcomeName' title='${webId}'>${name}</span>!</div>
  <div><a id="solidLogout">Log out</a></div>`;
}

function populateLoggedOutSolidTab() {
  // TODO finish
  let provider = document.createElement("select");
  provider.setAttribute("name", "provider");
  provider.setAttribute("id", "providerSelect");
  provider.innerHTML = `
    <option value="https://solidcommunity.net">SolidCommunity.net</option>
    <option value="https://login.inrupt.net">Inrupt</option>
    <option value="https://trompa-solid.upf.edu">TROMPA @ UPF</option>
    <option value="other">Other...</option>
  `
  return 'Please <a id="solidLogin">Click here to log in!</a>';
}

export async function loginAndFetch() {
  // 1. Call `handleIncomingRedirect()` to complete the authentication process.
  //    If called after the user has logged in with the Solid Identity Provider, 
  //      the user's credentials are stored in-memory, and
  //      the login process is complete. 
  //   Otherwise, no-op.  
  await solid.handleIncomingRedirect({ restorePreviousSession: true });

  // 2. Start the Login Process if not already logged in.
  if (!solid.getDefaultSession().info.isLoggedIn) {
    storage.restoreSolidSession = true;
    await solid.login({
      // Specify the URL of the user's Solid Identity Provider;
      // e.g., "https://login.inrupt.com".
      oidcIssuer: "https://solidcommunity.net",
      // Specify the URL the Solid Identity Provider should redirect the user once logged in,
      // e.g., the current page for a single-page app.
      redirectUrl: window.location.href,
      // Provide a name for the application when sending to the Solid Identity Provider
      clientName: "mei-friend"
    });
    
  } else { 
    populateSolidTab();
    /*
    solid.fetch("https://musicog.solidcommunity.net/private/")
        .then(resp => resp.text())
        .then(data => console.log("GOT DATA: ", data))
        */
  }
}
export function solidLogout() { 
  solid.logout().then(() => {
    storage.removeItem("restoreSolidSession")
    populateSolidTab();
  });
}
