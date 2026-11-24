/**
 * MainThreadValidator runs the XML validator in the page rather than in a
 * worker, with the same interface as the WorkerProxy around validator-worker.js, so
 * that it can take its place: onRuntimeInitialized(), setRelaxNGSchema(), validateNG().
 *
 * Safari needs this. JavaScriptCore gives a worker a much smaller stack than the main
 * thread, and libxml2's RelaxNG parser recurses past it while reading the MEI schema:
 * set_relaxNG_schema() ends in "RangeError: Maximum call stack size exceeded" for every
 * schema beyond mei-basic (a newer build of the validator, with libxml2 2.10.3, fails in
 * the same way, so this is not a question of the build). On the main thread the same
 * module reads the same schema in about 0.6 s and then validates as quickly as it does
 * in a worker elsewhere (measured in WebKit: 85 ms for 217 kB, 2 s for 4.4 MB).
 *
 * The price is that both calls block the interface while they run, which is why they
 * let the browser paint first: the validation status icon shows that work is going on
 * before the thread stops answering. For the same reason, automatic validation is off
 * by default on Safari (see main.js), and switching it on warns about the pauses.
 */

const loadTimeout = 20000; // ms waited for the validator to come up, per attempt
const loadAttempts = 3;
const retryDelay = 1000; // ms before a load is tried again

export class MainThreadValidator {
  /**
   * @param {string} url of the validator (the same build validator-worker.js loads)
   */
  constructor(url) {
    this.url = url;
    this.methods = {};
  } // constructor()

  /**
   * Loads the validator into the page and waits for its runtime, like the
   * onRuntimeInitialized() message of the worker (which also resolves with null).
   * @returns {Promise<null>}
   */
  async onRuntimeInitialized() {
    // the build is not modularized: it takes its settings from a global Module object
    // and puts its exports there. Nothing else on the page goes by that name - the
    // Verovio toolkit, the other Emscripten module of mei-friend, lives in its worker.
    const ready = new Promise((resolve) => (window.Module = { onRuntimeInitialized: resolve }));
    for (let attempt = 1; !(await this.loadScript(ready)); attempt++) {
      // A load that starts while the page is going to /login, as the Let's Encode
      // hand-off does, is aborted (seen in Safari), so it is simply started anew.
      if (attempt >= loadAttempts) {
        throw new Error('Cannot load the validator from ' + this.url);
      }
      console.warn('MainThreadValidator: ' + this.url + ' did not load, trying again');
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
    this.methods.setRelaxNGSchema = window.Module.cwrap('set_relaxNG_schema', 'bool', ['string']);
    this.methods.validateNG = window.Module.cwrap('validate_NG', 'string', ['string']);
    return null;
  } // onRuntimeInitialized()

  /**
   * Adds the validator to the document and waits for its runtime. Gives up when the
   * load fails or does not answer within loadTimeout, and removes the script again.
   * @param {Promise} ready resolves when the runtime of a loaded validator is up
   * @returns {Promise<boolean>} whether the validator is ready
   */
  async loadScript(ready) {
    const script = document.createElement('script');
    script.src = this.url;
    const failed = new Promise((resolve) => {
      script.onerror = () => resolve(false);
      setTimeout(() => resolve(false), loadTimeout); // in case it stays quiet
    });
    document.head.appendChild(script);
    const loaded = (await Promise.race([ready.then(() => true), failed])) === true;
    if (!loaded) script.remove();
    return loaded;
  } // loadScript()

  /**
   * Reads a RelaxNG schema into the validator
   * @param {string} data content of the schema file
   * @returns {Promise<number>} 1 when the schema was read
   */
  async setRelaxNGSchema(data) {
    return this.call('setRelaxNGSchema', data);
  } // setRelaxNGSchema()

  /**
   * Validates an encoding against the schema read before
   * @param {string} meiXML
   * @returns {Promise<string>} validation messages as JSON
   */
  async validateNG(meiXML) {
    return this.call('validateNG', meiXML);
  } // validateNG()

  /**
   * Calls into the validator, after the browser has had its chance to paint
   * @param {string} method
   * @param {string} arg
   */
  async call(method, arg) {
    if (!this.methods[method]) {
      throw new Error('Validator not initialized, cannot call ' + method + '()');
    }
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    return this.methods[method](arg);
  } // call()
} // MainThreadValidator class
