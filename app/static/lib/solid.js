const solid = solidClientAuthentication.default;

const FOAF = "http://xmlns.com/foaf/0.1/";

export async function populateSolidTab() { 
  const solidTab = document.getElementById("solidTab");
  if(solid.getDefaultSession().info.isLoggedIn) {
    console.log("HELLO!")
    solidTab.innerHTML = await populateLoggedInSolidTab();
  } else {
    solidTab.innerHTML = await populateLoggedOutSolidTab();
    document.getElementById('solidLogin').addEventListener('click', loginAndFetch)
  }
}

async function populateLoggedInSolidTab() { 
  const webId = solid.getDefaultSession().info.webId;
  const profile = await solid.fetch(webId, { 
    headers: { 
      Accept: "application/ld+json"
    }
  }).then(resp => resp.json());
  let name = webId;
  // try to find entry for 'me' (i.e. the user's webId) in profile:
  let me = profile.filter(e => "@id" in e && e["@id"] === webId);
  if(me.length) { 
    if(me.length > 1) { 
      console.warn("User's solid profile has multiple entries for their webId!");
    }
    if(`${FOAF}name` in me[0]) {
      let foafName = me[0][`${FOAF}name`][0]; // TODO decide what to do in case of multiple foaf:names
      if(typeof foafName === "string") { 
        name = foafName;
      } else if(typeof foafName === "object" && "@value" in foafName) { 
        name = foafName["@value"];
      }
    }     
  }
  
  return `Welcome, <span id='welcomeName' title='${webId}'>${name}</span>!`;
}

function populateLoggedOutSolidTab() {
  return 'Please <a id="solidLogin">Click here to log in!</a>';
}

export async function loginAndFetch() {
  // 1. Call `handleIncomingRedirect()` to complete the authentication process.
  //    If called after the user has logged in with the Solid Identity Provider, 
  //      the user's credentials are stored in-memory, and
  //      the login process is complete. 
  //   Otherwise, no-op.  
  await solid.handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!solid.getDefaultSession().info.isLoggedIn) {
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

  /*
  // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
  // The user must have logged in as someone with the appropriate access to the specified URL.
  
  // For example, the user must be someone with Read access to the specified URL.
  const myDataset = await solid.getSolidDataset(
    "https://musicog.solidcommunity.net",
    { fetch: solid.fetch }
  );

  // ...
  
  // For example, the user must be someone with Write access to the specified URL.
  const savedSolidDataset = await saveSolidDatasetAt(
    "https://storage.inrupt.com/somepod/todolist",
    myChangedDataset,
    { fetch: fetch }
  );*/
}
