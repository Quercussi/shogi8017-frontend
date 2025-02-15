import { AuthError } from 'next-auth';

export class InvalidLoginError extends AuthError {
    code: string = '';
    constructor(message: string) {
        super(message);
        this.code = message;
    }
}
