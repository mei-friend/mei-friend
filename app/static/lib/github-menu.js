import { forkRepository, forkRepositoryCancel } from './fork-repository.js';
import {
  cm,
  fileChanged,
  fileLocationType,
  generateUrl,
  github, // github instance
  handleEncoding,
  isMEI,
  meiFileName,
  setFileChangedState,
  setFileLocationType,
  setGithubInstance, // github instance setter
  setMeiFileInfo,
  setStandoffAnnotationEnabledStatus,
  storage,
  translator,
  updateFileStatusDisplay,
  updateGithubInLocalStorage,
  v,
} from './main.js';
import * as icon from './../css/icons.js';
import Github from './github.js'; // github class


const ghActionsInputSetters = [
  {
    id: "githubActionsInputSetterFilepath",
    icon: icon.fileCode,
    func: () => {
      return github.filepath.substr(1);
    }
  },
  {
    id: "githubActionsInputSetterSelection",
    icon: icon.projectTemplate,
    func: () => { 
      return v.selectedElements;
    }
  }
]

function forkRepo() {
  forkRepository(github);
}

export function forkRepoClicked() {
  // inputRepoOverride is used to supply a repository via the forkAndOpen (?fork parameter) path
  let lnputName = document.getElementById('forkRepositoryInputName').value;
  let inputRepo = document.getElementById('forkRepositoryInputRepo').value;
  let inputRepoOverride = document.getElementById('forkRepositoryInputRepoOverride').value;
  let inputBranchOverride = document.getElementById('forkRepositoryInputBranchOverride').value;
  let inputFilepathOverride = document.getElementById('forkRepositoryInputFilepathOverride').value;
  let forkRepositoryStatus = Array.from(document.getElementsByClassName('forkRepositoryStatus'));
  let forkRepositoryToSelector = document.querySelector('#forkRepositoryToSelector');
  if (inputName && (inputRepo || inputRepoOverride)) {
    inputRepo = inputRepoOverride ? inputRepoOverride : inputRepo;
    let githubRepo = `${inputName}/${inputRepo}`;
    github.githubRepo = githubRepo;
    Array.from(document.getElementsByClassName('forkRepoGithubLogo')).forEach((l) => l.classList.add('clockwise'));
    github
      .fork(() => {
        forkRepositoryStatus.forEach((s) => {
          s.classList.remove('warn');
          s.innerHTML = '';
        });
        fillInRepoBranches();
        forkRepositoryCancel();
      }, forkRepositoryToSelector.value)
      .catch((e) => {
        forkRepositoryStatus.forEach((s) => {
          s.classList.add('warn');
          s.innerHTML = translator.lang.forkError.text;
          if (typeof e === 'object' && 'status' in e) {
            s.innerHTML = e.status + ' ' + e.statusText;
            if (e.status !== 404) {
              e.json().then((err) => {
                if ('message' in err) s.innerHTML += '. Github message: <i>' + err.message + '</i>';
              });
            }
          }
        });
      })
      .finally(() => {
        if (inputRepoOverride && inputBranchOverride && inputFilepathOverride) {
          // forkAndOpen path: directly switch to specified branch and open file
          github.branch = inputBranchOverride;
          const _filepath = inputFilepathOverride.substring(0, inputFilepathOverride.lastIndexOf('/') + 1);
          const _file = inputFilepathOverride.substring(inputFilepathOverride.lastIndexOf('/') + 1);
          github.filepath = _filepath;
          setMeiFileInfo(github.filepath, github.githubRepo, github.githubRepo + ':');
          loadFile(_file);
          updateFileStatusDisplay();
        }
        document.getElementById('GithubLogo').classList.remove('clockwise');
        Array.from(document.getElementsByClassName('forkRepoGithubLogo')).forEach((l) =>
          l.classList.remove('clockwise')
        );
        document.getElementById('forkRepositoryInputRepoOverride').value = '';
        document.getElementById('forkRepositoryInputBranchOverride').value = '';
        document.getElementById('forkRepositoryInputFilepathOverride').value = '';
      });
  }
} // forkRepoClicked()

function forkRepoCancelClicked() {
  let menuList = document.querySelectorAll('.dropdownContent');
  menuList.forEach((e) => e.classList.remove('show'));
  forkRepositoryCancel();
} // forkRepoCancelClicked()

function repoHeaderClicked() {
  github.filepath = '';
  refreshGithubMenu(); // reopen
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.classList.add('forceShow');
  githubMenu.classList.add('show');
} // repoHeaderClicked()

function branchesHeaderClicked(ev) {
  github.filepath = '';
  fillInRepoBranches(ev.target);
} // branchesHeaderClicked()

function contentsHeaderClicked(ev) {
  // strip trailing slash (in case our filepath is a subdir)
  if (github.filepath.endsWith('/')) github.filepath = github.filepath.substring(0, github.filepath.length - 1);
  //  retreat to previous slash (back one directory level)
  github.filepath = github.filepath.substring(0, github.filepath.lastIndexOf('/') + 1);
  // if we've retreated past the root dir, restore it
  github.filepath = github.filepath.length === 0 ? '/' : github.filepath;
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  githubLoadingIndicator.classList.add('clockwise');
  github
    .readGithubRepo()
    .then(() => {
      fillInBranchContents(ev);
      githubLoadingIndicator.classList.remove('clockwise');
    })
    .catch(() => {
      console.warn("Couldn't read Github repo to fill in branch contents");
      githubLoadingIndicator.classList.remove('clockwise');
    });
} // contentsHeaderClicked()

async function userRepoClicked(ev) {
  // re-init github object with selected repo
  const author = github.author;
  setGithubInstance(
    new Github(
      ev.target.innerText,
      github.githubToken,
      github.branch,
      github.commit,
      github.filepath,
      github.userLogin,
      author.name,
      author.email
    )
  );
  const per_page = 100;
  const page = 1;
  const repoBranches = await github.getRepoBranches(per_page, page);
  if (repoBranches.length === 1) {
    // skip branch menu if only one branch
    github.branch = repoBranches[0].name;
    github.filepath = '/';
    fillInBranchContents(ev);
  } else {
    fillInRepoBranches(ev, repoBranches);
  }
} // userRepoClicked()

function repoBranchClicked(ev) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  github.branch = ev.target.innerText;
  github.filepath = '/';
  githubLoadingIndicator.classList.add('clockwise');
  github
    .readGithubRepo()
    .then(() => {
      fillInBranchContents(ev);
      githubLoadingIndicator.classList.remove('clockwise');
    })
    .catch(() => {
      console.warn("Couldn't read Github repo to fill in branch contents");
      githubLoadingIndicator.classList.remove('clockwise');
    });
} // repoBranchClicked()

function branchContentsDirClicked(ev) {
  let target = ev.target;
  if (!target.classList.contains('filepath')) {
    // if user hasn't clicked directly on the filepath <span>, drill down to it
    target = target.querySelector('.filepath');
  }
  if (github.filepath.endsWith('/')) {
    github.filepath += target.innerText + '/';
  } else {
    github.filepath += '/' + target.innerText + '/';
  }
  fillInBranchContents(ev);
} // branchContentsDirClicked()

function branchContentsFileClicked(ev) {
  loadFile(ev.target.innerText);
  document.getElementById('GithubMenu').classList.remove('forceShow');
} // branchContentsFileClicked()

function loadFile(fileName = "", clearBeforeLoading = true, ev = null) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  github.filepath += fileName;
  console.debug(`${translator.lang.loadingFile.text}: https://github.com/${github.githubRepo}${github.filepath}`);
  fillInBranchContents(ev);
  githubLoadingIndicator.classList.add('clockwise');
  github
    .readGithubRepo()
    .then(() => {
      githubLoadingIndicator.classList.remove('clockwise');
      cm.readOnly = false;
      document.getElementById('statusBar').innerText = translator.lang.loadingFromGithub.text + '...';
      v.allowCursorActivity = false;
      setMeiFileInfo(
        github.filepath, // meiFileName
        github.githubRepo, // meiFileLocation
        github.githubRepo + ':' // meiFileLocationPrintable
      );
      handleEncoding(github.content, true, true, clearBeforeLoading); // retains current page and selection after commit
      setFileNameAfterLoad();
      updateFileStatusDisplay();
      setFileChangedState(false);
      updateGithubInLocalStorage();
      setFileLocationType("github");
      setStandoffAnnotationEnabledStatus();
      fillInCommitLog('withRefresh');
      const fnStatus = document.getElementById('fileName');
      if (fnStatus) fnStatus.removeAttribute('contenteditable');
      v.allowCursorActivity = false;
    })
    .catch((err) => {
      console.error("Couldn't read Github repo to fill in branch contents:", err);
      githubLoadingIndicator.classList.remove('clockwise');
    });
} // loadFile()

function onFileNameEdit(e) {
  setCommitUIEnabledStatus();
} // onFileNameEdit()

function onMessageInput(e) {
  e.target.classList.remove('warn');
  if ((e.target.innerText = '')) {
    document.getElementById('githubCommitButton').setAttribute('disabled', '');
  } else {
    document.getElementById('githubCommitButton').removeAttribute('disabled');
  }
} // onMessageInput()

function assignGithubMenuClickHandlers() {
  // This function is called repeatedly during runtime as the content of the
  // Github menu is dynamic. Therefore, we remove all event listeners below
  // before adding them, to avoid attaching multiple identical listeners.
  const githubMenu = document.getElementById('GithubMenu');
  if (githubMenu) {
    githubMenu.removeEventListener('mouseleave', (e) => e.target.classList.remove('forceShow'));
    githubMenu.addEventListener('mouseleave', (e) => e.target.classList.remove('forceShow'));
  }

  const githubLoadingIndicator = document.getElementById('GithubLogo');
  const logoutButton = document.getElementById('githubLogout');
  if (logoutButton) {
    logoutButton.removeEventListener('click', logoutFromGithub);
    logoutButton.addEventListener('click', logoutFromGithub);
  }
  const forkRepositoryElement = document.getElementById('forkRepository');
  if (forkRepositoryElement) {
    forkRepositoryElement.removeEventListener('click', forkRepo);
    forkRepositoryElement.addEventListener('click', forkRepo);
  }

  const forkRepositoryButton = document.getElementById('forkRepositoryButton');
  const forkRepositoryCancelButton = document.getElementById('forkRepositoryCancel');
  if (forkRepositoryButton) {
    forkRepositoryButton.removeEventListener('click', forkRepoClicked);
    forkRepositoryButton.addEventListener('click', forkRepoClicked);
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
    if (e.classList.contains('dir')) {
      // navigate directory
      e.removeEventListener('click', branchContentsDirClicked);
      e.addEventListener('click', branchContentsDirClicked);
    } else {
      // load file
      e.removeEventListener('click', branchContentsFileClicked);
      e.addEventListener('click', branchContentsFileClicked);
    }
  });
} // assignGithubMenuClickHandlers()

export async function fillInUserRepos(per_page = 30, page = 1) {
  const repos = await github.getUserRepos(per_page, page);
  if (document.getElementById('branchesHeader')) {
    // if user has navigated away wiew while we
    // were waiting for the user repos list, abandon it
    return;
  }
  let githubMenu = document.getElementById('GithubMenu');
  repos.forEach((repo) => {
    githubMenu.innerHTML += `<a class="userRepo" href="#">${repo.full_name}</a>`;
  });
  if (repos.length && repos.length === per_page) {
    // there may be more repos on the next page
    fillInUserRepos(per_page, page + 1);
  }
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
} // fillInUserRepos()

export async function fillInRepoBranches(e, repoBranches = null, per_page = 100, page = 1) {
  // TODO handle > per_page branches (similar to userRepos)
  repoBranches = repoBranches || (await github.getRepoBranches(per_page, page));
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.innerHTML = `
    <a id="githubLogout" href="#">${translator.lang.logOut.text}</a>
    <hr class="dropdownLine">
    <a id="repositoriesHeader" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubRepository">${translator.lang.githubRepository.text}</span>: ${github.githubRepo}</a>
    <hr class="dropdownLine">
    <a id="branchesHeader" class="dropdownHead" href="#"><b>${translator.lang.selectBranch.text}:</b></a>
    `;
  Array.from(repoBranches).forEach((branch) => {
    githubMenu.innerHTML += `<a class="repoBranch" href="#">${branch.name}</a>`;
  });
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
  v.setMenuColors();
} // fillInRepoBranches()

async function markFileName(fname) {
  // purpose: assign markers like "~1" before the suffix
  // to differentiate from existing files
  // e.g. "meifile.mei" => "myfile~1.mei"
  if (!fname.endsWith('.mei')) {
    console.warn('markFileName() called on non-mei suffix: ', fname);
  }
  const without = fname.substring(0, fname.lastIndexOf('.'));
  const match = without.match('(.*)~\\d+$');
  const unmarked = match ? match[1] : without;
  let fnamesInTree;
  const containingDir = github.filepath.substring(0, github.filepath.lastIndexOf('/'));
  return github.getBranchContents(containingDir).then((tree) => {
    fnamesInTree = tree.map((contents) => contents.name);
    const prevMarked = fnamesInTree.filter((f) => f.match(without + '~\\d+.mei$'));
    let marked;
    if (prevMarked.length) {
      // marks already exist in current tree, so use "~n" where n is
      // one bigger than the largest existing mark
      const prevMarkNums = prevMarked.map((f) => f.match(without + '~(\\d+).mei$')[1]);
      const n = Math.max(...prevMarkNums) + 1;
      marked = `${unmarked}~${n}.mei`;
    } else marked = `${unmarked}~1.mei`;
    return marked;
  });
} // markFileName()

async function proposeFileName(fname) {
  // if we're here, the original file wasn't MEI
  const suffixPos = fname.lastIndexOf('.');
  let suffix = '';
  let without = fname;
  let newname;
  let nameSpan = document.getElementById('commitFileName');
  const containingDir = github.filepath.substring(0, github.filepath.lastIndexOf('/'));
  github.getBranchContents(containingDir).then((dirContents) => {
    const fnamesInTree = dirContents.map((c) => c.name);
    if (suffixPos > 0) {
      // there's a dot and it's not at the start of the name
      // => treat everything after it as the suffix
      without = fname.substring(0, suffixPos);
      suffix = fname.substring(suffixPos + 1);
    }
    if (suffix.toLowerCase() !== 'mei') {
      // see if we can get away with simply swapping suffix
      newname = without + '.mei';
      if (fnamesInTree.includes(newname)) {
        // no we can't - so mark it to differentiate
        markFileName(newname).then((marked) => {
          nameSpan.innerText = marked;
          nameSpan.dispatchEvent(new Event('input'));
        });
      } else {
        nameSpan.innerText = newname;
        nameSpan.dispatchEvent(new Event('input'));
      }
    } else {
      // file was already (mis-)named (?) as ".mei"
      // propose adding a marker like "~1" to differentiate
      markFileName(fname).then((marked) => {
        nameSpan.innerText = marked;
        nameSpan.dispatchEvent(new Event('input'));
      });
    }
  });
} // proposeFileName()

export async function fillInBranchContents(e) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  githubLoadingIndicator.classList.add("clockwise");
  // TODO handle > per_page files (similar to userRepos)
  let target = document.getElementById('contentsHeader');
  let branchContents = await github.getBranchContents(github.filepath);
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.innerHTML = `
    <a id="githubLogout" href="#">${translator.lang.logOut.text}</a>
    <hr class="dropdownLine">
    <a id="repositoriesHeader" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubRepository">${translator.lang.githubRepository.text}</span>: ${github.githubRepo}</a>
    <hr class="dropdownLine">
    <a id="branchesHeader" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubBranch">${translator.lang.githubBranch.text}</span>: ${github.branch}</a>
    <hr class="dropdownLine">
    <a id="contentsHeader" href="#"><span class="btn icon inline-block-tight filepath">${icon.arrowLeft}</span><span id="githubFilepath">${translator.lang.githubFilepath.text}</span>: <span class="filepath">${github.filepath}</span></a>
    <hr class="dropdownLine" class="actionsDivider" id="actionsDividerStart">
    `;
  // request Githug Action workflows (if any) and handle them
  github.getActionWorkflowsList().then(resp => handleWorkflowsListReceived(resp));
  if (e) {
    Array.from(branchContents).forEach((content) => {
      const isDir = content.type === 'dir';
      githubMenu.innerHTML +=
        `<a class="branchContents ${content.type}${isDir ? '' : ' closeOnClick'}" href="#">` +
        //  content.type === "dir" ? '<span class="btn icon icon-file-symlink-file inline-block-tight"></span>' : "" +
        `<span class="filepath${isDir ? '' : ' closeOnClick'}">${content.name}</span>${isDir ? '...' : ''}</a>`;
    });
  } else {
    // Either User clicked file, or we're on forkAndOpen path, or restoring from local storage. Display commit interface
    if (github.filepath) {
      setMeiFileInfo(
        github.filepath, // meiFileName
        github.githubRepo, // meiFileLocation
        github.githubRepo + ':' // meiFileLocationPrintable
      );
    }
    if (storage.supported) {
      storage.fileLocationType = 'github';
    }

    const commitUI = document.createElement('div');
    commitUI.setAttribute('id', 'commitUI');

    const commitFileName = document.createElement('span');
    commitFileName.setAttribute('contenteditable', '');
    commitFileName.setAttribute('id', 'commitFileName');
    commitFileName.setAttribute('spellcheck', 'false');

    const commitFileNameEdit = document.createElement('div');
    commitFileNameEdit.setAttribute('id', 'commitFileNameEdit');
    commitFileNameEdit.innerHTML ='<span id="commitFileNameText">' + translator.lang.commitFileNameText.text + '</span>: ';
    commitFileNameEdit.appendChild(commitFileName);

    const commitMessageInput = document.createElement('input');
    commitMessageInput.setAttribute('type', 'text');
    commitMessageInput.setAttribute('id', 'commitMessageInput');
    commitMessageInput.setAttribute('placeholder', translator.lang.commitMessageInput.placeholder);
    const commitButton = document.createElement('input');
    commitButton.setAttribute('id', 'githubCommitButton');
    commitButton.setAttribute('type', 'button');
    commitButton.classList.add('closeOnClick');
    commitButton.addEventListener('click', handleCommitButtonClicked);
    commitUI.appendChild(commitFileNameEdit);
    commitUI.appendChild(commitMessageInput);
    commitUI.appendChild(commitButton);
    githubMenu.appendChild(commitUI);
    setFileNameAfterLoad();
    setFileChangedState(fileChanged);
    commitMessageInput.removeEventListener('input', onMessageInput);
    commitMessageInput.addEventListener('input', onMessageInput);
    commitFileName.removeEventListener('input', onFileNameEdit);
    commitFileName.addEventListener('input', onFileNameEdit);

    // add "Report issue with encoding" link
    const reportIssue = document.createElement('input');
    reportIssue.setAttribute('type', 'button');
    reportIssue.id = 'reportIssueWithEncoding';
    reportIssue.value = translator.lang.reportIssueWithEncoding.value;
    reportIssue.addEventListener('click', () => {
      const openInMeiFriendUrl = `[${translator.lang.clickToOpenInMeiFriend.text}](${encodeURIComponent(generateUrl())})`;
      const fullOpenIssueUrl = `https://github.com/${github.githubRepo}/issues/new?title=Issue+with+${meiFileName}&body=${openInMeiFriendUrl}`;
      window.open(fullOpenIssueUrl, '_blank');
    });
    const reportIssueDivider = document.createElement('hr');
    reportIssueDivider.classList.add('dropdownLine');
    commitUI.appendChild(reportIssueDivider);
    reportIssue.target = '_blank';
    commitUI.appendChild(reportIssue);
  }
  fillInCommitLog('withRefresh');
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
  v.setMenuColors();
  githubLoadingIndicator.classList.remove("clockwise");
} // fillInBranchContents()

function handleWorkflowsListReceived(resp) { 
  const actionsDivider = document.getElementById("actionsDividerStart");
  if(actionsDivider) { 
    resp.forEach((wf) => {
      if(wf.state === "active") {
        let workflowSpan = document.createElement("span");
        workflowSpan.id = "gha_" + wf.id;
        workflowSpan.dataset.node_id = wf.node_id;
        workflowSpan.dataset.id = wf.id;
        workflowSpan.dataset.path = wf.path;
        workflowSpan.dataset.state = wf.state;
        workflowSpan.dataset.url = wf.url;
        workflowSpan.dataset.name = wf.name;
        workflowSpan.title = wf.url;
        workflowSpan.innerText = "GH Action: " + wf.name;
        workflowSpan.classList.add("inline-block-tight", "workflow");
        let workflowSpanContainer = document.createElement("a");
        workflowSpanContainer.onclick = handleClickGithubAction; 
        workflowSpanContainer.insertAdjacentElement("beforeend", workflowSpan);
        actionsDivider.insertAdjacentElement("afterend", workflowSpanContainer);
      } else { 
        console.warn("Skipping inactive GitHub Actions workflow: ", wf);
      }
    });
    if(resp.length) { 
      // add lower dividing line below final action
      let firstBranchContents = document.querySelector(".branchContents");
      if(firstBranchContents) {
        let actionsContentDivider = document.createElement("hr");
        actionsContentDivider.classList.add("dropdownLine");
        actionsContentDivider.classList.add("actionsDivider");
        firstBranchContents.insertAdjacentElement("beforebegin", actionsContentDivider)
      }
    }
  }
  // show or hide GitHub actions depending on user preference
  v.setGithubActionsDisplay();
}

async function fillInCommitLog(refresh = false) {
  if (refresh) {
    const githubLoadingIndicator = document.getElementById('GithubLogo');
    githubLoadingIndicator.classList.add('clockwise');
    github
      .readGithubRepo()
      .then(() => {
        githubLoadingIndicator.classList.remove('clockwise');
        renderCommitLog();
      })
      .catch((e) => {
        githubLoadingIndicator.classList.remove('clockwise');
        console.warn("Couldn't read github repo", e);
      });
  } else {
    renderCommitLog();
  }
} // fillInCommitLog()

export function renderCommitLog() {
  let branchesHeader = document.getElementById('branchesHeader');
  if (!branchesHeader) {
    // if user has navigated away from branch contents view while we
    // were waiting for the commit log, abandon it.
    return;
  }
  let logTable = document.getElementById('logTable');
  if (logTable) {
    // clear up previous logTable if it exists
    logTable.remove();
    document.getElementById('commitLogSeperator').remove();
  }
  logTable = document.createElement('table');
  logTable.setAttribute('id', 'logTable');
  let githubMenu = document.getElementById('GithubMenu');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th id="githubDate">${translator.lang.githubDate.text}</th><th id="githubAuthor">${translator.lang.githubAuthor.text}</th><th id="githubMessage">${translator.lang.githubMessage.text}</th><th id="githubCommit">${translator.lang.githubCommit.text}</th>`;
  logTable.appendChild(headerRow);
  github.commitLog.forEach((c) => {
    const commitRow = document.createElement('tr');
    commitRow.innerHTML = `
      <td>${c.commit.author.date}</td>
      <td><a href="${c.commit.author.html_url}">${c.commit.author.name}</a></td>
      <td>${c.commit.message}</td>
      <td><a target="_blank" href="https://github.com/${github.githubRepo}/commits/${c.sha}">${c.sha.slice(
      0,
      8
    )}...</a></td>`;
    logTable.appendChild(commitRow);
  });
  const commitLogHeader = document.createElement('a');
  commitLogHeader.setAttribute('id', 'commitLogHeader');
  commitLogHeader.innerText = translator.lang.commitLog.text;
  const hr = document.createElement('hr');
  hr.classList.add('dropdownLine');
  hr.setAttribute('id', 'commitLogSeperator');
  githubMenu.appendChild(hr);
  githubMenu.appendChild(logTable);
} // renderCommitLog()

async function handleClickGithubAction(e) {
  const overlay = document.getElementById("githubActionsOverlay")
  const header = document.getElementById("githubActionsHeading");
  const workflowName = document.getElementById("requestedWorkflowName");
  const statusMsg = document.getElementById("githubActionsStatus")
  const cancelBtn = document.getElementById("githubActionsCancelButton");
  const runBtn = document.getElementById("githubActionsRunButton");
  let ghLogo = document.getElementById("ghActionsLogo");
  if(!ghLogo) { 
    // add gh logo to serve as workflow processing indicator (spinner)
    const ghLogoSpan = document.createElement("span");
    ghLogoSpan.innerHTML = icon.githubLogo;
    header.insertAdjacentElement('afterbegin', ghLogoSpan);
    ghLogo = ghLogoSpan.firstChild;
    ghLogo.setAttribute("id", "ghActionsLogo");
  }
  let target = e.target;
  if(target.nodeName === "A") { 
    target = target.firstChild;
  }
  ghLogo.classList.add("clockwise");
  console.log("dataset: ", target.dataset)
  const inputContainerWrapper = document.getElementById("githubActionsInputConfigContainer");
  while(inputContainerWrapper.firstChild) {
    // clear content of input container
    // (don't just reset innerHTML, so that we also clear event handlers)
    inputContainerWrapper.removeChild(inputContainerWrapper.firstChild);
  }
  github.getWorkflowInputs(target.dataset.path).then( inputs => {
    if(!inputs) { 
      return;
    }
    let keys = Object.keys(inputs);
    if(keys.length) { 
      const inputContainer = document.createElement("div");
      const inputContainerHeader = document.createElement("h4");
      inputContainerHeader.setAttribute("id", "githubActionsInputContainerHeader");
      inputContainerHeader.innerText = translator.lang.githubActionsInputContainerHeader.text;
      inputContainer.insertAdjacentElement("afterbegin", inputContainerHeader);
      keys.forEach(k => {
        const inputConfig = generateGithubActionsInputConfig(inputs, k);
        inputContainer.insertAdjacentElement("beforeend", inputConfig);
      })
      inputContainerWrapper.insertAdjacentElement("beforeend", inputContainer)
    }
  })
  .finally(() => { 
    ghLogo.classList.remove("clockwise");
  });
  overlay.style.display = "block";
  workflowName.innerText = target.dataset.name;
  workflowName.dataset.id = target.dataset.id;
  cancelBtn.onclick = () => { 
    overlay.style.display = "none";
    statusMsg.innerHTML = "";
  }
  runBtn.onclick = () => { 
    statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">${translator.lang.githubActionStatusMsgWaiting.text}</span>`;
    cancelBtn.setAttribute("disabled", true);
    runBtn.setAttribute("disabled", true);
    ghLogo.classList.add("clockwise");
    // gather inputs:
    const specifiedInputs = {};
    document.querySelectorAll(".githubActionsInputField").forEach((i) => {
      specifiedInputs[i.dataset.input] = i.value;
    })
    github.requestActionWorkflowRun(workflowName.dataset.id, specifiedInputs)
      .then(workflowRunResp => { 
        console.log("Got workflow run response: ", workflowRunResp);
        if(workflowRunResp.status >= 400) { 
          // error
          statusMsg.innerHTML = `<span id="githubActionStatusMsgFailure">${translator.lang.githubActionStatusMsgFailure.text}</span>: <a href="${workflowRunResp.body.documentation_url}" target="_blank">${workflowRunResp.body.message}</a>`;
        } else { 
          // poll on latest workflow run 
          github.awaitActionWorkflowCompletion(workflowName.dataset.id)
            .then( (workflowCompletionResp ) => { 
              console.log("Got workflow completion resp: ", workflowCompletionResp);
              if("conclusion" in workflowCompletionResp) { 
                if(workflowCompletionResp.conclusion === "success") { 
                  statusMsg.innerHTML = `<span id="githubActionStatusMsgSuccess">${translator.lang.githubActionStatusMsgSuccess.text}</span>: <a href="${workflowCompletionResp.html_url}" target="_blank">${workflowCompletionResp.conclusion}</a>`;
                  runBtn.innerText = translator.lang.githubActionsRunBtnReload.text;
                  runBtn.removeAttribute("disabled");
                  ghLogo.classList.remove("clockwise");
                  runBtn.onclick = () => {
                    loadFile();
                    overlay.style.display = "none";
                    statusMsg.innerHTML = "";
                    runBtn.innerText = translator.lang.githubActionsRunBtn.text;
                    cancelBtn.removeAttribute("disabled");
                  }

                } else { 
                  statusMsg.innerHTML = `<span id="githubActionStatusMsgFailure">${translator.lang.githubActionStatusMsgFailure.text}</span>: <a href="${workflowCompletionResp.html_url}" target="_blank">${workflowCompletionResp.conclusion}</a>`;
                  cancelBtn.removeAttribute("disabled");
                  runBtn.removeAttribute("disabled");
                  ghLogo.classList.remove("clockwise");
                }
              } else { 
                console.error("Invalid response received from GitHub API", workflowCompletionResp);
                cancelBtn.removeAttribute("disabled");
                runBtn.removeAttribute("disabled");
                ghLogo.classList.remove("clockwise");
                statusMsg.innerHTML = "Error - invalid response received from GitHub API (see console)";
              }
            })
        //statusMsg.innerHTML = `<span id="githubActionStatusMsg">${translator.lang.githubActionStatusMsg.text}</span>`;
      }
    }).catch(e => {
     // network error
      console.error("Could not start workflow - perhaps network error?", e);
      statusMsg.innerHTML = "Error";
      cancelBtn.removeAttribute("disabled");
      runBtn.removeAttribute("disabled");
      ghLogo.classList.remove("clockwise");
    })  
  }
} // handleClickGithubAction()

export function logoutFromGithub() {
  if (storage.supported) {
    storage.githubLogoutRequested = 'true';
    // remove github object from local storage
    storage.removeItem('github');
    // remove file information to reset to default on reload
    storage.removeItem('fileLocationType');
    storage.removeItem('meiFileName');
    storage.removeItem('meiFileLocation');
  }
  // redirect to /logout to remove session cookie
  let url = window.location.href;
  // remove any url parameters (since these might include URLs with slashes in)
  const paramsStartIx = url.indexOf('?');
  if (paramsStartIx > -1) url = url.substring(0, paramsStartIx);
  // now modify last slash to navigate to /logout
  window.location.replace(url.substring(0, url.lastIndexOf('/')) + '/logout');
} // logoutFromGithub()

export function refreshGithubMenu() {
  // display Github name
  document.getElementById('GithubName').innerText =
    github.author.name === 'None' ? github.userLogin : github.author.name;
  // populate Github menu
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.classList.remove('loggedOut');
  githubMenu.innerHTML = `<a id="githubLogout" href="#">${translator.lang.logOut.text}</a>`;
  if (!github.filepath) {
    githubMenu.innerHTML += `
      <hr class="dropdownLine">
      <a id="forkRepository" href="#">${translator.lang.forkRepository.text}...</b></a>
      <hr class="dropdownLine">
      <a id="repositoriesHeader" class="dropdownHead" href="#"><b>${translator.lang.selectRepository.text}:</b></a>
    `;
    fillInUserRepos();
  }
} // refreshGithubMenu()

export function setCommitUIEnabledStatus() {
  const commitButton = document.getElementById('githubCommitButton');
  if (commitButton) {
    const commitFileName = document.getElementById('commitFileName');
    if (commitFileName.innerText === stripMeiFileName()) {
      // no name change => button reads "Commit"
      commitButton.classList.remove('commitAsNewFile');
      commitButton.setAttribute('value', translator.lang.githubCommitButton.value);
      if (fileChanged) {
        // enable commit UI if file has changed
        commitButton.removeAttribute('disabled');
        commitMessageInput.removeAttribute('disabled');
      } else {
        // disable commit UI if file hasn't changed
        commitButton.setAttribute('disabled', '');
        commitMessageInput.setAttribute('disabled', '');
        commitMessageInput.value = '';
      }
    } else {
      // file name has changed => button reads "Commit as new file"
      commitButton.setAttribute('value', translator.lang.githubCommitButton.classes.commitAsNewFile.value);
      commitButton.classList.add('commitAsNewFile');
      // enable commit UI regardless of fileChanged state
      commitButton.removeAttribute('disabled');
      commitMessageInput.removeAttribute('disabled');
    }
  }
} // setCommitUIEnabledStatus()

function setFileNameAfterLoad(ev) {
  const commitButton = document.getElementById('githubCommitButton');
  commitButton.classList.remove('commitAsNewFile');
  if (commitButton) {
    const commitFileName = document.getElementById('commitFileName');
    if (isMEI) {
      // trim preceding slash
      commitFileName.innerText = stripMeiFileName();
      commitButton.setAttribute('value', translator.lang.githubCommitButton.value);
    } else {
      commitFileName.innerText = '...';
      commitButton.setAttribute('value', '...');
      // trim preceding slash
      proposeFileName(stripMeiFileName());
    }
    setCommitUIEnabledStatus();
  }
} // setFileNameAfterLoad()

// handle Github commit UI
function handleCommitButtonClicked(e) {
  const commitFileName = document.getElementById('commitFileName');
  const messageInput = document.getElementById('commitMessageInput');
  const message = messageInput.value;
  console.log('Got message: ', message);
  if (message) {
    const githubLoadingIndicator = document.getElementById('GithubLogo');
    // lock editor while we are busy commiting
    cm.readOnly = 'nocursor'; // don't allow editor focus
    // try commiting to Github
    githubLoadingIndicator.classList.add('clockwise');
    const newfile = commitFileName.innerText !== stripMeiFileName() ? commitFileName.innerText : null;
    github
      .writeGithubRepo(cm.getValue(), message, newfile)
      .then(() => {
        console.debug(`Successfully written to github: ${github.githubRepo}${github.filepath}`);
        messageInput.value = '';
        if (newfile) {
          // switch to new filepath
          github.filepath = github.filepath.substring(0, github.filepath.lastIndexOf('/') + 1) + newfile;
        }
        // load after write (without clearing viewer metadata since we're loading same file again)
        loadFile('', false);
      })
      .catch((e) => {
        cm.readOnly = false;
        githubLoadingIndicator.classList.remove('clockwise');
        console.warn("Couldn't commit Github repo: ", e, github);
      });
  } else {
    // no commit without a comit message!
    messageInput.classList.add('warn');
    document.getElementById('githubCommitButton').setAttribute('disabled', '');
    e.stopPropagation(); // prevent bubbling to stop github menu closing
  }
} // handleCommitButtonClicked()

function stripMeiFileName() {
  const stripped = meiFileName.match(/^.*\/([^\/]+)$/);
  if (Array.isArray(stripped)) {
    return stripped[1];
  } else {
    console.warn('stripMeiFileName called on invalid filename: ', meiFileName);
  }
} // stripMeiFileName()

function generateGithubActionsInputConfig(inputs, input) { 
  const inputConfig = document.createElement("div");
  inputConfig.classList.add("githubActionsInputConfig");
  inputConfig.setAttribute("id", "githubActionsInputConfig_" + input)
  const inputName = document.createElement("span");
  inputName.innerText = input;
  if("description" in inputs[input])
    inputName.setAttribute("title", inputs[input].description);
  const inputFieldWrapper = document.createElement("div");
  const inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.classList.add("githubActionsInputField");
  inputField.dataset.input = input;
  inputField.setAttribute("id", "githubActionsInputField_" + input);
  inputField.setAttribute("size","100");
  if("default" in inputs[input]) {
    inputField.defaultValue = inputs[input].default;
  }
  const inputSetters = document.createElement("div");
  ghActionsInputSetters.forEach((inp) => { 
    // create "input setters" that copy useful content into the input field on user request
    let setter = document.createElement("span");
    setter.classList.add("githubActionsInputSetter")
    setter.innerHTML = inp.icon + icon.arrowDown;
    setter.setAttribute("title", translator.lang[inp.id].text);
    setter.setAttribute("id", input + "-" + inp.id);
    setter.addEventListener("click", () => { 
      inputField.value = inp.func();
    })
    inputSetters.insertAdjacentElement("beforeend", setter);
  })
  inputFieldWrapper.insertAdjacentElement("beforeend", inputSetters);
  inputFieldWrapper.insertAdjacentElement("beforeend", inputField);
  inputConfig.insertAdjacentElement("beforeend", inputName);
  inputConfig.insertAdjacentElement("beforeend", inputFieldWrapper);
  return inputConfig;
}