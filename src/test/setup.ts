import '@testing-library/jest-dom';

// Mock ResizeObserver for all tests
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
