import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 409 Conflict error.
 *
 * This error indicates that the request could not be completed due to a
 * conflict with the current state of the resource.
 *
 * @extends HttpError
 */
export class ConflictError extends HttpError {
  /**
   * Creates a ConflictError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Conflict") {
    super(409, message);
    this.name = "ConflictError";
  }
}
