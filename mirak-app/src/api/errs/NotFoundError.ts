import { HttpError } from "./HttpError";
/**
 * Represents an HTTP 404 Not Found error.
 *
 * This error indicates that the requested resource could not be found.
 *
 * @extends HttpError
 */
export class NotFoundError extends HttpError {
  /**
   * Creates a NotFoundError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Not Found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}
