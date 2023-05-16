const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./utils');

module.exports.getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
