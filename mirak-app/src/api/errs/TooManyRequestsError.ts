import { HttpError } from './HttpError';

export class TooManyRequestsError extends HttpError {
  constructor(message: string = 'Too Many Requests') {
    super(429, message);
    this.name = 'TooManyRequestsError';
  }
}