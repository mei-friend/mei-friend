// namespace definitions
export const nsp = {
  DCT: 'http://purl.org/dc/terms/',
  FOAF: 'http://xmlns.com/foaf/0.1/',
  FRBR: 'http://purl.org/vocab/frbr/core#',
  LDP: 'http://www.w3.org/ns/ldp#',
  MAO: 'https://domestic-beethoven.eu/ontology/1.0/music-annotation-ontology.ttl#',
  OA: 'http://www.w3.org/ns/oa#',
  PIM: 'http://www.w3.org/ns/pim/space#',
  RDF: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  RDFS: 'http://www.w3.org/2000/01/rdf-schema#',
  SCHEMA: 'https://schema.org/',
};

export const politeness = 200; // milliseconds between network requests

/**
 * Recursively traverse a graph of linked data (JSON-LD documents) starting at url
 * and searching for target entities matching type. Traverse only along followList predicates.
 * Do not traverse to resources in blocklist.
 * typeToHandlerMap object maps type strings to handler callbacks
 * userProvided flag used to indicate whether to hand control back to user on error
 * jumps counter used to define how many jumps left until traversal expires
 * fetchMethod may be used to override the default 'fetch' (e.g. for Solid authentication)
 * @param {URL} url
 * @param {URL[]} targetTypes
 * @param {object} typeToHandlerMap
 * @param {URL[]} followList
 * @param {URL[]} blockList
 * @param {Boolean} userProvided
 * @param {number} jumps
 * @param {function} fetchMethod
 */
export async function traverseAndFetch(
  url,
  targetTypes,
  { typeToHandlerMap = {}, followList = [], blockList = [], userProvided = true, jumps = 10, fetchMethod = fetch } = {}
) {
  let etag = "";
  fetchMethod(url, { 
    method: "HEAD",
    headers: {
      Accept: "application/ld+json",
      cache: "no-store"
    }
  }).then(headresp => { 
    if(headresp.status >= 400)  {
      console.warn("Failed HEAD method in traverse and fetch: ", headresp);
    } else { 
      etag = headresp.headers.get("etag");
      console.log("HEAD RESPONSE: ", headresp, etag)
    }
  }).then(() => {
    fetchMethod(url, {
      method: "GET",
      headers: {
        Accept: 'application/ld+json',
      },
    }).then((resp) => {
        if (resp.status >= 400) {
          console.warn("Couldn't traverse and fetch: ", resp);
        } else {
          console.log("~GOT RESPONSE: ", resp)
          return resp.json();
        }
      })
      .then((json) => jsonld.expand(json))
      .then((expanded) => {
        let resourceDescription;
        if (Array.isArray(expanded)) {
          // got an array back - find the node matching the current document (either absolute or relative URI)
          // (n.b. if there are multiple matches this will just return the first encountered - TODO consider alternatives)
          resourceDescription = expanded.find((o) => o['@id'] === url.href || o['@id'] === '' || o['@id'] === './');
          if (!resourceDescription && !url.href.endsWith('/')) {
            // try again with trailing slash
            resourceDescription = expanded.find((o) => o['@id'] === url.href + '/');
          }
        } else {
          resourceDescription = expanded;
        }
        console.log('resource description: ', resourceDescription);
        if (resourceDescription && '@type' in resourceDescription) {
          if (!Array.isArray(resourceDescription['@type'])) {
            // ensure array
            resourceDescription['@type'] = [resourceDescription['@type']];
          }
          const targetUrlStrings = targetTypes.map((t) => t.href);
          if (resourceDescription['@type'].filter((t) => targetUrlStrings.includes(t)).length) {
            // found a target resource["@id"]!
            ingestExternalResource(url, typeToHandlerMap, resourceDescription, etag);
          }
          if (jumps >= 0) {
            // attempt to continue traversal
            const followUrlStrings = followList.map((l) => l.href);
            let connectionsToFollow = Object.keys(resourceDescription).filter((predicate) =>
              followUrlStrings.includes(predicate)
            );
            connectionsToFollow.forEach(async (pred) => {
              // ensure array
              const predObjects = Array.isArray(resourceDescription[pred])
                ? resourceDescription[pred]
                : [resourceDescription[pred]];

              const blockUrlStrings = blockList.map((l) => l.href);
              predObjects.forEach((obj) => {
                try {
                  // recur if object is a URL and not in block list
                  if (!'@id' in obj || blockUrlStrings.includes(obj['@id'])) {
                    throw Error('target is a literal or target URI on blockList');
                  }
                  let objUrl = new URL(obj['@id']);
                  // politely continue traversal
                  setTimeout(
                    () =>
                      traverseAndFetch(objUrl, targetTypes, {
                        typeToHandlerMap,
                        followList,
                        blockList: [new URL(url.href), ...blockList],
                        userProvided: false,
                        jumps: jumps - 1,
                        fetchMethod,
                      }),
                    politeness
                  );
                } catch {
                  // noop (non-URL or blocked object)
                }
              });
            });
          }
        } else {
          console.warn('Found no matching resource description in ', url.href, resourceDescription);
        }
      });
    })
} // traverseAndFetch()

/**
 * Call (a) predefined handler(s) on the provided resource to ingest it,
 * depending on the resource's type(s). typeToHandlerMap should map type URI strings to callback functions.
 * @param {object} typeToHandlerMap
 * @param {object} resource
 */
export function ingestExternalResource(url, typeToHandlerMap, resource, etag) {
  try {
    // ensure array
    resource['@type'] = Array.isArray(resource['@type']) ? resource['@type'] : [resource['@type']];
    const mappedTypes = Object.keys(typeToHandlerMap).filter((t) => resource['@type'].includes(t));
    // call each relevant (type-matching) callback on the resource
    console.log('ingest external resource: ', mappedTypes, typeToHandlerMap, resource, etag);
    mappedTypes.forEach((t) => {
      'args' in typeToHandlerMap[t] ? 
        typeToHandlerMap[t].func(resource, url, etag, ...typeToHandlerMap[t].args) : 
        typeToHandlerMap[t].func(resource, url, etag)  
    });
  } catch (e) {
    console.error("Couldn't ingest external resource: ", e);
  }
}// ingestExternalResource()

export async function refetchElement(url, etag, onResourceChanged, liveUpdateRate, fetchMethod = fetch) {
  console.log("Live updating element ", Date.now(), url, etag);
  fetchMethod(url, { 
    method: 'HEAD',
    headers: { 
      "If-None-Match": etag,
      Accept: 'application/ld+json',
      cache: "no-store"
    }
   }).then(async headResp=> {
    let updatedEtag = headResp.headers.get("etag");
    if(!etag) {
      etag = updatedEtag;
    } else if(etag !== updatedEtag)  {
        console.log("Live update - change detected to ", url, etag, updatedEtag)
        // resource has changed! 
        onResourceChanged();
        etag = updatedEtag;
    } else { 
      console.log("Live update - no change to ", url, etag);
    }
  }).catch((e) => {
    console.warn("Error attempting live update: ", e, url, etag);
  }).finally(() => {
    //setTimeout(() => liveUpdateElement(url, etag, onResourceChanged, liveUpdateRate, fetchMethod), liveUpdateRate);
  })
}
