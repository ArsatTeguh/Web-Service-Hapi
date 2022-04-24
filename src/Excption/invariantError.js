const ClientError = require('./ClientError');

class invariantError extends ClientError {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = invariantError;