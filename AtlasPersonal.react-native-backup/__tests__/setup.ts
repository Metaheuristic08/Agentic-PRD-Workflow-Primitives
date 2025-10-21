// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress error logs in tests
  warn: jest.fn(), // Suppress warning logs in tests
};
