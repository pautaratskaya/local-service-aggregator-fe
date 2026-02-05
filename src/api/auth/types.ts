import { ApiError } from '../errors';

export class AuthError extends ApiError {
  constructor(message: string, statusCode: number, type: string) {
    super(message, statusCode, type);
    this.name = 'AuthError';
  }
}
