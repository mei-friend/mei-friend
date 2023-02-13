const solid = solidClientAuthentication.default;

export async function populateSolidTab() { 
  const solidTab = document.getElementById("solidTab");
  if(solid.getDefaultSession().info.isLoggedIn) {
    solidTab.innerHTML = "You are logged in! Welcome!";
  } else {
    solidTab.innerHTML = 'Please <a id="solidLogin">Click here to log in!</a>';
  }
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
    solid.fetch("https://musicog.solidcommunity.net/private/")
        .then(resp => resp.text())
        .then(data => console.log("GOT DATA: ", data))
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
