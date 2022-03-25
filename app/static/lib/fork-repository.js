import {
  calcSizeOfContainer
} from './resizer.js';
import { 
  sampleEncodings,
  samp
} from './main.js';

const seperator = "|MEI-FRIEND|"; 

function onSelectComposer(e) { 
  const orgSelector = document.querySelector("#forkRepertoireOrganization");
  orgSelector.innerHTML = '<option value="">All GitHub users and organizations</option>';
  orgSelector.removeEventListener("change", onSelectOrganization);
  orgSelector.addEventListener("change", onSelectOrganization);
  const repoSelector = document.querySelector("#forkRepertoireRepository");
  // clear repository selector
  repoSelector.innerHTML = '<option value="">Choose a repository</option>';
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

function onSelectOrganization(e) { 
  // clear repository selector
  const repoSelector = document.querySelector("#forkRepertoireRepository");
  repoSelector.innerHTML = '<option value="">Choose a repository</option>';
  repoSelector.removeEventListener("change", onSelectRepository);
  repoSelector.addEventListener("change", onSelectRepository);
  let githubOrg;
  let repos = new Set();
  if(e) {
    githubOrg = e.target.value;
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
  console.log("REPO SELECTED: ", e)
  if(e.target.value) { 
    const orgRepo = e.target.value.split(seperator);
    const orgInput = document.querySelector("#forkRepositoryInputName")
    const repoInput = document.querySelector("#forkRepositoryInputRepo");
    orgInput.value = orgRepo[0];
    repoInput.value = orgRepo[1];
  }
}


export function forkRepository(github) {
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('.forkRepositoryOverlay');
  fc.width = sz.width * .25;
  fc.height = sz.height * .25;
  fc.style.display = "block";
  let forkToSelector = document.querySelector("#forkRepositoryToSelector");
  let composerSelector = document.querySelector("#forkRepertoireComposer");
  let organizationSelector = document.querySelector("#forkRepertoireOrganization");
  let repositorySelector = document.querySelector("#forkRepertoireRepository");

  // initialise public repertoire dropdowns
  composerSelector.innerHTML = '<option value="">All composers</option>';
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
}

export function forkRepositoryCancel() {
  // user has cancelled the "fork repository" action
  // => hide fork interface
  let forkRepositoryElement = document.querySelector(".forkRepositoryOverlay");
  // show file status, hide forkRepository
  forkRepositoryElement.style.display = "none";
}
