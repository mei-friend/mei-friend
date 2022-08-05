import {
  calcSizeOfContainer
} from './resizer.js';
import { 
  sampleEncodings,
  samp, 
  github
} from './main.js';
import {
  forkRepoClicked
} from './github-menu.js';

const seperator = "|MEI-FRIEND|"; 

function onOrganizationInputChange(e) { 
  console.log("CHANGE: ", e)
  if(e.target.value) { 
    const userOrgRepos = document.getElementById("forkRepositoryInputRepo");
    userOrgRepos.innerHTML = '<option value="" disabled selected hidden>Choose a repository</option>';
    document.getElementById("forkRepoGithubLogo").classList.add("clockwise");
    let repos = fillInUserOrgRepos();
  }
}

function onSelectComposer(e) { 
  const orgSelector = document.querySelector("#forkRepertoireOrganization");
  orgSelector.innerHTML = '<option value="" >All GitHub users and organizations</option>';
  orgSelector.removeEventListener("change", onSelectOrganization);
  orgSelector.addEventListener("change", onSelectOrganization);
  const repoSelector = document.querySelector("#forkRepertoireRepository");
  // clear repository selector
  repoSelector.innerHTML = '<option value="" disabled selected hidden>Choose a repository</option>';
  repoSelector.removeEventListener("change", onSelectRepository);
  repoSelector.addEventListener("change", onSelectRepository);
  let composer = false;
  if(e) { 
    composer = e.target.value;
  }
  let orgs = new Set(); 
  let repos = new Set();
  if(composer) { 
    // filter organizations to only those containing composer's works
    const composerEntries  = sampleEncodings.filter((s) => s[samp.COMPOSER] === composer);
    composerEntries.forEach( s => { 
      orgs.add(s[samp.ORG]); 
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    })
  } else { 
    sampleEncodings.forEach( s => { 
      orgs.add(s[samp.ORG]); 
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    })
    console.log("INITIALISED: ", repos, orgs)
  }
  Array.from(orgs).sort().forEach(o => {
    let orgOpt = document.createElement('option');
    orgOpt.text = o;
    orgOpt.value = o;
    orgSelector.appendChild(orgOpt);
  });
  Array.from(repos).sort().forEach(r => { 
    let repoOpt = document.createElement('option');
    repoOpt.text = r.split(seperator)[1];
    repoOpt.value = r;
    repoSelector.appendChild(repoOpt);
  });
}

async function fillInUserOrgRepos(per_page = 30, page = 1) {
  // read a page of repos from the specified user or organisation
  // add it to the repository drop-down,
  // recursing to fetch next page, if applicable
  const userOrg = document.getElementById("forkRepositoryInputName").value;
  const repertoireRepo = document.getElementById("forkRepertoireRepository");
  const userOrgRepos = document.getElementById("forkRepositoryInputRepo");
  const status = document.getElementById("forkRepositoryStatus");
  status.classList.remove("warn");
  status.innerHTML = "";
  if(userOrg) { // user or org specified
    const prevRepos = userOrgRepos.childNodes;
    const repos = await github.getSpecifiedUserOrgRepos(userOrg, per_page, page);
    if(Array.isArray(repos)) { 
      repos.forEach((repo) => {
        const repoOpt = document.createElement("option");
        repoOpt.text = repo.name;
        repoOpt.value = repo.name;
        userOrgRepos.appendChild(repoOpt);
      });
      if(repos.length && repos.length === per_page) { 
        // there may be more repos on the next page
        fillInUserOrgRepos(per_page, page+1);
      } else { 
        // finished!
        document.getElementById("forkRepoGithubLogo").classList.remove("clockwise");
      }
    } else { 
      // give up!
      document.getElementById("forkRepoGithubLogo").classList.remove("clockwise");
      status.innerHTML = "Sorry, can't access repositories for supplied user" + 
        " or organization.";
      if("message" in repos) { 
        status.innerHTML += " GitHub message: <i>" + repos["message"] + "</i>";
      }   
    }
  }
}

function onSelectOrganization(e) { 
  const orgInput = document.querySelector("#forkRepositoryInputName")
  // clear repository selector
  const repoSelector = document.querySelector("#forkRepertoireRepository");
  repoSelector.innerHTML = '<option value="">Choose a repository</option>';
  repoSelector.removeEventListener("change", onSelectRepository);
  repoSelector.addEventListener("change", onSelectRepository);
  let githubOrg;
  let repos = new Set();
  if(e) {
    githubOrg = e.target.value;
    orgInput.value = e.target.value;
    orgInput.dispatchEvent(new Event("change"));
  } 
  if(githubOrg) { 
    const orgEntries  = sampleEncodings.filter((s) => s[samp.ORG] === githubOrg);
    orgEntries.forEach( s => { 
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    })
  } else { 
    sampleEncodings.forEach( s=> { 
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    })
  }
  Array.from(repos).sort().forEach(r => { 
    let repoOpt = document.createElement('option');
    repoOpt.text = r.split(seperator)[1];
    repoOpt.value = r;
    repoSelector.appendChild(repoOpt);
  });
}

function onSelectRepository(e) {
  if(e.target.value) { 
    const orgRepo = e.target.value.split(seperator);
    const orgInput = document.querySelector("#forkRepositoryInputName")
    const repoInput = document.querySelector("#forkRepositoryInputRepo");
    orgInput.value = orgRepo[0];
    repoInput.value = orgRepo[1];
  }
}

export function forkAndOpen(github, url) { 
  console.log("FORK AND OPEN: ", github, url);
  // ensure URL matches our expectations
  // (fully qualified raw github url)
  const components = url.match(/https?:\/\/raw.githubusercontent.com\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);
  if(components.length === 5) { 
    let sz = calcSizeOfContainer();
    let fc = document.querySelector('#forkAndOpenOverlay');
    fc.width = sz.width * .25;
    fc.height = sz.height * .25;
    fc.style.display = "block";
    let userOrg = components[1];
    let repo = components[2];
    let branch = components[3];
    let file = components[4];
    
    document.querySelector("#forkRepoRequested")
      .innerText = `${components[1]}/${components[2]}`;
 
    let forkToSelector = document.getElementById("forkAndOpenSelector");
    // forkToSelector: User's options as to where to fork the repository to
    forkToSelector.innerHTML = `<option value="${github.userLogin}">${github.userLogin}</option>`
    github.getOrganizations().then((orgs) => orgs.forEach((org) => {
      try { 
        let orgName = org.organization.login;
        forkToSelector.innerHTML += `<option value="${orgName}">${orgName}</option>`;
      } 
      catch(e) { console.error("Can't add organization to selector: ", org, e) };
    }));
    // forkAndOpen fork button
    const forkAndOpenButton = document.getElementById('forkAndOpenButton');
    if(forkAndOpenButton) { 
      forkAndOpenButton.addEventListener('click', forkAndOpenClicked(github, components))
    }
  }
  else { 
    console.warn("'fork' parameter specified but supplied URL violates raw GitHub URL expectations");
  }
}

export function forkAndOpenClicked(github, components) {
  // set up values for forkRepoClicked():
  document.getElementById('forkRepositoryInputName').value = components[1];
  document.getElementById('forkRepositoryInputRepo').value = components[2];
  forkRepoClicked();
}

export function forkRepository(github, components) {
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('#forkRepositoryOverlay');
  fc.width = sz.width * .25;
  fc.height = sz.height * .25;
  fc.style.display = "block";
  // public repertoire selectors:
  let composerSelector = document.querySelector("#forkRepertoireComposer");
  let organizationSelector = document.querySelector("#forkRepertoireOrganization");
  let repositorySelector = document.querySelector("#forkRepertoireRepository");
  // fork UI:
  let organizationNameInput = document.querySelector("#forkRepositoryInputName");
  let forkRepoSelector = document.querySelector("#forkRepositoryInputRepo");
  let forkToSelector = document.querySelector("#forkRepositoryToSelector");
  // initialise public repertoire dropdowns
  composerSelector.innerHTML = '<option value="" >All composers</option>';
  let composers = new Set(sampleEncodings.map(s => s[samp.COMPOSER]));
  Array.from(composers).sort().forEach(c => {
    let composerOpt = document.createElement('option');
    composerOpt.text = c;
    composerOpt.value = c;
    composerSelector.appendChild(composerOpt);
  })

  composerSelector.removeEventListener("change", onSelectComposer);
  composerSelector.addEventListener("change", onSelectComposer);
  organizationSelector.removeEventListener("change", onSelectOrganization);
  organizationSelector.addEventListener("change", onSelectOrganization);
  repositorySelector.removeEventListener("change", onSelectRepository);
  repositorySelector.addEventListener("change", onSelectRepository);
  organizationNameInput.removeEventListener("change", onOrganizationInputChange);
  organizationNameInput.addEventListener("change", onOrganizationInputChange);

  onSelectComposer(); // initialise

  // forkToSelector: User's options as to where to fork the repository to
  forkToSelector.innerHTML = `<option value="${github.userLogin}">${github.userLogin}</option>`
  github.getOrganizations().then((orgs) => orgs.forEach((org) => {
    try { 
      let orgName = org.organization.login;
      forkToSelector.innerHTML += `<option value="${orgName}">${orgName}</option>`;
    } 
    catch(e) { console.error("Can't add organization to selector: ", org, e) };
  }));

  if(organizationNameInput.value.length) {
    document.getElementById("forkRepoGithubLogo").classList.add("clockwise");
    fillInUserOrgRepos(); // initialise with pre-supplied name
  }
}

export function forkRepositoryCancel() {
  // user has cancelled the "fork repository" action
  // => hide fork interface
  // n.b. there are two, 'normal' and forkAndOpen, so we have to iterate:
  let forkRepositoryElements = Array.from(document.querySelectorAll(".forkRepositoryOverlay"));
  // show file status, hide forkRepository
  forkRepositoryElements.forEach(e => e.style.display = "none");
}
