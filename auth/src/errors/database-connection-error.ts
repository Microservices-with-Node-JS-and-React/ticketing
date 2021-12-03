import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to databse';

  constructor() {
    super('Error connecting to db');

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
