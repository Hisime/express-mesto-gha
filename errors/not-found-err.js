const { ERROR_CODE_NOT_FOUND } = require('../utils/utils');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
};
