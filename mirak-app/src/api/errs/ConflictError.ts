import { HttpError } from "./HttpError";

export class ConflictError extends HttpError{
    constructor(message: string = "Conflict"){
        super(409,message);
        this.name = "ConflictError";
    }
}