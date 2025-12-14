// Jest setup file for SweetApp tests
// This runs before all test files

// Set test environment
process.env.NODE_ENV = 'test';

// Set a test JWT secret if not already set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
}

// Set test database URI if not already set
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/sweetshop_test';
}

// Set JWT expiration
if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '7d';
}

// Increase test timeout for database operations
jest.setTimeout(30000);
