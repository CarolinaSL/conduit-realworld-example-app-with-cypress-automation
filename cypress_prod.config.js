const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    emailDefault: 'email@email.com',
    passwordDefault: '123456',
    nameDefault: 'test'
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://conduit-realworld-example-app.fly.dev/',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
