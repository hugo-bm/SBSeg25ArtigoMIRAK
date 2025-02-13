import { HttpError } from "./HttpError";

export class InternalServerError extends HttpError{
    constructor(message: string = "Error of Internal Server"){
        super(500,message);
        this.name = "InternalServerError";
    }
}