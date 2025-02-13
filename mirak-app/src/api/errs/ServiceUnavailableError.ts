import { HttpError } from './HttpError';

export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Service Unavailable') {
    super(503, message);
    this.name = 'ServiceUnavailableError';
  }
}