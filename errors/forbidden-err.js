const { ERROR_CODE_FORBIDDEN } = require('../utils/utils');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_FORBIDDEN;
  }
};
