import { ERROR_CODE_FORBIDDEN } from '../utils/utils';

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_FORBIDDEN;
  }
};
