import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 400 Bad Request error.
 *
 * This error indicates that the server cannot or will not process the request
 * due to a client error (e.g., malformed request syntax).
 *
 * @extends HttpError
 */
export class BadRequestError extends HttpError {
  /**
   * Creates a BadRequestError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Bad Request") {
    super(400, message);
    this.name = "BadRequestError";
  }
}
