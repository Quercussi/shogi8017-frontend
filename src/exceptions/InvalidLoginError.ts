import { AuthError } from 'next-auth';

export default class InvalidLoginError extends AuthError {
  code: string = '';
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}
