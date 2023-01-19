/**
 * The Deferred class wrapping a Promise
 * (author: Laurent Pugin)
 */
export class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
