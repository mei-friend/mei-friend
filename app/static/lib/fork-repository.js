import {
  calcSizeOfContainer
} from './resizer.js';
import { 
  sampleEncodings,
  samp
} from './main.js';

function onSelectComposer(e) { 
  const orgSelector = document.querySelector("#forkRepertoireOrganization");
  const repoSelector = document.querySelector("#forkRepertoireRepository");
  // clear repository selector
  repoSelector.innerHTML = '<option value="">Choose a repository</option>';
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
      repos.add(s[samp.REPO]);
    })
  } else { 
    sampleEncodings.forEach( s => { 
      orgs.add(s[samp.ORG]); 
      repos.add(s[samp.REPO]);
    })
  }
  Array.from(orgs).sort().forEach(o => {
    let orgOpt = document.createElement('option');
    orgOpt.text = o;
    orgOpt.value = o;
    orgSelector.appendChild(orgOpt);
  });
  Array.from(repos).sort().forEach(r => { 
    let repoOpt = document.createElement('option');
    repoOpt.text = r;
    repoOpt.value = r;
    repoSelector.appendChild(repoOpt);
  });
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
