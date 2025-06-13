/**
 * Base class for HTTP-related errors.
 *
 * Extends the built-in `Error` class and adds a `statusCode` property.
 * Intended to be extended by specific HTTP error types.
 *
 * @extends Error
 */
export class HttpError extends Error {
  /**
   * Creates a new HTTP error instance.
   *
   * @param statusCode - The HTTP status code associated with the error.
   * @param message - A human-readable message describing the error.
   */
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
