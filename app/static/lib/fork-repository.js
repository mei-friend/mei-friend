import {
  calcSizeOfContainer
} from './resizer.js';

export function forkRepository(github) {
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('.forkRepositoryOverlay');
  fc.width = sz.width * .25;
  fc.height = sz.height * .25;
  fc.style.display = "block";
  let selector = document.querySelector("#forkRepositoryToSelector");
  selector.innerHTML = `<option value="${github.userLogin}">${github.userLogin}</option>`
  github.getOrganizations().then((orgs) => orgs.forEach((org) => {
    try { 
      let orgName = org.organization.login;
      selector.innerHTML += `<option value="${orgName}">${orgName}</option>`;
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
