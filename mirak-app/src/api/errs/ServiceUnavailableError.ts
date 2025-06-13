import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 503 Service Unavailable error.
 *
 * This error indicates that the server is not ready to handle the request,
 * often due to overload or maintenance.
 *
 * @extends HttpError
 */
export class ServiceUnavailableError extends HttpError {
  /**
   * Creates a ServiceUnavailableError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Service Unavailable") {
    super(503, message);
    this.name = "ServiceUnavailableError";
  }
}
