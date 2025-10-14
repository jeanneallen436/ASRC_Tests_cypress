const { defineConfig } = require("cypress");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const msal = require('@azure/msal-node')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config = require('cypress-dotenv')(config);

      on('task', {
        generateJWT() {
          const payload = {
            iss: config.env.SF_KEY,
            sub: config.env.SA_USERNAME,
            aud: 'https://test.salesforce.com',
            exp: Math.floor(Date.now() / 1000) + (5 * 60)
          };

          const privateKey = fs.readFileSync('./server.key', 'utf8');
          return jwt.sign(payload, privateKey, { algorithm: 'RS256'})
        }
      })
      on('task', {
        async getAccessToken() {
          const payload = {
            auth: {
              clientId: config.env.AZURE_CLIENT_ID,
              authority: `https://login.microsoftonline.com/${config.env.MS_TENANT_ID}`,
              clientCertificate: {
                thumbprint: config.env.KEY_THUMBPRINT,
                privateKey: fs.readFileSync('SharePointAppCert_n.pem', 'utf8')
              }
            }
          };

          const cca = new msal.ConfidentialClientApplication(payload);

          const tokenRequest = {
            scopes: ['https://craftranker.sharepoint.com/.default']
          }

          const res = await cca.acquireTokenByClientCredential(tokenRequest);
          return res.accessToken;
        }
      })



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
      return config;
    },
  },
});
