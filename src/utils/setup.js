// Test-Setup-Datei
import '@testing-library/jest-dom';

// Mock für localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock für fetch
global.fetch = jest.fn();

// Bereinigung nach jedem Test
afterEach(() => {
  jest.clearAllMocks();
});
