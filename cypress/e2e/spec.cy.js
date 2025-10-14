import '../support/commands.js'
// describe('getSalesforceToken', () => {
//   it('returns an instance url to access the Salesforce api', () => {
//       return cy.request({
//       method: 'POST',
//       url: 'https://test.salesforce.com/services/oauth2/token',
//       form: true,
//       body: {
//         grant_type: 'password',
//         client_id: Cypress.env('SF_KEY'),
//         client_secret: Cypress.env('SF_SECRET'),
//         username: Cypress.env('SA_USERNAME'),
//         password: Cypress.env('SA_PASSWORD') 
//       }
//     }).then((res) => {
//       cy.log(res.body.instance_url);
//       cy.log(res.body.access_token);
//     })
//   })  
// });

// console.log(fs.readFileSync
//   (path.join
//     (__dirname, Cypress.env(
//       'SF_PRIVATE_KEY_PATH'
//     )), 'utf8'));

const getSalesforceTokenJWT = () => {
  return cy.task('generateJWT').then(assertion => {
    return cy.request({
      method: 'POST',
      url: 'https://test.salesforce.com/services/oauth2/token',
      form: true,
      failOnStatusCode: false,
      body: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion
      }
    }).then(response => {
      if (response.status != 200) {
        cy.log('JWT error:', response.body);
        throw new Error('JWT Bearer flow failed');
      }
      return {
        access_token: response.body.access_token,
        instance_url: response.body.instance_url
      }
  })
  })  
}


describe('JWT Bearer Flow Test', () => {
  it('should authenticate with SF using jwt', () => {
    getSalesforceTokenJWT().then(auth => {
      expect(auth.access_token).to.exist;
      expect(auth.instance_url).to.exist;
      cy.log('Authenticated');
      cy.log('Instance URL: ', auth.instance_url);

      // "/services/data/v58.0/sobjects/Opportunity/006ct00000AHEATAA5"
      const q = "SELECT Id, Name, StageName, Amount, CloseDate, IsPrivate FROM opportunity LIMIT 25";
      //WHERE Name='Private Long Opportunity'
      
      cy.request({
        method: 'GET',
        url: `${auth.instance_url}/services/data/v58.0/query`,
        // url: `${auth.instance_url}/services/data/v58.0/sobjects/Opportunity/006ct00000AS7btAAD`,
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
          'Content-Type': 'application/json'
        },
        qs: {
          q: q
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        cy.log('Opportunity metadata: ', JSON.stringify(response.body));

        // expect(response.body).to.have.property('objectDescribe');
        // expect(response.body.objectDescribe).to.have.property('name', 'Opportunity');
      })
    });
  })
});


