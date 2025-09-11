import 'reflect-metadata';

// Global test setup
beforeAll(async () => {
  // Setup test database or other global test setup
});

afterAll(async () => {
  // Cleanup after all tests
});

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
