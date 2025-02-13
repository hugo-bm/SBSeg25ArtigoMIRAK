import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError{
    constructor(message: string = "Forbidden"){
        super(403,message);
        this.name = "ForbiddenError";
    }
}