import { codebergLogo, githubLogo, gitlabLogo, solidLogo } from '../css/icons.js';

export default class Profile {
  constructor() {
    this.github = {
      login: () => (window.location.href = '/login'),
      available: false,
      icon: githubLogo,
      options: {
        titleGitHubSettings: {
          type: 'header',
          title: 'GitHub',
          description: 'GitHub (git cloud service), used for version control and collaboration',
        },
        github_loginStatus: {
          type: 'span',
          title: 'Logged in as: ',
          value: '',
        },
        github_loginButton: {
          type: 'button',
          title: 'Login to GitHub',
          description: 'Login to GitHub',
          value: 'Login',
        },
        github_logoutButton: {
          type: 'button',
          title: 'Logout from GitHub',
          description: 'Logout from GitHub',
          value: 'Logout',
        },
      },
      obj: {}, // handle object for GitHub
    };
    this.solid = {
      login: () => console.log('login to solid'), // stub
      available: false,
      icon: solidLogo,
      options: {
        titleSolidSettings: {
          type: 'header',
          title: 'Solid',
          description:
            'Solid (decentralised Web platform), used for stand-off (RDF/Linked Data) annotation storage and sharing',
        },
        solid_loginStatus: {
          type: 'span',
          title: 'Logged in as: ',
          value: '',
        },
        solid_idpSelect: {
          type: 'select',
          title: 'Select IdP',
          description:
            'Select a Solid Identity Provider (IdP) from the list (or choose other radio button to enter a custom one)',
          labels: ['Solid Community', 'Inrupt'],
          values: ['https://solidcommunity.net', 'https://solid.inrupt.net'],
          default: true,
          radioId: 'idpSolidPrescribed',
          radioName: 'idpSolidType',
        },
        solid_idpCustom: {
          type: 'text',
          title: 'Custom IdP',
          description:
            'Enter the URL of a custom Solid Identity Provider (IdP) (or choose a radio button to select from a list)',
          placeholder: 'https://your.solid.provider',
          radioId: 'idpSolidCustom',
          radioName: 'idpSolidType',
        },
        solid_loginButton: {
          type: 'button',
          title: 'Login to Solid',
          description: 'Login to Solid',
          value: 'Login',
        },
        solid_logoutButton: {
          type: 'button',
          title: 'Logout from Solid',
          description: 'Logout from Solid',
          value: 'Logout',
        },
      },
      obj: {}, // handle object for Solid
    };
    this.gitlab = {
      login: () => console.log('login to gitlab'), // stub
      available: false,
      icon: gitlabLogo,
      options: {
        // empty for now
      },
      obj: {}, // handle object for GitLab
    };
    this.codeberg = {
      login: () => console.log('login to codeberg'), // stub
      available: false,
      icon: codebergLogo,
      options: {
        // empty for now
      },
      obj: {}, // handle object for Codeberg
    };
  } // constructor()

  initialise(available) {
    // actions to run on page load:
    // check if tokens configured for the git providers,
    // check if user is logged in for each profile provider
    // modify UI accordingly
    this.codeberg.available = available.codeberg;
    this.github.available = available.github;
    this.gitlab.available = available.gitlab;
    this.solid.available = true; // always available
  } // initialise()

  drawProfileTable() {
    console.log('drawing profile table');
    // clear profile panel
    const profilePanel = document.getElementById('profilePanelList');
    profilePanel.innerHTML = '';
    // create table element for profile panel
    const profileTable = document.createElement('table');
    profileTable.id = 'profilePanelTable';
    Object.keys(this).forEach((profile) => {
      // add row to table for each available profile provider
      if (this[profile].available) {
        const profileRow = this.buildProfileRow(profile);
        profileTable.appendChild(profileRow);
      }
    });
    // insert table into profile panel
    profilePanel.appendChild(profileTable);
  } // drawProfileTable()

  updateSettingsStatus() {
    /* for each profile provider, update the settings status:
       if user is logged in:
         add user name into `loginStatus{$profile}` span 
         hide idp select and custom input (if they exist)
         hide login button 
       if user is not logged in:
         hide user name span and logout button
      Finally, show/hide git menu (depending on whether at least one git provider 
        is available and user is logged in)
         */
    Object.keys(this).forEach((profile) => {
      if (this[profile].available) {
        const loginStatus = document.getElementById(`${profile}_loginStatus`);
        const loginStatusLabel = document.querySelector(`label[for="${profile}_loginStatus"]`);
        const loginButton = document.getElementById(`${profile}_loginButton`);
        const logoutButton = document.getElementById(`${profile}_logoutButton`);
        const idpSelect = document.getElementById(`${profile}_idpSelect`);
        const idpSelectLabel = document.querySelector(`label[for="${profile}_idpSelect"]`);
        const idpCustom = document.getElementById(`${profile}_idpCustom`);
        const idpCustomLabel = document.querySelector(`label[for="${profile}_idpCustom"]`);
        if (this[profile].obj.userLogin) {
          // user is logged in
          loginStatus.innerText = this[profile].obj.userLogin;
          loginButton.style.display = 'none';
          if (idpSelect) {
            idpSelect.style.display = 'none';
            idpSelectLabel.style.display = 'none';
          }
          if (idpCustom) {
            idpCustom.style.display = 'none';
            idpCustomLabel.style.display = 'none';
          }
        } else {
          // user is not logged in
          loginStatus.style.display = 'none';
          loginStatusLabel.style.display = 'none';
          logoutButton.style.display = 'none';
        }
      }
    });
    this.toggleGitMenu(); // show/hide git menu
  } // updateSettingsStatus()

  buildProfileRow(profile) {
    // create table row element for profile provider
    const profileRow = document.createElement('tr');
    profileRow.id = `profile_${profile}`;
    // add logo
    const profileLogo = document.createElement('td');
    profileLogo.id = `profile_${profile}Logo`;
    profileLogo.innerHTML = this[profile].icon;
    // add user name or login msg + click handler
    const profileName = document.createElement('td');
    if (this[profile].obj.userLogin) {
      profileName.id = `profile_${profile}UserName`;
      profileName.innerText = this[profile].obj.author.name || this[profile].obj.userLogin;
      profileName.removeEventListener('click', this[profile].login);
      profileName.addEventListener('click', () => {
        // visually indicate git menu dropdown button
        const gitBtn = document.getElementById('gitMenu');
        gitBtn.classList.add('indicate');
        // remove after 2s
        setTimeout(() => gitBtn.classList.remove('indicate'), 2000);
      });
    } else {
      profileName.id = `profile_${profile}LoginMsg`;
      profileName.addEventListener('click', this[profile].login);
    }
    // add settings
    const profileSettings = document.createElement('td');
    profileSettings.id = `profile_${profile}Settings`;
    profileSettings.className = 'profilePanelListFnc';
    // add logout
    const profileLogout = document.createElement('td');
    profileLogout.id = `profile_${profile}Logout`;
    profileLogout.className = 'profilePanelListFnc';
    // add row to table
    profileRow.appendChild(profileLogo);
    profileRow.appendChild(profileName);
    profileRow.appendChild(profileSettings);
    profileRow.appendChild(profileLogout);
    return profileRow;
  } // buildProfileRow()

  toggleGitMenu() {
    // if at least one git provider is available and user is logged in, show git menu
    let gitMenu = document.getElementById('gitMenu');
    if (
      (this.github.available && this.github.obj.userLogin) ||
      (this.gitlab.available && this.gitlab.obj.userLogin) ||
      (this.codeberg.available && this.codeberg.obj.userLogin)
    ) {
      gitMenu.style.display = 'block';
    } else {
      gitMenu.style.display = 'none';
    }
  } // toggleGitMenu()
}
