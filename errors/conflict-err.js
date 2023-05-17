const { ERROR_CODE_CONFLICT } = require('../utils/utils');

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_CONFLICT;
  }
};
