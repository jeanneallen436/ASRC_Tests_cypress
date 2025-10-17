import '../support/commands.js'

describe('gets auth token SF API', () => {
    it('gets auth token', () => {
        cy.request({
            method: 'POST',
            url: 'https://test.salesforce.com/services/oauth2/token',
            form: true,
            body: {
                grant_type: 'password',
                client_id: Cypress.env('CONSUMER_KEY'),
                client_secret: Cypress.env('CONSUMER_SECRET'),
                username: Cypress.env('PERSONAL_USERNAME'),
                password: Cypress.env('PERSONAL_PASSWORD')
              
            }
        }).then((res) => {
            cy.log(res.body.access_token)
        })
    })
})

// const getSalesforceTokenJWT = () => {
//   return cy.task('generateJWT').then(assertion => {
//     return cy.request({
//       method: 'POST',
//       url: 'https://test.salesforce.com/services/oauth2/token',
//       form: true,
//       failOnStatusCode: false,
//       body: {
//         grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
//         assertion
//       }
//     }).then(response => {
//       if (response.status != 200) {
//         cy.log('JWT error:', response.body);
//         throw new Error('JWT Bearer flow failed');
//       }
//       return {
//         access_token: response.body.access_token,
//         instance_url: response.body.instance_url
//       }
//   })
//   })  
// }

// const randNum = Math.floor(Math.random() * 1000);

// describe('Verify salesforce to sharepoint flow works', () => {
//     it('creates SF opportunity object and visits the new site', () => {
//         // get salesforce token
//         getSalesforceTokenJWT().then(auth => {
//             cy.log(auth.access_token);

//             cy.request({
//                 method: 'POST',
//                 url: `${auth.instance_url}/services/data/v58.0/sobjects/Opportunity`,
//                 headers: {
//                     Authorization: `Bearer ${auth.access_token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: {
//                     Name: `Cypress Test ${randNum} Opportunity`,
//                     StageName: 'Prospecting',
//                     CloseDate: '2025-12-31',
//                     // RecordTypeId: "012aZ000000DH7uQAG",
//                     // Amount: 50000,
//                     // Bid_Type__c: "Time & Materials",
//                     OwnerId: "005aZ00000GOBCPQA5",
//                     // "CreatedById": "005aZ00000GOBCPQA5",
                    
//                 }
//             }).then((res) => {
//                 expect(res.status).to.be.eq(201);
//                 cy.log('Created Opportunity ID:', res.body.id);
//             })
//         })
//     })
// } )