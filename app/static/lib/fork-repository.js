import { calcSizeOfContainer } from './resizer.js';
import { sampleEncodings, samp, gm, translator } from './main.js';
import { forkRepoClicked } from './github-menu.js';

const seperator = '|MEI-FRIEND|';

function onOrganizationInputChange(e) {
  if (e.target.value) {
    const userOrgRepos = document.getElementById('forkRepositoryInputRepo');
    userOrgRepos.innerHTML =
      '<option value="" disabled selected hidden>' + translator.lang.selectRepository.text + '</option>';
    document.getElementById('forkRepoGithubLogo').classList.add('clockwise');
    let repos = fillInUserOrgRepos();
  }
} // onOrganizationInputChange()

function onSelectComposer(e) {
  const orgSelector = document.querySelector('#forkRepertoireOrganization');
  orgSelector.innerHTML = '<option value="" >All GitHub users and organizations</option>';
  orgSelector.removeEventListener('change', onSelectOrganization);
  orgSelector.addEventListener('change', onSelectOrganization);
  const repoSelector = document.querySelector('#forkRepertoireRepository');
  // clear repository selector
  repoSelector.innerHTML =
    '<option value="" disabled selected hidden>' + translator.lang.selectRepository.text + '</option>';
  repoSelector.removeEventListener('change', onSelectRepository);
  repoSelector.addEventListener('change', onSelectRepository);
  let composer = false;
  if (e) {
    composer = e.target.value;
  }
  let orgs = new Set();
  let repos = new Set();
  if (composer) {
    // filter organizations to only those containing composer's works
    const composerEntries = sampleEncodings.filter((s) => s[samp.COMPOSER] === composer);
    composerEntries.forEach((s) => {
      orgs.add(s[samp.ORG]);
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    });
  } else {
    sampleEncodings.forEach((s) => {
      orgs.add(s[samp.ORG]);
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    });
  }
  Array.from(orgs)
    .sort()
    .forEach((o) => {
      let orgOpt = document.createElement('option');
      orgOpt.text = o;
      orgOpt.value = o;
      orgSelector.appendChild(orgOpt);
    });
  Array.from(repos)
    .sort()
    .forEach((r) => {
      let repoOpt = document.createElement('option');
      repoOpt.text = r.split(seperator)[1];
      repoOpt.value = r;
      repoSelector.appendChild(repoOpt);
    });
} // onSelectComposer()

async function fillInUserOrgRepos(per_page = 30, page = 1) {
  // read a page of repos from the specified user or organisation
  // add it to the repository drop-down,
  // recursing to fetch next page, if applicable
  const userOrg = document.getElementById('forkRepositoryInputName').value;
  const repertoireRepo = document.getElementById('forkRepertoireRepository');
  const userOrgRepos = document.getElementById('forkRepositoryInputRepo');
  const status = Array.from(document.getElementsByClassName('forkRepositoryStatus'));
  status.forEach((s) => {
    s.classList.remove('warn');
    s.innerHTML = '';
  });
  if (userOrg) {
    // user or org specified
    const prevRepos = userOrgRepos.childNodes;
    const repos = await gm.getSpecifiedUserOrgRepos(userOrg, per_page, page);
    if (Array.isArray(repos)) {
      repos.forEach((repo) => {
        const repoOpt = document.createElement('option');
        repoOpt.text = repo.name;
        repoOpt.value = repo.name;
        userOrgRepos.appendChild(repoOpt);
      });
      if (repos.length && repos.length === per_page) {
        // there may be more repos on the next page
        fillInUserOrgRepos(per_page, page + 1);
      } else {
        // finished!
        document.getElementById('forkRepoGithubLogo').classList.remove('clockwise');
      }
    } else {
      // give up!
      document.getElementById('forkRepoGithubLogo').classList.remove('clockwise');
      status.forEach((s) => (s.innerHTML = translator.lang.repoAccessError.text));
      if ('message' in repos) {
        status.forEach(
          (s) => (s.innerHTML += ' Github ' + translator.lang.message.text + ': <i>' + repos['message'] + '</i>')
        );
      }
    }
  }
} // fillInUserOrgRepos()

function onSelectOrganization(e) {
  const orgInput = document.querySelector('#forkRepositoryInputName');
  // clear repository selector
  const repoSelector = document.querySelector('#forkRepertoireRepository');
  repoSelector.innerHTML = '<option value="">Choose a repository</option>';
  repoSelector.removeEventListener('change', onSelectRepository);
  repoSelector.addEventListener('change', onSelectRepository);
  let githubOrg;
  let repos = new Set();
  if (e) {
    githubOrg = e.target.value;
    orgInput.value = e.target.value;
    orgInput.dispatchEvent(new Event('change'));
  }
  if (githubOrg) {
    const orgEntries = sampleEncodings.filter((s) => s[samp.ORG] === githubOrg);
    orgEntries.forEach((s) => {
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    });
  } else {
    sampleEncodings.forEach((s) => {
      repos.add(s[samp.ORG] + seperator + s[samp.REPO]);
    });
  }
  Array.from(repos)
    .sort()
    .forEach((r) => {
      let repoOpt = document.createElement('option');
      repoOpt.text = r.split(seperator)[1];
      repoOpt.value = r;
      repoSelector.appendChild(repoOpt);
    });
} // onSelectOrganization()

function onSelectRepository(e) {
  if (e.target.value) {
    const orgRepo = e.target.value.split(seperator);
    const orgInput = document.querySelector('#forkRepositoryInputName');
    const repoInput = document.querySelector('#forkRepositoryInputRepo');
    orgInput.value = orgRepo[0];
    repoInput.value = orgRepo[1];
  }
} // onSelectRepository()

export async function forkAndOpen(gm, url) {
  // ensure URL matches our expectations
  // (fully qualified raw github url)
  const components = url.match(/https?:\/\/raw.githubusercontent.com\/([^/]+)\/([^/]+)\/(.*)$/);
  console.log('components: ', components);
  if (components && components.length === 4) {
    console.log('forkAndOpen', components);
    let sz = calcSizeOfContainer();
    let fc = document.querySelector('#forkAndOpenOverlay');
    fc.width = sz.width * 0.25;
    fc.height = sz.height * 0.25;
    fc.style.display = 'block';
    let userOrg = components[1];
    let repo = components[2];
    let residue = components[3];
    // n.b., because both branch names and file paths can contain slashes,
    // it is hard to distinguish between them in the URL; but we need to know both!
    // therefore, retrieve the list of branches and match them against the residue (finding a branch that is the starting substring of the residue)
    let branches = await gm.getBranches(100, 1, userOrg + '/' + repo);
    console.log('branches', branches, 'residue', residue);
    try {
      residue = residue.replace('refs/remotes/origin/', ''); // remove remote branch prefix if present
      residue = residue.replace('refs/heads/', ''); // remove branch prefix if present
      residue = residue.replace('refs/tags/', ''); // remove tag prefix if present
      let branch = branches.find((b) => residue.startsWith(b.name));
      if (!branch) {
        throw new Error('ForkRepository: URL does not match expectations');
      }
      // the remaining residue is the file path
      components[4] = branch.name;
      components[5] = residue.slice(branch.name.length + 1);

      document.querySelector('#forkRepoRequested').innerText = `${userOrg}/${repo}`;

      let forkToSelector = document.getElementById('forkAndOpenSelector');
      let author = await gm.getAuthor();
      // forkToSelector: User's options as to where to fork the repository to
      forkToSelector.innerHTML = `<option value="${author.username}">${author.username}</option>`;
      gm.getOrgs().then((orgs) =>
        orgs.forEach((org) => {
          try {
            let orgName = org.organization.login;
            forkToSelector.innerHTML += `<option value="${orgName}">${orgName}</option>`;
          } catch (e) {
            console.error("Can't add organization to selector: ", org, e);
          }
        })
      );
      // forkAndOpen fork button
      const forkAndOpenButton = document.getElementById('forkAndOpenButton');
      if (forkAndOpenButton) {
        forkAndOpenButton.addEventListener('click', () => forkAndOpenClicked(components));
      }
    } catch (e) {
      console.warn("'fork' parameter specified but supplied URL violates raw GitHub URL expectations");
      throw new Error('ForkRepository: URL does not match expectations', e, url);
    }
  }
} // forkAndOpen()

export function forkAndOpenClicked(components) {
  // set up values for forkRepoClicked():
  console.log('forkAndOpenClicked', components);
  document.getElementById('forkRepositoryInputName').value = components[1];
  document.getElementById('forkRepositoryInputRepoOverride').value = components[2];
  // components[3] is the branch name + file path (but undifferentiated since both can contain slashes)
  document.getElementById('forkRepositoryInputBranchOverride').value = components[4];
  document.getElementById('forkRepositoryInputFilepathOverride').value = '/' + components[5];
  document.getElementById('GithubLogo').classList.add('clockwise');
  forkRepoClicked();
} // forkAndOpenClicked()

export async function forkRepository(gm) {
  let author = await gm.getAuthor();
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('#forkRepositoryOverlay');
  fc.width = sz.width * 0.25;
  fc.height = sz.height * 0.25;
  fc.style.display = 'block';
  // public repertoire selectors:
  let composerSelector = document.querySelector('#forkRepertoireComposer');
  let organizationSelector = document.querySelector('#forkRepertoireOrganization');
  let repositorySelector = document.querySelector('#forkRepertoireRepository');
  // fork UI:
  let organizationNameInput = document.querySelector('#forkRepositoryInputName');
  let forkRepoSelector = document.querySelector('#forkRepositoryInputRepo');
  let forkToSelector = document.querySelector('#forkRepositoryToSelector');
  // initialise public repertoire dropdowns
  composerSelector.innerHTML = '<option value="" >' + translator.lang.allComposers.text + '</option>';
  let composers = new Set(sampleEncodings.map((s) => s[samp.COMPOSER]));
  Array.from(composers)
    .sort()
    .forEach((c) => {
      let composerOpt = document.createElement('option');
      composerOpt.text = c;
      composerOpt.value = c;
      composerSelector.appendChild(composerOpt);
    });

  composerSelector.removeEventListener('change', onSelectComposer);
  composerSelector.addEventListener('change', onSelectComposer);
  organizationSelector.removeEventListener('change', onSelectOrganization);
  organizationSelector.addEventListener('change', onSelectOrganization);
  repositorySelector.removeEventListener('change', onSelectRepository);
  repositorySelector.addEventListener('change', onSelectRepository);
  organizationNameInput.removeEventListener('change', onOrganizationInputChange);
  organizationNameInput.addEventListener('change', onOrganizationInputChange);

  onSelectComposer(); // initialise

  // forkToSelector: User's options as to where to fork the repository to
  forkToSelector.innerHTML = `<option value="${author.username}">${author.username}</option>`;
  gm.getOrgs().then((orgs) =>
    orgs.forEach((org) => {
      try {
        let orgName = org.organization.login;
        forkToSelector.innerHTML += `<option value="${orgName}">${orgName}</option>`;
      } catch (e) {
        console.error("Can't add organization to selector: ", org, e);
      }
    })
  );

  if (organizationNameInput.value.length) {
    document.getElementById('forkRepoGithubLogo').classList.add('clockwise');
    fillInUserOrgRepos(); // initialise with pre-supplied name
  }
} // forkRepository()

export function forkRepositoryCancel() {
  // user has cancelled the "fork repository" action
  // => hide fork interface
  // n.b. there are two, 'normal' and forkAndOpen, so we have to iterate:
  let forkRepositoryElements = Array.from(document.querySelectorAll('.forkRepositoryOverlay'));
  // show file status, hide forkRepository
  forkRepositoryElements.forEach((e) => (e.style.display = 'none'));
} // forkRepositoryCancel()
