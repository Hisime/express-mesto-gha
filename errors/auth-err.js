import { ERROR_CODE_AUTH } from '../utils/utils';

module.exports = class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_AUTH;
  }
};
