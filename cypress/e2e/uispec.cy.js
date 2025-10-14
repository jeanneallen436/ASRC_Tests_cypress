import '../support/commands.js'
describe('Salesforce Login', () => {
    it('Logs into Salesforce Sandbox', () => {
        
        cy.visit(Cypress.env('SALESFORCE_URL'))
      // cy.visit(Cypress.env('SALESFORCE_URL'));
        // )
        cy.log(Cypress.env('PERSONAL_USERNAME'));
        cy.log(Cypress.env('PERSONAL_PASSWORD'));

        cy.get('[name="username"]').type(Cypress.env('PERSONAL_USERNAME'));
        cy.get('[name="pw"]').type(Cypress.env('PERSONAL_PASSWORD'));
        cy.get('[name="Login"]').click();

        //supress error message
        // cy.origin to redirect ourselves
        cy.origin('https://asrcindustrial--itttestenv.sandbox.lightning.force.com', () => { cy.on('uncaught:exception', (e) => { if (e.message.includes('Things went bad')) { 
          // we expected this error, so let's ignore it 
          // // and let the test continue 
          return false } }) }) 
          cy.visit('https://asrcindustrial--itttestenv.sandbox.lightning.force.com/one/one.app')
    })
});