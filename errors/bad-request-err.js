const { ERROR_CODE_INVALID } = require('../utils/utils');

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_INVALID;
  }
};
