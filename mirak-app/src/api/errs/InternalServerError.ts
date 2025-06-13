import { HttpError } from "./HttpError";
/**
 * Represents an HTTP 500 Internal Server Error.
 *
 * This error indicates that an unexpected condition was encountered on the server.
 *
 * @extends HttpError
 */
export class InternalServerError extends HttpError {
  /**
   * Creates an InternalServerError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Error of Internal Server") {
    super(500, message);
    this.name = "InternalServerError";
  }
}
