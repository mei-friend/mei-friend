
// namespace definitions
export const nsp = {
  "DCT": "http://purl.org/dc/terms/",
  "FOAF": "http://xmlns.com/foaf/0.1/",
  "FRBR": "http://purl.org/vocab/frbr/core#",
  "LDP": "http://www.w3.org/ns/ldp#",
  "MAO": "https://domestic-beethoven.eu/ontology/1.0/music-annotation-ontology.ttl#",
  "OA": "http://www.w3.org/ns/oa#",
  "PIM": "http://www.w3.org/ns/pim/space#",
  "RDF": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "RDFS": "http://www.w3.org/2000/01/rdf-schema#",
}

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
  fetchMethod(url, {
    headers: {
      Accept: 'application/ld+json',
    },
  })
    .then((resp) => {
      if (resp.status >= 400) {
        throw Error(resp);
      } else {
        return resp.json();
      }
    })
    .then((json) => jsonld.expand(json))
    .then((expanded) => {
      let resourceDescription;
      if (Array.isArray(expanded)) {
        resourceDescription = expanded.find((o) => o['@id'] === url.href);
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
          ingestExternalResource(typeToHandlerMap, resourceDescription);
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
                setTimeout(() => 
                  traverseAndFetch(objUrl, targetTypes, {
                    typeToHandlerMap,
                    followList,
                    blockList: [new URL(resourceDescription['@id']), ...blockList],
                    userProvided: false,
                    jumps: jumps - 1,
                  }), politeness);
              } catch {
                // noop (non-URL or blocked object)
              }
            });
          });
        }
      }
    })
} // fetchExternalResource()