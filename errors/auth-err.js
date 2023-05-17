const { ERROR_CODE_AUTH } = require('../utils/utils');

module.exports = class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_AUTH;
  }
};
