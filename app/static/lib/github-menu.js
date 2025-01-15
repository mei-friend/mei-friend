import { forkRepository, forkRepositoryCancel } from './fork-repository.js';
import {
  cm,
  fileChanged,
  fileLocationType,
  generateUrl,
  gm, // git manager instance
  handleEncoding,
  isMEI,
  meiFileName,
  openUrlFetch,
  setFileChangedState,
  setFileLocationType,
  setMeiFileInfo,
  setStandoffAnnotationEnabledStatus,
  storage,
  translator,
  updateFileStatusDisplay,
  updateGithubInLocalStorage,
  v,
} from './main.js';
import * as icon from './../css/icons.js';

const ghActionsInputSetters = [
  {
    id: 'githubActionsInputSetterFilepath',
    icon: icon.fileCode,
    func: (gm) => {
      return gm.filepath.substr(1);
    },
  },
  {
    id: 'githubActionsInputSetterSelection',
    icon: icon.projectTemplate,
    func: () => {
      return v.selectedElements;
    },
  },
];

const REPO_SIZE_WARNING_THRESHOLD = 100 * 1024; // 100MB; consider making this a user setting

function forkRepo() {
  forkRepository(gm);
}

export async function forkRepoClicked() {
  // inputRepoOverride is used to supply a repository via the forkAndOpen (?fork parameter) path
  let inputName = document.getElementById('forkRepositoryInputName').value;
  let inputRepo = document.getElementById('forkRepositoryInputRepo').value;
  let inputRepoOverride = document.getElementById('forkRepositoryInputRepoOverride').value;
  let inputBranchOverride = document.getElementById('forkRepositoryInputBranchOverride').value;
  let inputFilepathOverride = document.getElementById('forkRepositoryInputFilepathOverride').value;
  let forkRepositoryStatus = Array.from(document.getElementsByClassName('forkRepositoryStatus'));
  let forkRepositoryToSelector = document.querySelector('#forkRepositoryToSelector');
  if (inputName && (inputRepo || inputRepoOverride)) {
    inputRepo = inputRepoOverride ? inputRepoOverride : inputRepo;
    let githubRepo = `${inputName}/${inputRepo}`;
    gm.repo = githubRepo;
    Array.from(document.getElementsByClassName('forkRepoGithubLogo')).forEach((l) => l.classList.add('clockwise'));
    console.log('Forking repo: ', githubRepo, gm);
    await gm
      .fork(async () => {
        forkRepositoryStatus.forEach((s) => {
          s.classList.remove('warn');
          s.innerHTML = '';
        });
        fillInRepoBranches();
        forkRepositoryCancel();
        if (inputRepoOverride && inputBranchOverride && inputFilepathOverride) {
          // forkAndOpen path: directly switch to specified branch and open file
          gm.branch = inputBranchOverride;
          const _filepath = inputFilepathOverride.substring(0, inputFilepathOverride.lastIndexOf('/') + 1);
          const _file = inputFilepathOverride.substring(inputFilepathOverride.lastIndexOf('/') + 1);
          gm.filepath = _filepath;
          setMeiFileInfo(gm.filepath, gm.repo, gm.repo + ':');
          // clone and load the file
          await checkAndClone(`https://github.com/${gm.repo}.git`, gm.branch);
          /*
            .then(() => {
              loadFile(_file);
              updateFileStatusDisplay();
            })
            .catch((e) => {
              showCloneErrorAlert(e);
            });*/
        }
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
      .finally(async () => {
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
  gm.filepath = '';
  refreshGithubMenu(); // reopen
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.classList.add('forceShow');
  githubMenu.classList.add('show');
} // repoHeaderClicked()

function selectBranchClicked(ev) {
  gm.filepath = '';
  fillInRepoBranches(ev.target);
} // selectBranchClicked()

function contentsHeaderClicked(ev) {
  // strip trailing slash (in case our filepath is a subdir)
  if (gm.filepath.endsWith('/')) gm.filepath = gm.filepath.substring(0, gm.filepath.length - 1);
  //  retreat to previous slash (back one directory level)
  gm.filepath = gm.filepath.substring(0, gm.filepath.lastIndexOf('/') + 1);
  // if we've retreated past the root dir, restore it
  gm.filepath = gm.filepath.length === 0 ? '/' : gm.filepath;
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  githubLoadingIndicator.classList.add('clockwise');
  fillInBranchContents(ev);
  githubLoadingIndicator.classList.remove('clockwise');
} // contentsHeaderClicked()

async function userRepoClicked(ev) {
  // re-init github object with selected repo
  gm.repo = ev.target.innerText;
  const per_page = 100;
  const page = 1;
  const repoBranches = await gm.getBranches(per_page, page);
  if (repoBranches.length === 1) {
    // skip branch menu if only one branch
    gm.branch = repoBranches[0].name;
    gm.filepath = '/';
    fillInBranchContents(ev);
  } else {
    fillInRepoBranches(ev, repoBranches);
  }
} // userRepoClicked()

async function repoBranchClicked(ev) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  gm.filepath = '/';
  gm.branch = ev.target.innerText;
  githubLoadingIndicator.classList.add('clockwise');
  fillInBranchContents(ev);
  githubLoadingIndicator.classList.remove('clockwise');
} // repoBranchClicked()

function branchContentsDirClicked(ev) {
  console.log('branchContentsDirClicked()');
  let target = ev.target;
  if (!target.classList.contains('filepath')) {
    // if user hasn't clicked directly on the filepath <span>, drill down to it
    target = target.querySelector('.filepath');
  }
  if (gm.filepath.endsWith('/')) {
    gm.filepath += target.innerText + '/';
  } else {
    gm.filepath += '/' + target.innerText + '/';
  }
  fillInBranchContents(ev);
} // branchContentsDirClicked()

function branchContentsFileClicked(ev) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  // load the file into the editor
  // first, check whether the pfs directory corresponding to the provider has already been cloned; if not, clone it.
  // 1. check if pfs has a directory for the provider
  gm.pfsDirExists().then(async (exists) => {
    if (!exists) {
      // console.log('DECISION: 1');
      // console.log('pfsDirExists() returned false');
      // 2. if not, clone the repo
      githubLoadingIndicator.classList.add('clockwise'); // removed by loadFile()
      await checkAndClone(ev.target.innerText);
      /*
        .clone()
        .then(() => {
          console.log('menu: clone() completed, doing load file');
          // 3. read the file
          loadFile(ev.target.innerText);
        })
        .catch((e) => {
          showCloneErrorAlert(e, gm.filepath + ev.target.innerText);
        });
      */
    } else {
      // console.log('DECISION: 2');
      // 2a. if it does, check the repo is the same as the one we want to load
      gm.getRemote().then(async (remote) => {
        // console.log('DECISION: 3');
        // console.log('getRemote worked!', remote);
        if (!remote || remote !== gm.repo) {
          // console.log('DECISION: 4');
          // 3a. if not, clone the repo
          githubLoadingIndicator.classList.add('clockwise'); // removed by loadFile()
          await checkAndClone(ev.target.innerText);
          /*
            .then(() => {
              // 4. read the file
              loadFile(ev.target.innerText);
            })
            .catch((e) => {
              showCloneErrorAlert(e, gm.filepath + ev.target.innerText);
            });*/
        } else {
          // console.log('DECISION: 5');
          // 3b. if we already have the correct repo, check we're on the correct branch
          gm.getBranch().then(async (branch) => {
            if (branch !== gm.branch) {
              // console.log('DECISION: 6', branch, gm.branch);
              // 4a. if not, checkout the correct branch
              githubLoadingIndicator.classList.add('clockwise'); // removed by loadFile()
              await gm.checkout(branch).then(async () => {
                // console.log('menu: checkout() completed, branch now: ', await gm.getBranch());
                // console.log('menu: checkout() completed, files in repo now: ', await pfs.readdir(gm.directory));
                // 5. read the file
                loadFile(ev.target.innerText);
              });
            } else {
              // console.log('DECISION: 7');
              // 4b. if we're on the correct branch, read the file
              // TODO consider whether to force (or offer) a git pull here first
              loadFile(ev.target.innerText);
            }
          });
        }
      });
    }
  });
  document.getElementById('GithubMenu').classList.remove('forceShow');
} // branchContentsFileClicked()

function loadFile(fileName = '', clearBeforeLoading = true, ev = null) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  gm.filepath += fileName;
  console.debug(`${translator.lang.loadingFile.text}: https://github.com/${gm.repo}${gm.filepath}`);
  fillInBranchContents(ev);
  githubLoadingIndicator.classList.add('clockwise');
  console.log('loadFile(), before readFile(), gm.filepath: ', gm.filepath, 'directory: ', gm.directory);
  gm.readFile()
    .then(async (content) => {
      githubLoadingIndicator.classList.remove('clockwise');
      cm.readOnly = false;
      document.getElementById('statusBar').innerText = translator.lang.loadingFromGithub.text + '...';
      v.allowCursorActivity = false;
      setMeiFileInfo(
        gm.filepath, // meiFileName
        gm.repo, // meiFileLocation
        gm.repo + ':' // meiFileLocationPrintable
      );
      handleEncoding(content, true, true, clearBeforeLoading); // retains current page and selection after commit
      setFileNameAfterLoad();
      updateFileStatusDisplay();
      setFileChangedState(await gm.fileChanged());
      updateGithubInLocalStorage();
      setFileLocationType('github');
      setStandoffAnnotationEnabledStatus();
      fillInCommitLog('withRefresh');
      const fnStatus = document.getElementById('fileName');
      if (fnStatus) fnStatus.removeAttribute('contenteditable');
      v.allowCursorActivity = true;
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
  console.log('Assigning click handlers to Github menu items...');
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

  const repoHeader = document.getElementById('selectRepository');
  if (repoHeader) {
    // on click, reload list of all repositories
    repoHeader.removeEventListener('click', repoHeaderClicked);
    repoHeader.addEventListener('click', repoHeaderClicked);
  }
  const selectBranch = document.getElementById('selectBranch');
  if (selectBranch) {
    // on click, reload list of branches for current repo
    selectBranch.removeEventListener('click', selectBranchClicked);
    selectBranch.addEventListener('click', selectBranchClicked);
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
  const repos = await gm.getRepos(per_page, page);
  console.log('fillInUserRepos() got repos: ', repos);
  if (document.getElementById('selectBranch')) {
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

export async function fillInRepoBranches(e, repoBranches) {
  if (!repoBranches) {
    const per_page = 100;
    const page = 1;
    repoBranches = await gm.getBranches(per_page, page);
  }
  console.log('fillInRepoBranches() got branches: ', repoBranches);
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.innerHTML = `
    <a id="githubLogout" href="#">${translator.lang.logOut.text}</a>
    <hr class="dropdownLine">
    <a id="selectRepository" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubRepository">${translator.lang.githubRepository.text}</span>: ${gm.repo}</a>
    <hr class="dropdownLine">
    <a id="selectBranch" class="dropdownHead" href="#"><b>${translator.lang.selectBranch.text}:</b></a>
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
  const containingDir = gm.filepath.substring(0, gm.filepath.lastIndexOf('/'));
  return gm.readDir(containingDir).then((dirListing) => {
    const prevMarked = dirListing.filter((file) => file.match(without + '~\\d+.mei$'));
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
  const containingDir = gm.filepath.substring(0, gm.filepath.lastIndexOf('/'));
  gm.readDir(containingDir).then((dirListing) => {
    if (suffixPos > 0) {
      // there's a dot and it's not at the start of the name
      // => treat everything after it as the suffix
      without = fname.substring(0, suffixPos);
      suffix = fname.substring(suffixPos + 1);
    }
    if (suffix.toLowerCase() !== 'mei') {
      // see if we can get away with simply swapping suffix
      newname = without + '.mei';
      if (dirListing.includes(newname)) {
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
  // clone repo and read contents of branch
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  githubLoadingIndicator.classList.add('clockwise');
  // TODO handle > per_page files (similar to userRepos)
  let target = document.getElementById('contentsHeader');
  gm.listContents(gm.filepath)
    .then(async (branchContents) => {
      console.log('fillInBranchContents() got contents: ', branchContents);
      let githubMenu = document.getElementById('GithubMenu');
      githubMenu.innerHTML = `
    <a id="githubLogout" href="#">${translator.lang.logOut.text}</a>
    <hr class="dropdownLine">
    <a id="selectRepository" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubRepository">${translator.lang.githubRepository.text}</span>: ${gm.repo}</a>
    <hr class="dropdownLine">
    <a id="selectBranch" href="#"><span class="btn icon inline-block-tight">${icon.arrowLeft}</span><span id="githubBranch">${translator.lang.githubBranch.text}</span>: ${gm.branch}</a>
    <hr class="dropdownLine">
    <a id="contentsHeader" href="#"><span class="btn icon inline-block-tight filepath">${icon.arrowLeft}</span><span id="githubFilepath">${translator.lang.githubFilepath.text}</span>: <span class="filepath">${gm.filepath}</span></a>
    <div class="actionsContainer"><hr class="dropdownLine" class="actionsDivider" id="actionsDividerStart"></div>
    `;
      // request Githug Action workflows (if any) and handle them
      gm.getActionWorkflowsList().then((resp) => handleWorkflowsListReceived(resp));
      if (e) {
        branchContents.forEach(async (content) => {
          const isDir = content.type === 'dir';
          githubMenu.innerHTML +=
            `<a class="branchContents ${content.type}${isDir ? '' : ' closeOnClick'}" href="#">` +
            //  content.type === "dir" ? '<span class="btn icon icon-file-symlink-file inline-block-tight"></span>' : "" +
            `<span class="filepath${isDir ? '' : ' closeOnClick'}">${content.name}</span>${isDir ? '...' : ''}</a>`;
          assignGithubMenuClickHandlers();
        });
      } else {
        // Either User clicked file, or we're on forkAndOpen path, or restoring from local storage. Display commit interface
        if (gm.filepath) {
          setMeiFileInfo(
            gm.filepath, // meiFileName
            gm.repo, // meiFileLocation
            gm.repo + ':' // meiFileLocationPrintable
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
        commitFileNameEdit.innerHTML =
          '<span id="commitFileNameText">' + translator.lang.commitFileNameText.text + '</span>: ';
        commitFileNameEdit.appendChild(commitFileName);

        const commitMessageInput = document.createElement('input');
        commitMessageInput.setAttribute('type', 'text');
        commitMessageInput.setAttribute('id', 'commitMessageInput');
        commitMessageInput.setAttribute('placeholder', translator.lang.commitMessageInput.placeholder);
        commitMessageInput.classList.add('preventKeyBindings');
        const commitButton = document.createElement('input');
        commitButton.setAttribute('id', 'githubCommitButton');
        commitButton.setAttribute('type', 'button');
        commitButton.classList.add('closeOnClick');
        commitButton.removeEventListener('click', handleCommitButtonClicked);
        commitButton.addEventListener('click', handleCommitButtonClicked);
        commitUI.appendChild(commitFileNameEdit);
        commitUI.appendChild(commitMessageInput);
        commitUI.appendChild(commitButton);
        githubMenu.appendChild(commitUI);
        setFileNameAfterLoad();
        setFileChangedState(await gm.fileChanged());
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
          const openInMeiFriendUrl = `[${translator.lang.clickToOpenInMeiFriend.text}](${encodeURIComponent(
            generateUrl()
          )})`;
          // FIXME - make this work with isomorphic-git and all cloud providers
          const fullOpenIssueUrl = `https://github.com/${gm.repo}/issues/new?title=Issue+with+${meiFileName}&body=${openInMeiFriendUrl}`;
          window.open(fullOpenIssueUrl, '_blank');
        });
        const reportIssueDivider = document.createElement('hr');
        reportIssueDivider.classList.add('dropdownLine');
        commitUI.appendChild(reportIssueDivider);
        reportIssue.target = '_blank';
        commitUI.appendChild(reportIssue);
      }
      assignGithubMenuClickHandlers();
      fillInCommitLog('withRefresh');
      // GitHub menu interactions
      console.log('In fillInBranchContents, Assigning click handlers to Github menu items...');
      v.setMenuColors();
    })
    .catch((err) => {
      console.error("Couldn't read Github repo to fill in branch contents:", err);
    });
} // fillInBranchContents()

function showCloneErrorAlert(e) {
  // stop the loading spinner
  document.getElementById('GithubLogo').classList.remove('clockwise');
  let msg;
  /*
  if (typeof e === 'object' && 'name' in e && e.name === 'RepoTooLargeError') {
    let size = parseInt(e.message);
    // convert to KB to MB:
    size = Math.round(size / 1024).toFixed(2);
    msg = translator.lang.repoTooLargeError.text + ': ' + size + 'MB';
  } else {
    msg = translator.lang.cloneError.text;
  }*/
  msg = translator.lang.cloneError.text;
  v.showAlert(msg);
  /*
  v.showUserPrompt(msg, [
    {
      label: translator.lang.overrideCloneWithUrlCancel.text,
      event: () => {
        v.hideUserPrompt();
      },
    },
    {
      label: translator.lang.overrideCloneWithUrlOpen.text,
      event: async () => {
        // open the requested file via its raw URL
        let url = gm.getRawURL();
        // append file path, ensuring there's only one slash between the repo and the file path
        url += filepath.startsWith('/') ? filepath : '/' + filepath;
        openUrlFetch(new URL(url));
        v.hideUserPrompt();
      },
    },
  ]);*/
}

function handleWorkflowsListReceived(resp) {
  const actionsDivider = document.getElementById('actionsDividerStart');
  if (actionsDivider) {
    resp.forEach((wf) => {
      if (wf.state === 'active') {
        let workflowSpan = document.createElement('span');
        workflowSpan.id = 'gha_' + wf.id;
        workflowSpan.dataset.node_id = wf.node_id;
        workflowSpan.dataset.id = wf.id;
        workflowSpan.dataset.path = wf.path;
        workflowSpan.dataset.state = wf.state;
        workflowSpan.dataset.url = wf.url;
        workflowSpan.dataset.name = wf.name;
        workflowSpan.title = wf.url;
        workflowSpan.innerText = 'GH Action: ' + wf.name;
        workflowSpan.classList.add('inline-block-tight', 'workflow');
        let workflowSpanContainer = document.createElement('a');
        workflowSpanContainer.onclick = (e) => handleClickGithubAction(e, gm);
        workflowSpanContainer.insertAdjacentElement('beforeend', workflowSpan);
        actionsDivider.insertAdjacentElement('afterend', workflowSpanContainer);
      } else {
        console.warn('Skipping inactive GitHub Actions workflow: ', wf);
      }
    });
    if (resp.length) {
      // add lower dividing line below final action
      let firstBranchContents = document.querySelector('.branchContents');
      if (firstBranchContents) {
        let actionsContentDivider = document.createElement('hr');
        actionsContentDivider.classList.add('dropdownLine');
        actionsContentDivider.classList.add('actionsDivider');
        firstBranchContents.insertAdjacentElement('beforebegin', actionsContentDivider);
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
    gm.readLog()
      .then((log) => {
        githubLoadingIndicator.classList.remove('clockwise');
        renderCommitLog(log);
      })
      .catch((e) => {
        githubLoadingIndicator.classList.remove('clockwise');
        console.warn("Couldn't read github repo", e);
      });
  } else {
    renderCommitLog();
  }
} // fillInCommitLog()

export function renderCommitLog(gitlog) {
  let selectBranch = document.getElementById('selectBranch');
  console.log('renderCommitLog()', gitlog, selectBranch);
  if (!gitlog || !selectBranch) {
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
  gitlog.forEach((c) => {
    const commitRow = document.createElement('tr');
    commitRow.innerHTML = `
      <td>${c.commit.author.date}</td>
      <td>${c.commit.author.name}</td>
      <td>${c.commit.message}</td>
      <td><a target="_blank" href="https://github.com/${gm.repo}/commits/${c.sha}">${c.sha.slice(0, 8)}...</a></td>`;
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

async function handleClickGithubAction(e, gm) {
  // FIXME - port to isomorphic-git and all cloud providers
  const overlay = document.getElementById('githubActionsOverlay');
  const header = document.getElementById('githubActionsHeading');
  const workflowName = document.getElementById('requestedWorkflowName');
  const statusMsg = document.getElementById('githubActionsStatus');
  const cancelBtn = document.getElementById('githubActionsCancelButton');
  const runBtn = document.getElementById('githubActionsRunButton');
  let ghLogo = document.getElementById('ghActionsLogo');
  if (!ghLogo) {
    // add gh logo to serve as workflow processing indicator (spinner)
    const ghLogoSpan = document.createElement('span');
    ghLogoSpan.innerHTML = icon.githubLogo;
    header.insertAdjacentElement('afterbegin', ghLogoSpan);
    ghLogo = ghLogoSpan.firstChild;
    ghLogo.setAttribute('id', 'ghActionsLogo');
  }
  let target = e.target;
  if (target.nodeName === 'A') {
    target = target.firstChild;
  }
  ghLogo.classList.add('clockwise');
  console.log('dataset: ', target.dataset);
  const inputContainerWrapper = document.getElementById('githubActionsInputConfigContainer');
  while (inputContainerWrapper.firstChild) {
    // clear content of input container
    // (don't just reset innerHTML, so that we also clear event handlers)
    inputContainerWrapper.removeChild(inputContainerWrapper.firstChild);
  }
  gm.getWorkflowInputs(target.dataset.path)
    .then((inputs) => {
      if (!inputs) {
        return;
      }
      let keys = Object.keys(inputs);
      if (keys.length) {
        const inputContainer = document.createElement('div');
        const inputContainerHeader = document.createElement('h4');
        inputContainerHeader.setAttribute('id', 'githubActionsInputContainerHeader');
        inputContainerHeader.innerText = translator.lang.githubActionsInputContainerHeader.text;
        inputContainer.insertAdjacentElement('afterbegin', inputContainerHeader);
        keys.forEach((k) => {
          const inputConfig = generateGithubActionsInputConfig(inputs, k);
          inputContainer.insertAdjacentElement('beforeend', inputConfig);
        });
        inputContainerWrapper.insertAdjacentElement('beforeend', inputContainer);
      }
    })
    .finally(() => {
      ghLogo.classList.remove('clockwise');
    });
  overlay.style.display = 'block';
  workflowName.innerText = target.dataset.name;
  workflowName.dataset.id = target.dataset.id;
  cancelBtn.onclick = () => {
    overlay.style.display = 'none';
    statusMsg.innerHTML = '';
  };
  runBtn.onclick = () => {
    statusMsg.innerHTML = `<span id="githubActionStatusMsgWaiting">${translator.lang.githubActionStatusMsgWaiting.text}</span>`;
    cancelBtn.setAttribute('disabled', true);
    runBtn.setAttribute('disabled', true);
    ghLogo.classList.add('clockwise');
    // gather inputs:
    const specifiedInputs = {};
    document.querySelectorAll('.githubActionsInputField').forEach((i) => {
      specifiedInputs[i.dataset.input] = i.value;
    });
    gm.requestActionWorkflowRun(workflowName.dataset.id, specifiedInputs)
      .then((workflowRunResp) => {
        console.log('Got workflow run response: ', workflowRunResp);
        if (workflowRunResp.status >= 400) {
          // error
          statusMsg.innerHTML = `<span id="githubActionStatusMsgFailure">${translator.lang.githubActionStatusMsgFailure.text}</span>: <a href="${workflowRunResp.body.documentation_url}" target="_blank">${workflowRunResp.body.message}</a>`;
        } else {
          // poll on latest workflow run
          gm.awaitActionWorkflowCompletion(workflowName.dataset.id).then((workflowCompletionResp) => {
            console.log('Got workflow completion resp: ', workflowCompletionResp);
            if ('conclusion' in workflowCompletionResp) {
              if (workflowCompletionResp.conclusion === 'success') {
                statusMsg.innerHTML = `<span id="githubActionStatusMsgSuccess">${translator.lang.githubActionStatusMsgSuccess.text}</span>: <a href="${workflowCompletionResp.html_url}" target="_blank">${workflowCompletionResp.conclusion}</a>`;
                runBtn.innerText = translator.lang.githubActionsRunButtonReload.text;
                runBtn.removeAttribute('disabled');
                ghLogo.classList.remove('clockwise');
                runBtn.onclick = async () => {
                  ghLogo.classList.add('clockwise');
                  // do a pull to refresh the file
                  await gm.pull();
                  // redraw github menu to reflect changes in git log
                  fillInCommitLog('withRefresh');
                  console.log('pull completed for reload, head hash now ', await gm.getCurrentHeadSha());
                  loadFile();
                  overlay.style.display = 'none';
                  statusMsg.innerHTML = '';
                  runBtn.innerText = translator.lang.githubActionsRunButton.text;
                  cancelBtn.removeAttribute('disabled');
                  ghLogo.classList.add('clockwise');
                };
              } else {
                statusMsg.innerHTML = `<span id="githubActionStatusMsgFailure">${translator.lang.githubActionStatusMsgFailure.text}</span>: <a href="${workflowCompletionResp.html_url}" target="_blank">${workflowCompletionResp.conclusion}</a>`;
                cancelBtn.removeAttribute('disabled');
                runBtn.removeAttribute('disabled');
                ghLogo.classList.remove('clockwise');
              }
            } else {
              console.error('Invalid response received from GitHub API', workflowCompletionResp);
              cancelBtn.removeAttribute('disabled');
              runBtn.removeAttribute('disabled');
              ghLogo.classList.remove('clockwise');
              statusMsg.innerHTML = 'Error - invalid response received from GitHub API (see console)';
            }
          });
          //statusMsg.innerHTML = `<span id="githubActionStatusMsg">${translator.lang.githubActionStatusMsg.text}</span>`;
        }
      })
      .catch((e) => {
        // network error
        console.error('Could not start workflow - perhaps network error?', e);
        statusMsg.innerHTML = 'Error';
        cancelBtn.removeAttribute('disabled');
        runBtn.removeAttribute('disabled');
        ghLogo.classList.remove('clockwise');
      });
  };
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
  console.log('refreshGithubMenu()', gm);
  // display Github name
  gm.getAuthor().then((author) => {
    document.getElementById('GithubName').innerText = author.name;
  });
  // populate Github menu
  let githubMenu = document.getElementById('GithubMenu');
  githubMenu.classList.remove('loggedOut');
  githubMenu.innerHTML = `<a id="githubLogout" href="#">${translator.lang.logOut.text}</a>`;
  if (!gm.filepath) {
    githubMenu.innerHTML += `
      <hr class="dropdownLine">
      <a id="forkRepository" href="#">${translator.lang.forkRepository.text}...</b></a>
      <hr class="dropdownLine">
      <a id="selectRepository" class="dropdownHead" href="#"><b>${translator.lang.selectRepository.text}:</b></a>
    `;
    fillInUserRepos();
  }
} // refreshGithubMenu()

export async function setCommitUIEnabledStatus() {
  const commitButton = document.getElementById('githubCommitButton');
  if (commitButton) {
    const commitFileName = document.getElementById('commitFileName');
    if (commitFileName.innerText === stripMeiFileName()) {
      // no name change => button reads "Commit"
      commitButton.classList.remove('commitAsNewFile');
      commitButton.setAttribute('value', translator.lang.githubCommitButton.value);
      if (await gm.fileChanged()) {
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
  if (commitButton) {
    commitButton.classList.remove('commitAsNewFile');
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
async function handleCommitButtonClicked(e) {
  const messageInput = document.getElementById('commitMessageInput');
  const commitButton = document.getElementById('githubCommitButton');
  let commitNewFile = commitButton.classList.contains('commitAsNewFile');
  const message = messageInput.value;
  console.log('Got message: ', message);
  if (message) {
    const githubLoadingIndicator = document.getElementById('GithubLogo');
    // lock editor while we are busy commiting
    cm.readOnly = 'nocursor'; // don't allow editor focus
    // try commiting to Github
    githubLoadingIndicator.classList.add('clockwise');
    if (commitNewFile) {
      await prepareNewFileForCommit();
    }
    await doCommit();
    if (commitNewFile) {
      setMeiFileInfo(gm.filepath, gm.repo, gm.repo + ':');
      loadFile();
      updateFileStatusDisplay();
    }
  } else {
    // no commit without a comit message!
    messageInput.classList.add('warn');
    document.getElementById('githubCommitButton').setAttribute('disabled', '');
    e.stopPropagation(); // prevent bubbling to stop github menu closing
  }
} // handleCommitButtonClicked()

async function prepareNewFileForCommit() {
  const commitFileName = document.getElementById('commitFileName');
  const newFileName = commitFileName.innerText;
  // write to new file
  let newFilePath = gm.filepath.substring(0, gm.filepath.lastIndexOf('/') + 1) + newFileName;
  return await gm
    .writeAndReturnStatus(cm.getValue(), newFilePath)
    .then(async (status) => {
      console.log('Successfully wrote new file to Github repo: ', status);
      gm.filepath = newFilePath;
      console.log('Filepath after write: ', gm.filepath);
      return await gm.status();
    })
    .catch((e) => {
      console.warn("Couldn't write new file to Github repo: ", e, github);
    });
} // prepareNewFileForCommit()

async function doCommit() {
  const commitButton = document.getElementById('githubCommitButton');
  const messageInput = document.getElementById('commitMessageInput');
  const message = messageInput.value;
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  try {
    await gm.add();
    await gm.commit(message);
    await gm.push();
  } catch (e) {
    githubLoadingIndicator.classList.remove('clockwise');
    cm.setOption('readOnly', false);
    console.warn("Couldn't do commit and push: ", e);
    v.showUserPrompt(
      "Couldn't commit and push to Github: " + e,
      [
        {
          label: 'Cancel - do not commit',
          event: () => {
            v.hideUserPrompt();
          },
        },
        {
          label: 'Commit to new branch and open a Pull Request',
          event: async () => {
            // push changes to a new branch
            let oldBranch = gm.branch;
            gm.createBranch(message)
              .then(() => {
                // redraw the github menu to show new branch
                fillInBranchContents();
                // create PR
                gm.createPR(oldBranch)
                  .then((pr) => {
                    console.log('Created PR: ', pr);
                    v.hideUserPrompt();
                    // update git menu to show new branch name and include link to PR github page
                  })
                  .catch((e) => {
                    console.warn("Couldn't create PR: ", e);
                    v.hideUserPrompt();
                    v.showAlert("Couldn't create PR: " + e);
                  });
              })
              .catch((e) => {
                console.warn("Couldn't create branch: ", e);
                v.hideUserPrompt();
                v.showAlert("Couldn't create branch: " + e);
              });
          },
        },
      ],
      'warning'
    );
  }
  console.debug(`Successfully committed and pushed to github: ${gm.repo}${gm.filepath}`);
  messageInput.value = '';
  console.log('Status after commit: ', await gm.status());
  setCommitUIEnabledStatus();
  updateFileStatusDisplay();
  setFileChangedState(await gm.fileChanged());
  githubLoadingIndicator.classList.remove('clockwise');
  cm.setOption('readOnly', false);
  fillInCommitLog('withRefresh');
} // doCommit()

function stripMeiFileName() {
  const stripped = meiFileName.match(/^.*\/([^\/]+)$/);
  if (Array.isArray(stripped)) {
    return stripped[1];
  } else {
    console.warn('stripMeiFileName called on invalid filename: ', meiFileName);
  }
} // stripMeiFileName()

function generateGithubActionsInputConfig(inputs, input) {
  const inputConfig = document.createElement('div');
  inputConfig.classList.add('githubActionsInputConfig');
  inputConfig.setAttribute('id', 'githubActionsInputConfig_' + input);
  const inputName = document.createElement('span');
  inputName.innerText = input;
  if ('description' in inputs[input]) inputName.setAttribute('title', inputs[input].description);
  const inputFieldWrapper = document.createElement('div');
  inputFieldWrapper.classList.add('githubActionsInputFieldWrapper');
  const inputField = document.createElement('input');
  inputField.setAttribute('type', 'text');
  inputField.classList.add('githubActionsInputField');
  inputField.dataset.input = input;
  inputField.setAttribute('id', 'githubActionsInputField_' + input);
  if ('default' in inputs[input]) {
    inputField.defaultValue = inputs[input].default;
  }
  const inputSetters = document.createElement('div');
  ghActionsInputSetters.forEach((inp) => {
    // create "input setters" that copy useful content into the input field on user request
    let setter = document.createElement('span');
    setter.classList.add('githubActionsInputSetter');
    setter.innerHTML = inp.icon + icon.arrowDown;
    setter.setAttribute('title', translator.lang[inp.id].text);
    setter.setAttribute('id', input + '-' + inp.id);
    setter.addEventListener('click', () => {
      inputField.value = inp.func(gm);
    });
    inputSetters.insertAdjacentElement('beforeend', setter);
  });
  inputFieldWrapper.insertAdjacentElement('beforeend', inputSetters);
  inputFieldWrapper.insertAdjacentElement('beforeend', inputField);
  inputConfig.insertAdjacentElement('beforeend', inputName);
  inputConfig.insertAdjacentElement('beforeend', inputFieldWrapper);
  return inputConfig;
}

export async function checkAndClone(file, branchurl = gm.cloud.getCloneURL(), branch = gm.branch) {
  // check if the repo is very large; if so, ask user to confirm
  let repo = gm.getRepoFromCloneURL(branchurl);
  let size = await gm.getRepoSize(repo);
  console.log('Repo size: ', size);
  if (size > REPO_SIZE_WARNING_THRESHOLD) {
    // stop the loading spinner
    document.getElementById('GithubLogo').classList.remove('clockwise');
    v.showUserPrompt(
      translator.lang.repoSizeWarning.text + (size / 1024).toFixed(2) + 'MB',
      [
        {
          label: translator.lang.repoSizeWarningCancel.text,
          event: () => {
            v.hideUserPrompt();
          },
        },
        {
          label: translator.lang.repoSizeWarningProceed.text,
          event: async () => {
            // restart the loading spinner
            document.getElementById('GithubLogo').classList.add('clockwise');
            // hide the warning prompt
            v.hideUserPrompt();
            // proceed with clone
            gm.clone(branchurl, branch)
              .then(() => {
                loadFile(file);
                updateFileStatusDisplay();
              })
              .catch((e) => {
                showCloneErrorAlert(e);
              });
          },
        },
      ],
      'warning'
    );
  } else {
    console.log('Repo size is OK, proceeding with clone...');
    gm.clone(branchurl, branch)
      .then(() => {
        loadFile(file);
        updateFileStatusDisplay();
      })
      .catch((e) => {
        showCloneErrorAlert(e);
      });
  }
}
