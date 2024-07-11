import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// Option for using mocking canvas testing
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Add Default Functions, for example providers as here:
// https://testing-library.com/docs/react-testing-library/setup/#custom-render

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
