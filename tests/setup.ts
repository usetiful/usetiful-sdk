// Setup file for Jest tests
import 'jest-environment-jsdom';

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Reset DOM
  document.head.innerHTML = '';
  document.body.innerHTML = '';

  // Reset window properties
  delete (window as any).usetifulTags;
  delete (window as any).USETIFUL;

  // Reset process.env for each test
  process.env = { ...process.env };
});

afterEach(() => {
  // Restore console methods
  console.error = originalError;
  console.warn = originalWarn;
});
