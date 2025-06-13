/**
 * Represents a generic network-related error.
 *
 * Used to handle failures that are not specific to an HTTP response,
 * such as connection timeouts or DNS failures.
 *
 * @extends Error
 */
export class NetworkError extends Error {
  /**
   * Creates a NetworkError instance.
   *
   * @param message - Optional custom error message.
   */
  constructor(message: string = "Network Error") {
    super(message);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
