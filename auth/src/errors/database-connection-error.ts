export class DatabaseConnectionError extends Error {
  // fixed value:
  reason = "Error connecting to database";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
