export default class Storage {
  constructor() {
    this.override = false;
    try {
      this.storage = window.localStorage;
      this.supported = true;
    } catch (err) {
      this.supported = false;
      console.warn("Unable to access local storage: ", err);
    }
  }

  safelySetStorageItem(item, content) {
    if (this.supported && !this.override) {
      try {
        if (content && typeof content === "object") {
          content = JSON.stringify(content);
        }
        this.storage.setItem(item, content);
      } catch (err) {
        this.override = true;
        console.warn("Disabling local storage for current file - " +
          "could not save file content. Content may be too big? ",
          meiXml.length, err);
        this.clear();
        this.read();
      }
    }
  }

  read() {
    if (this.storage) {
      // write directly into private "_" vars to bypass
      // setter functions, avoiding needless writes to storage
      this._content = this.storage.getItem("meiXml");
      this._fileName = this.storage.getItem("meiFileName");
      this._fileLocation = this.storage.getItem("meiFileLocation");
      this._fileLocationType = this.storage.getItem("meiFileLocationType");
      this._github = JSON.parse(this.storage.getItem("github"));
      this._fileChanged = this.storage.getItem("fileChanged");
      this._isMEI = this.storage.getItem("isMEI");
      this._orientation = this.storage.getItem("orientation");
      this._page = this.storage.getItem("page");
      this._scale = this.storage.getItem("scale");
      this._select = JSON.parse(this.storage.getItem("select")); // Array
      this._speed = this.storage.getItem("speed");
      this._breaks = this.storage.getItem("breaks");
      this._forkAndOpen = this.storage.getItem("forkAndOpen");
      //fileChangedFromStorage = fileChangedFromStorage ? parseInt(storage.getItem("fileChanged")) : 0;
    }
  }

  clear() {
    if (this.supported) {
      this.storage.clear();
    }
  }

  removeItem(item) {
    if (this.supported) {
      this.storage.removeItem(item);
      this["_" + item] = null;
    }
  }

  hasItem(item) {
    if (this.supported) {
      return this.storage.getItem(item) !== null;
    }
  }

  set storage(storage) {
    this._storage = storage;
  }

  get storage() {
    if (this.supported) {
      return this._storage;
    } else {
      console.warn("Unable to access local storage.");
      return null;
    }
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this.safelySetStorageItem("meiXml", content);
    this._content = content;
  }

  get fileName() {
    return this._fileName;
  }

  set fileName(fileName) {
    this.safelySetStorageItem("meiFileName", fileName);
    this._fileName = fileName;
  }

  get isMEI() { 
    return this._isMEI === "true";
  }

  set isMEI(isMEI) { 
    this.safelySetStorageItem("isMEI", isMEI);
    this._isMEI = isMEI;
  }

  get fileLocation() {
    return this._fileLocation;
  }

  set fileLocation(fileLocation) {
    if (!fileLocation) {
      fileLocation = "";
    }
    this.safelySetStorageItem("meiFileLocation", fileLocation);
    this._fileLocation = fileLocation;
  }

  get fileLocationType() {
    return this._fileLocationType;
  }

  set fileLocationType(fileLocationType) {
    this.safelySetStorageItem("meiFileLocationType", fileLocationType);
    this._fileLocationType = fileLocationType;
  }

  get fileLocationPrintable() {
    if (!this.fileLocation || !this.fileLocationType) {
      console.warn(
        "fileLocationPrintable retrieved without fileLocation and " +
        "fileLocationType:", this)
    } else {
      switch (this.fileLocationType) {
        case "url":
          return new URL(this.fileLocation).hostname;
        case "github":
          if (this.github) {
            return this.github.githubRepo + ":";
          } else {
            console.warn("fileLocationPrintable retrieved with " +
              "fileLocationType 'github' but no github object", this);
            return null;
          }
          case "file":
            return "File: ";
          default:
            console.warn("fileLocationPrintable called with invalid " +
              "fileLocationType", this);
            return null;
      }
    }
  }

  set fileLocationPrintable(fileLocationPrintable) {
    console.warn("Do not set fileLocationPrintable directly.");
  }

  get github() {
    return this._github;
  }

  set github(github) {
    this.safelySetStorageItem("github", github);
    this._github = github;
  }

  get fileChanged() {
    return parseInt(this._fileChanged);
  }

  set fileChanged(fileChanged) {
    this.safelySetStorageItem("fileChanged", fileChanged);
    this._fileChanged = fileChanged;
  }

  get override() {
    return this._override;
  }

  set override(override) {
    this._override = override;
  }

  get orientation() {
    return this._orientation;
  }

  set orientation(orientation) {
    this.safelySetStorageItem("orientation", orientation);
    this._orientation = orientation;
  }

  get page() {
    return parseInt(this._page);
  }

  set page(page) {
    this.safelySetStorageItem('page', page);
    this._page = page;
  }

  get scale() {
    return parseInt(this._scale);
  }

  set scale(scale) {
    this.safelySetStorageItem('scale', scale);
    this._scale = scale;
  }

  get select() {
    return this._select;
  }

  set select(select) {
    this.safelySetStorageItem('select', select);
    this._select = select;
  }

  get speed() {
    return this._speed === 'true';
  }

  set speed(speed) {
    this.safelySetStorageItem('speed', speed);
    this._speed = speed;
  }

  get breaks() {
    return this._breaks;
  }

  set breaks(breaks) {
    this.safelySetStorageItem('breaks', breaks);
    this._breaks = breaks;
  }

  get forkAndOpen() {
    return this._forkAndOpen;
  }

  set forkAndOpen(forkAndOpen) {
    this.safelySetStorageItem('forkAndOpen', forkAndOpen);
    this._forkAndOpen = forkAndOpen;
  }

}
