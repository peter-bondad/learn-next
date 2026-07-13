import { HttpStatus, HttpStatusCode } from "./http-status-code";

export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: HttpStatusCode,
  ) {
    super(message);

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    public readonly errors: unknown,
    message = "Validation failed.",
  ) {
    super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
  }
}
