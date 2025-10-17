import '../support/commands'

describe("hits microsoft auth for CR and generates token", () => {
    it('gets oauth token', () => {
        let siteId;
        let listId;
        cy.request({
            method: 'POST',
            url: 'https://login.microsoftonline.com/c0418322-fe34-4984-a04c-db74999c2442/oauth2/v2.0/token',
            form: true,
            body: {
                grant_type: 'client_credentials',
                client_id: Cypress.env('AZURE_CLIENT_ID'),
                client_secret: Cypress.env('AZURE_CLIENT_SECRET'),
                // scope: 'https://craftranker.sharepoint.com/.default' //must use sharepoint api to create sites
                scope: 'https://graph.microsoft.com/.default'
                // NOTE: need different token for graph api !IMPORTANT!
            }
        }).then((res) => {
            //NOTE: This will not work, need certificate flow to create subsites
            // expect(res.status).to.be.eq(200);
            // const accessToken = res.body.access_token;
            // cy.log('Access Token:', accessToken);

            // cy.request({
            //     method: 'POST',
            //         url: 'https://craftranker.sharepoint.com/sites/DocumentCenterSiteCollection/_api/web/webinfos/add',
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //             'Content-Type': 'application/json',
            //             Accept: 'application/json;odata=verbose' 
            //         },
            //         body: {
            //              parameters: {
            //                 __metadata: { type: 'SP.WebInfoCreationInformation' },
            //                 Url: 'test-site-01', 
            //                 Title: "Test Site 01",
            //                 Description: "Test site created by Cypress [TEST-SITE]",
            //                 Language: 1033,
            //                 WebTemplate: 'STS#3',
            //                 "UseUniquePermissions": true
            //              }
            //         }
            // })

            expect(res.status).to.be.eq(200);
            const accessToken = res.body.access_token;
            //NOTE: end of non-working POST

            //Get site id
            cy.request({
                url: 'https://graph.microsoft.com/v1.0/sites/craftranker.sharepoint.com:/sites/DocumentCenterSiteCollection',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((res) => {
                cy.log('Site ID: ', res.body.id);  
                siteId = res.body.id;
            })

            //get list ID
            cy.request({
                url: `https://graph.microsoft.com/v1.0/sites/${siteId}/lists`,
                headers: { 'Authorization': `Bearer ${accessToken}`}
            }).then((res) => {
                cy.log('Lists:', res.body.value);
                const myList = res.body.value.find(list => list.displayName == 'Opportunities');
                listId = myList.id;
            })

            cy.request({
                method: 'POST',
                url: `https://graph.microsoft.com/v1.0/sites/${siteId}/Lists/${listId}/items`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    Title: 'Awesome List item',
                    NumericalIdentity: 43578
                }
            })
            

        })
    })
})