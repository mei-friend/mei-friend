import { codebergLogo, githubLogo,  gitlabLogo, solidLogo} from '../css/icons.js';

export default class Profile {
  constructor() {
    this.github = {
        login: () => window.location.href = '/login',
        available: false,
        icon: githubLogo,
    };
    this.solid = {
        login: () => console.log('login to solid'), // stub
        available: false,
        icon: solidLogo,
    };
    this.gitlab = {
        login: () => console.log('login to gitlab'), // stub
        available: false,
        icon: gitlabLogo,
    };
    this.codeberg = {
        login: () => console.log('login to codeberg'), // stub
        available: false,
        icon: codebergLogo,
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
    this.drawProfileTable();
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
        if(this[profile].available) {
            const profileRow = this.buildProfileRow(profile);
            profileTable.appendChild(profileRow);
        }
    });
    // insert table into profile panel
    profilePanel.appendChild(profileTable);
  } // drawProfileTable()

    buildProfileRow(profile) {
        // create table row element for profile provider
        const profileRow = document.createElement('tr');
        profileRow.id = `profile_${profile}`;
        // add logo
        const profileLogo = document.createElement('td');
        profileLogo.id = `profile_${profile}Logo`;
        profileLogo.innerHTML = this[profile].icon;
        // add name
        const profileName = document.createElement('td');
        profileName.id = `profile_${profile}NameOrLoginMsg`;
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
}