/**
 * The WorkerProxy class for communicating with a worker through Promises.
 * (author: Laurent Pugin)
 */

import { Deferred } from './deferred.js';

let id = 1;
const calllist = {};

export class WorkerProxy {
  constructor(worker) {
    this.worker = worker;
    // Listen to response of the service worker
    this.worker.addEventListener(
      'message',
      function (event) {
        const { taskId, result } = event.data;
        // Check if there is a Deferred instance in workerTasks
        const task = calllist[taskId];
        if (task) {
          // If so resolve deferred promise and pass the returned value
          task.resolve(result);
          // delete it from the list
          delete calllist[taskId];
        }
      },
      false
    );

    // Return a Proxy so it is possible to catch all property and method or function calls of a the worker
    return new Proxy(this, {
      get: (target, method) => {
        return function () {
          const taskId = id++;
          const args = Array.prototype.slice.call(arguments);

          // Post a message to service worker with UUID, method or function name of the worker and passed arguments
          target.worker.postMessage({
            taskId,
            method,
            args,
          });

          // Create a new Deferred instance and store it in workerTasks HashMap
          const deferred = new Deferred();
          calllist[taskId] = deferred;

          // Return the (currently still unresolved) Promise of the Deferred instance
          return deferred.promise;
        };
      },
    });
  } // constructor()
} // WorkerProxy class
