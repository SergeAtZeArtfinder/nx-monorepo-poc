import '@testing-library/jest-dom/vitest';

// Add Default Functions, for example providers as here:
// https://testing-library.com/docs/react-testing-library/setup/#custom-render

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
