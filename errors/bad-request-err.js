import { ERROR_CODE_INVALID } from '../utils/utils';

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_INVALID;
  }
};
