/**
 * The Worker for XML validation.
 * (author: Laurent Pugin)
 */

importScripts("https://www.verovio.org/javascript/validator/xml-validator.js");
// importScripts('./deferred.js');
// import {
//     Deferred
// } from './deferred.js';
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        });
    }
}

let methods = {
    setSchema: null,
    validate: null,
    setRelaxNGSchema: null,
    validateNG: null
};

// Global deferred Promise that can be resolved when Module is initialized
const moduleIsReady = new Deferred();

Module.onRuntimeInitialized = function () {
    methods.setSchema = Module.cwrap('set_schema', 'bool', ['string']);
    methods.validate = Module.cwrap('validate', 'string', ['string']);
    methods.setRelaxNGSchema = Module.cwrap('set_relaxNG_schema', 'bool', ['string']);
    methods.validateNG = Module.cwrap('validate_NG', 'string', ['string']);

    moduleIsReady.resolve();
};

// Listen to messages send to this worker
addEventListener('message', function (event) {
    // Destruct properties passed to this message event
    const {
        taskId,
        method,
        args
    } = event.data;

    console.log('validator-worker: ' + Math.random() + ', data ', event.data);

    // postMessage on a `onRuntimeInitialized` method as soon as
    // Module is initialized
    if (method === 'onRuntimeInitialized') {
        moduleIsReady.promise.then(() => {
            postMessage({
                taskId,
                method,
                args,
                result: null,
            }, event);
        });
        return;
    }

    // Check if verovio toolkit has passed method
    const fn = methods[method || null];
    let result;
    if (fn) {
        //console.debug( "Calling", method );
        result = fn.apply(null, args || []);
    } else {
        console.warn("Unkown", method);
    }

    // Always respond to worker calls with postMessage
    postMessage({
        taskId,
        method,
        args,
        result,
    }, event);
}, false);