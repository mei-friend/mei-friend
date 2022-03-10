import { 
  forkRepository,
  forkRepositoryCancel
} from './fork-repository.js';
import { 
  cm,
  github, // github instance
  handleEncoding,
  setFileChangedState,
  setGithubInstance, // github instance setter
  setMeiFileInfo,
  storage,
  updateFileStatusDisplay,
  updateGithubInLocalStorage,
  updateLocalStorage,
  v
} from './main.js';
import Github from './github.js'; // github class
function forkRepo() { 
  forkRepository(github);
}

function forkRepoClicked() { 
  let inputName = document.getElementById('forkRepositoryInputName').value
  let inputRepo = document.getElementById('forkRepositoryInputRepo').value
  let forkRepositoryStatus = document.querySelector("#forkRepositoryStatus");
  let forkRepositoryToSelector= document.querySelector("#forkRepositoryToSelector");
  if(inputName && inputRepo) { 
    let githubRepo = `${inputName}/${inputRepo}`;
    github.githubRepo = githubRepo;
    github.fork(() => {
      forkRepositoryStatus.classList.remove("warn");
      forkRepositoryStatus.innerHTML = "";
      fillInRepoBranches();
      forkRepositoryCancel();
    }, forkRepositoryToSelector.value)
      .catch((e) => { 
        forkRepositoryStatus.classList.add("warn");
        forkRepositoryStatus.innerHTML = "Sorry, couldn't fork repository";
        if(typeof e === "object" && "status" in e) {
          forkRepositoryStatus.innerHTML = 
            e.status + " " + e.statusText;
          if(e.status !== 404) {
            e.json().then((err) => {
              if ('message' in err) 
                forkRepositoryStatus.innerHTML += ". Github message: <i>" 
                  + err.message + "</i>";
            })
          }
        }
      });
  }
}

function forkRepoCancelClicked() { 
  let menuList = document.querySelectorAll(".dropdown-content");
  menuList.forEach((e) => e.classList.remove('show'));
  forkRepositoryCancel();
};

function repoHeaderClicked() { 
  github.filepath = "";
  console.log("REPO HEADER CLICKED. Filepath was: ", github.filepath)
  refreshGithubMenu();
}

function branchesHeaderClicked(ev) { 
  console.log("BRANCHES HEADER CLICKED. Filepath was: ", github.filepath)
  github.filepath = "";
  fillInRepoBranches(ev.target);
}

function contentsHeaderClicked(ev) { 
  console.log("CONTENTS HEADER CLICKED. Filepath was: ", github.filepath)
  github.filepath = github.filepath.substr(0, github.filepath.lastIndexOf('/'));
  github.filepath = github.filepath.length === 0 ? "/" : github.filepath;
  console.log("CONTENTS HEADER CLICKED. Filepath now: ", github.filepath)
  fillInBranchContents(ev.target);
}

function userRepoClicked(ev) { 
  // re-init github object with selected repo
  const author = github.author;
  setGithubInstance(new Github(
    ev.target.innerText,
    github.githubToken,
    github.branch,
    github.filepath,
    github.userLogin,
    author.name,
    author.email
  ))
  fillInRepoBranches(ev);
}

function repoBranchClicked(ev) { 
  console.log("REPO BRANCH CLICKED. Filepath was: ", github.filepath)
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  github.branch = ev.target.innerText;
  github.filepath = "/";
  githubLoadingIndicator.classList.add("clockwise");
  github.readGithubRepo().then(() => {
    fillInBranchContents(ev)
    githubLoadingIndicator.classList.remove("clockwise");
  }).catch(() => {
    console.warn("Couldn't read Github repo to fill in branch contents");
    githubLoadingIndicator.classList.remove("clockwise");
  });
}

function branchContentsDirClicked(ev) { 
  console.log("BRANCH CONTENTS DIR CLICKED. Filepath was: ", github.filepath)
  if (github.filepath.endsWith("/")) {
    github.filepath += ev.target.querySelector("span.filepath").innerText + "/";
  } else {
    github.filepath += "/" + ev.target.querySelector("span.filepath").innerText + "/";
  }
  console.log("after BRANCH CONTENTS DIR CLICKED. Filepath now: ", github.filepath)
  fillInBranchContents(ev);
}

function branchContentsFileClicked(ev) { 
  console.log("BRANCH CONTENTS FILE CLICKED. Filepath was: ", github.filepath)
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  github.filepath += ev.target.innerText ;
  console.log("after BRANCH CONTENTS FILE CLICKED. Filepath NOW: ", github.filepath)
  console.debug(`Loading file: https://github.com/${github.githubRepo}/${github.filepath}`);
  fillInBranchContents(ev);
  githubLoadingIndicator.classList.add("clockwise");
  github.readGithubRepo().then(() => {
    githubLoadingIndicator.classList.remove("clockwise");
    document.querySelector(".statusbar").innerText = "Loading from Github...";
    v.clear();
    v.updateNotation = false;
    setMeiFileInfo(
      github.filepath,          // meiFileName
      github.githubRepo,        // meiFileLocation
      github.githubRepo + ":"   // meiFileLocationPrintable
    );
    handleEncoding(github.content);
    updateFileStatusDisplay();
    /*
    loadDataInEditor(github.content)
    setFileChangedState(false);
    updateLocalStorage(github.content);
    v.updateNotation = true;
    v.updateAll(cm);*/
  }).catch((err) => {
    console.error("Couldn't read Github repo to fill in branch contents:", err);
    //githubLoadingIndicator.classList.remove("clockwise");
  })
}

function assignGithubMenuClickHandlers() {
  // This function is called repeatedly during runtime as the content of the
  // Github menu is dynamic. Therefore, we remove all event listeners below
  // before adding them, to avoid attaching multiple identical listeners.
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  const logoutButton = document.getElementById('GithubLogout');
  if (logoutButton) {
    logoutButton.removeEventListener('click', logoutFromGithub);
    logoutButton.addEventListener('click', logoutFromGithub);
  }
  const forkRepositoryElement = document.getElementById('forkRepository');
  if (forkRepositoryElement) {
    forkRepositoryElement.removeEventListener('click', forkRepo);
    forkRepositoryElement.addEventListener('click', forkRepo)
  }

  const forkRepositoryButton = document.getElementById('forkRepositoryButton');
  const forkRepositoryCancelButton = document.getElementById('forkRepositoryCancel');
  if (forkRepositoryButton) { 
    forkRepositoryButton.removeEventListener('click', forkRepoClicked)
    forkRepositoryButton.addEventListener('click', forkRepoClicked)
  }
  
  if (forkRepositoryCancelButton) { 
    forkRepositoryCancelButton.removeEventListener('click', forkRepoCancelClicked);
    forkRepositoryCancelButton.addEventListener('click', forkRepoCancelClicked);
  }

  const repoHeader = document.getElementById('repositoriesHeader');
  if (repoHeader) {
    // on click, reload list of all repositories
    repoHeader.removeEventListener('click', repoHeaderClicked);
    repoHeader.addEventListener('click', repoHeaderClicked);
  }
  const branchesHeader = document.getElementById('branchesHeader');
  if (branchesHeader) {
    // on click, reload list of branches for current repo
    branchesHeader.removeEventListener('click', branchesHeaderClicked);
    branchesHeader.addEventListener('click', branchesHeaderClicked);
  }
  const contentsHeader = document.getElementById('contentsHeader');
  if (contentsHeader) {
    // on click, move up one directory level in the branch contents
    contentsHeader.removeEventListener('click', contentsHeaderClicked);
    contentsHeader.addEventListener('click', contentsHeaderClicked);
  }
  Array.from(document.getElementsByClassName('userRepo')).forEach((e) => {
    e.removeEventListener('click', userRepoClicked);
    e.addEventListener('click', userRepoClicked);
  });
  Array.from(document.getElementsByClassName('repoBranch')).forEach((e) => {
    e.removeEventListener('click', repoBranchClicked);
    e.addEventListener('click', repoBranchClicked);
  });
  Array.from(document.getElementsByClassName('branchContents')).forEach((e) => {
    if (e.classList.contains("dir")) {
      // navigate directory
      e.removeEventListener('click', branchContentsDirClicked);
      e.addEventListener('click', branchContentsDirClicked);
    } else {
      // load file
      e.removeEventListener('click', branchContentsFileClicked);
      e.addEventListener('click', branchContentsFileClicked);
    }
  })
}

export async function fillInUserRepos(per_page = 30, page = 1) {
  const repos = await github.getUserRepos(per_page, page);
  let githubMenu = document.getElementById("GithubMenu");
  repos.forEach((repo) => {
    githubMenu.innerHTML += `<a class="userRepo" href="#">${repo.full_name}</a>`;
  })
  if (repos.length && repos.length === per_page) {
    // there may be more repos on the next page
    fillInUserRepos(per_page, page + 1);
  }
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

export async function fillInRepoBranches(e, per_page = 100, page = 1) {
  // TODO handle > per_page branches (similar to userRepos)
  const repoBranches = await github.getRepoBranches(per_page, page);
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `
  <a id="GithubLogout" href="#">Log out</a>
  <hr class="dropdown-line">
  <a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" class="dropdown-head" href="#"><b>Select branch:</b></a>
    `;
  Array.from(repoBranches).forEach((branch) => {
    githubMenu.innerHTML += `<a class="repoBranch" href="#">${branch.name}</a>`;
  });
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

export async function fillInBranchContents(e) {
  // TODO handle > per_page files (similar to userRepos)
  let target;
  if (e) { // not present if restoring from local storage
    target = e.target;
  }
  const branchContents = await github.getBranchContents(github.filepath);
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `
  <a id="GithubLogout" href="#">Log out</a>
  <hr class="dropdown-line">
  <a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Branch: ${github.branch}</a>
    <hr class="dropdown-line">
    <a id="contentsHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Path: <span class="filepath">${github.filepath}</span></a>
    `;
  if (e && target && target.classList.contains("filepath")) {
    // clicked on file name -- operate on parent (list entry) instead
    target = e.target.parentNode;
  }
  if (e && (target && target.classList.contains("repoBranch") || 
      target.classList.contains("dir") || 
      target.getAttribute("id") === "contentsHeader")) {
    Array.from(branchContents).forEach((content) => {
      const isDir = content.type === "dir";
      githubMenu.innerHTML += `<a class="branchContents ${content.type}${isDir ? '': ' closeOnClick'}" href="#">` +
        //  content.type === "dir" ? '<span class="btn icon icon-file-symlink-file inline-block-tight"></span>' : "" +
        `<span class="filepath${isDir ? '':' closeOnClick'}">${content.name}</span>${isDir ? "..." : ""}</a>`;
    });
  } else {
    // User clicked file, or restoring from local storage. Display commit interface
    if (storage.supported && github.filepath) {
      storage.fileLocationType = "github";
    }
    const commitUI = document.createElement("div");
    commitUI.setAttribute("id", "commitUI");
    const commitMessageInput = document.createElement("input");
    commitMessageInput.setAttribute("type", "text");
    commitMessageInput.setAttribute("id", "commitMessageInput");
    commitMessageInput.setAttribute("placeholder", "Updated using mei-friend online");
    const commitButton = document.createElement("input");
    commitButton.setAttribute("id", "commitButton");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Commit");
    commitButton.classList.add("closeOnClick");
    commitButton.addEventListener("click", handleCommitButtonClicked);
    commitUI.appendChild(commitMessageInput);
    commitUI.appendChild(commitButton);
    githubMenu.appendChild(commitUI);
    setFileChangedState(fileChanged);
  }
  fillInCommitLog("withRefresh");
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInCommitLog(refresh = false) {
  if (refresh) {
    const githubLoadingIndicator = document.getElementById("GithubLogo");
    githubLoadingIndicator.classList.add("clockwise");
    github.readGithubRepo().then(() => {
      githubLoadingIndicator.classList.remove("clockwise");
      renderCommitLog();
    }).catch((e) => {
      githubLoadingIndicator.classList.remove("clockwise");
      console.warn("Couldn't read github repo, forcing log-out: ", e);
//      logoutFromGithub();
    })
  } else {
    renderCommitLog();
  }
}

export function renderCommitLog() {
  let logTable = document.getElementById("logTable");
  if (logTable) {
    // clear up previous logTable if it exists
    logTable.remove();
    document.getElementById("commitLogSeperator").remove();
  }
  logTable = document.createElement("table");
  logTable.setAttribute("id", "logTable");
  let githubMenu = document.getElementById("GithubMenu");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Date</th><th>Author</th><th>Message</th><th>Commit</th>";
  logTable.appendChild(headerRow);
  github.commitLog.forEach((c) => {
    const commitRow = document.createElement("tr");
    commitRow.innerHTML = `
      <td>${c.commit.author.date}</td>
      <td><a href="${c.author.html_url}">${c.commit.author.name}</a></td>
      <td>${c.commit.message}</td>
      <td><a target="_blank" href="https://github.com/${github.githubRepo}/commits/${c.sha}">${c.sha.slice(0,8)}...</a></td>`;
    logTable.appendChild(commitRow);
  })
  const commitLogHeader = document.createElement("a");
  commitLogHeader.setAttribute("id", "commitLogHeader");
  commitLogHeader.innerText = "Commit Log";
  const hr = document.createElement("hr");
  hr.classList.add("dropdown-line");
  hr.setAttribute("id", "commitLogSeperator");
  githubMenu.appendChild(hr);
  githubMenu.appendChild(logTable);
}

export function logoutFromGithub() {
  if (storage.supported) {
    // remove github object from local storage
    storage.removeItem("github");
  }
  // redirect to /logout to remove session cookie
  const url = window.location.href;
  window.location.replace(url.substring(0, url.lastIndexOf("/")) + "/logout");
}

export function refreshGithubMenu(e) {
  // display Github name
  document.getElementById("GithubName").innerText =
    github.author.name === "None" ? github.userLogin : github.author.name;
  // populate Github menu
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.classList.remove("loggedOut");
  githubMenu.innerHTML = `<a id="GithubLogout" href="#">Log out</a>`
  if (!github.filepath) {
    githubMenu.innerHTML += `
    <hr class="dropdown-line">
    <a id="forkRepository" href="#">Fork repository...</b></a>
    <hr class="dropdown-line">
    <a id="repositoriesHeader" class="dropdown-head" href="#"><b>Select repository:</b></a>`;
    fillInUserRepos();
  }
}

// handle Github commit UI
function handleCommitButtonClicked(e) {
  // TODO Let user know of success / failure, allow user to do something about it
  const messageInput = document.getElementById("commitMessageInput");
  const message = messageInput.value;
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  // lock editor while we are busy commiting
  cm.readOnly = "nocursor"; // don't allow editor focus
  // try commiting to Github
  githubLoadingIndicator.classList.add("clockwise");
  github.writeGithubRepo(cm.getValue(), message)
    .then(() => {
      console.debug(`Successfully written to github: ${github.githubRepo}${github.filepath}`);
      messageInput.value = "";
      github.readGithubRepo()
        .then(() => {
          githubLoadingIndicator.classList.remove("clockwise");
          cm.readOnly = false;
          setFileChangedState(false);
          updateGithubInLocalStorage();
          fillInCommitLog("withRefresh");
          console.debug("Finished updating commit log after writing commit.");
        })
        .catch((e) => {
          cm.readOnly = false;
          githubLoadingIndicator.classList.remove("clockwise");
          console.warn("Couldn't read Github repo after writing commit: ", e, github);
        })
    })
    .catch((e) => {
      githubLoadingIndicator.classList.remove("clockwise");
      console.warn("Couldn't commit Github repo: ", e, github)
    });
}
