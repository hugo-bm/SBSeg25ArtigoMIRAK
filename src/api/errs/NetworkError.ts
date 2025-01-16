export class NetworkError extends Error {
    constructor(message: string = 'Network Error') {
      super(message);
      this.name = 'NetworkError';
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }