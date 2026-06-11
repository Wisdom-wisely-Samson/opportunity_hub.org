const crypto = require('crypto');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateToken = (length = 32) => crypto.randomBytes(length).toString('hex');

const isDeadlinePassed = (deadline) => new Date(deadline) < new Date();

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const sanitizeFilename = (filename) => filename.replace(/[^a-zA-Z0-9._-]/g, '_');

module.exports = { hashToken, generateToken, isDeadlinePassed, formatDate, capitalize, sanitizeFilename };
