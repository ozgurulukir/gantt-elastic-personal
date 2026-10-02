const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    fixturesFolder: "tests/fixtures",
    specPattern: "tests/integration/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/support/index.js",
    screenshotsFolder: "tests/screenshots",
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
