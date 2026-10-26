import '@testing-library/jest-dom';

// Polyfill window.scrollIntoView if not present in jsdom
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
