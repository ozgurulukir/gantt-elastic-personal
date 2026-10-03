// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here: https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
// Alternatively you can use CommonJS syntax:
// require('./commands')

// Any console.error printed by the page fails the owning test.
// The SVG first-paint NaN regression (issue #2) only ever surfaced as browser
// console output, never as a failed assertion - this net makes such output fatal.
// Uncaught page exceptions already fail tests through Cypress' default handling.
// console.warn is deliberately not captured: Vue dev-build warnings also fire
// while chai formats assertion messages (enumerating a component instance for
// objDisplay), which would make the net report its own failure formatting.
const consoleErrors = [];

beforeEach(() => {
  consoleErrors.length = 0;
  cy.on('window:before:load', win => {
    const original = win.console.error.bind(win.console);
    win.console.error = (...args) => {
      const text = args
        .map(arg => {
          if (typeof arg === 'string') {
            return arg;
          }
          try {
            return JSON.stringify(arg);
          } catch (err) {
            return String(arg);
          }
        })
        .join(' ');
      consoleErrors.push(text);
      original(...args);
    };
  });
});

afterEach(function() {
  if (consoleErrors.length > 0) {
    // plain throw with the messages inline - do not deep-equal the array,
    // chai would inspect a huge diff on failure and slow the report down
    throw new Error(
      `browser console errors during "${this.currentTest.title}":\n${consoleErrors.join('\n')}`
    );
  }
});
