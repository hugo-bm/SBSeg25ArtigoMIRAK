import axios from "axios";
import {
  NetworkError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  TooManyRequestsError,
} from "./errs";
import { httpErrorMessages } from "./errs/errorMessages";

/**
 * Axios instance with a response interceptor for standardized HTTP error handling.
 *
 * This instance of Axios intercepts all HTTP responses and throws custom error
 * classes based on the HTTP status code. This approach centralizes and simplifies
 * error handling across the application.
 *
 * Errors without a response (e.g., network failures) are converted into a `NetworkError`.
 * Known HTTP status codes (e.g., 400, 404) are mapped to specific custom error classes.
 * Unhandled status codes will throw a generic `Error`.
 *
 * @example
 * try {
 *   const response = await api.get("/some-endpoint");
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     // Handle 404
 *   } else if (error instanceof NetworkError) {
 *     // Handle network issue
 *   }
 * }
 */
const api = axios.create();

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response received: likely a network failure
    if (!error.response) {
      throw new NetworkError();
    }

    const { status } = error.response;

    // Handle known HTTP error status codes
    switch (status) {
      case 404:
        throw new NotFoundError(httpErrorMessages[404]);
      case 400:
        throw new BadRequestError(httpErrorMessages[400]);
      case 403:
        throw new ForbiddenError(httpErrorMessages[403]);
      case 401:
        throw new UnauthorizedError(httpErrorMessages[401]);
      case 429:
        throw new TooManyRequestsError(httpErrorMessages[429]);
      case 500:
        throw new InternalServerError(httpErrorMessages[500]);
      case 503:
        throw new UnauthorizedError(httpErrorMessages[503]);
      default:
        throw new Error(`Unexpected HTTP error: ${status}`);
    }
  }
);

export default api;
