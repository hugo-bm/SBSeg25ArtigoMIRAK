import { HttpError } from "./HttpError";

/**
 * Represents an HTTP 429 Too Many Requests error.
 *
 * This error indicates that the user has sent too many requests in a given amount of time.
 *
 * @extends HttpError
 */
export class TooManyRequestsError extends HttpError {
  /**
   * Creates a TooManyRequestsError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Too Many Requests") {
    super(429, message);
    this.name = "TooManyRequestsError";
  }
}
