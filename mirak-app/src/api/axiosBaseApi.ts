import axios from "axios";
import { NetworkError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, TooManyRequestsError } from "./errs";
import { httpErrorMessages } from "./errs/errorMessages";

const api = axios.create();
 
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      throw new NetworkError();
    }

    const { status } = error.response;

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