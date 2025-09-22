const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // launchOptions.preferences = {
          //   ...launchOptions.preferences,
          //   'profile.password_manager_leak_detection': false
          // }
          launchOptions.args.push('--disable-password-manager-leak-detection');
          launchOptions.args.push('--guest');
        }
        return launchOptions;
      })
    },
  },
});
