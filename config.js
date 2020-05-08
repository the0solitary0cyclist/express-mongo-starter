
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/starter';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/starter-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET_STRING'; // fix this later
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
