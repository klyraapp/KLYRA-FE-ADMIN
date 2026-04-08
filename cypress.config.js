const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: 0,
  video: false,
  chromeWebSecurity: true,
  scrollBehavior: "center",
  videosFolder: "src/__test__/cypress/videos",
  fixturesFolder: "src/__test__/cypress/fixtures",
  downloadsFolder: "src/__test__/cypress/downloads",
  supportFolder: "src/__test__/cypress/support",
  screenshotsFolder: "src/__test__/cypress/screenshots",

  e2e: {
    specPattern: "src/__tests__/cypress/e2e/**/*.cy.js",
    supportFile: "src/__tests__/cypress/support/index.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
