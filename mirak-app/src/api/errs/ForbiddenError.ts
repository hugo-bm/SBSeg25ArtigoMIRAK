import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 403 Forbidden error.
 *
 * This error indicates that the client does not have permission to access
 * the requested resource.
 *
 * @extends HttpError
 */
export class ForbiddenError extends HttpError {
  /**
   * Creates a ForbiddenError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}
