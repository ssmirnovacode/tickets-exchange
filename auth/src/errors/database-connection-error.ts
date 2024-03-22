export class DatabaseConnectionError extends Error {
  // fixed value:
  statusCode = 500;
  reason = "Error connecting to database";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
