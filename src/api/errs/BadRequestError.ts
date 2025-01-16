import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError{
    constructor(message: string = "Bad Request"){
        super(400,message);
        this.name = "BadRequestError";
    }
}