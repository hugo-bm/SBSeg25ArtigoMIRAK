import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 401 Unauthorized error.
 *
 * This error indicates that authentication is required and has failed or has not yet been provided.
 *
 * @extends HttpError
 */
export class UnauthorizedError extends HttpError {
  /**
   * Creates an UnauthorizedError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
