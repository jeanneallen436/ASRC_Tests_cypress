import '../support/commands.js'

// describe("hits SP API for token a creates site with custom TEST flag", () => {

//     it('gets oauth token', () => {
//         cy.request({
//             method: 'POST',
//             url: 'https://login.microsoftonline.com/82904411-315c-407f-8131-bcc1ea4fa0cb/oauth2/v2.0/token',
//             form: true,
//             body: {
//                 grant_type: 'client_credentials',
//                 client_id: Cypress.env('CLIENT_ID'),
//                 client_secret: Cypress.env('CLIENT_SECRET'),
//                 scope: 'https://asrccorp.sharepoint.com/.default' //must use sharepoint api to create sites
//                 // NOTE: need different token for graph api !IMPORTANT!
//             }
//         }).then((res) => {
//             expect(res.status).to.be.eq(200);
//             const accessToken = res.body.access_token;
//             cy.log('Access Token:', accessToken);

//             // cy.pause();
//             // get parent site ID to use for graph api reqs later
//             // cy.request({
//             //     method: 'GET',
//             //     url: 'https://graph.microsoft.com/v1.0/sites/asrccorp.sharepoint.com:/sites/AISProposalsPublicSector',
//             //     headers: {
//             //         Authorization: `Bearer ${accessToken}`
//             //     }
//             // }).then((res) => {
//                 // const parentSiteId = res.body.id;
//                 // cy.log('Parent site id:', parentSiteId);
//                 // main domain,tenantId,siteId
//                 cy.pause();
//                 // create site
//                 cy.request({
//                     method: 'POST',
//                     url: 'https://asrccorp.sharepoint.com/sites/AISProposalsPublicSector/_api/web/webinfos/add',
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         'Content-Type': 'application/json',
//                         Accept: 'application/json;odata=verbose' 
//                     },
//                     body: {
//                          parameters: {
//                             __metadata: { type: 'SP.WebInfoCreationInformation' },
//                             Url: 'test-site-01', 
//                             Title: "Test Site 01",
//                             Description: "Test site created by Cypress [TEST-SITE]",
//                             Language: 1033,
//                             WebTemplate: 'STS#3',
//                             "UseUniquePermissions": true
//                          }
//                     }
//                 }).then((res) => {
//                     cy.log('Subsite created:', res.body);
//                     const newSiteUrl = res.body.d.Url;
//                     cy.log('URL:', res.body.d.Url);
//                     cy.pause();
//                     // Set custom property 
//                     cy.request({
//                         method: 'POST',
//                         url: `${newSiteUrl}/_api/web/AllProperties`,
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                             'Content-Type': 'application/json',
//                             Accept: 'application/json',
//                             'X-HTTP-Method': 'MERGE',
//                             'If-Match': '*'
//                         },
//                         body: {
//                             __metadata: { type: 'SP.PropertyValues' },
//                             IsTestSite: true,
//                             TestSiteCreatedBy: 'Cypress',
//                             TestSiteCreatedDate: new Date().toISOString()
//                         }
//                     })
//                 })

//             // })
            
//         })
//     })
    
// });

describe('creates a sp site with rsa key', () => {
    let accessToken;

    before(() => {
        cy.task('getAccessToken').then((token) => {
            // cy.log(token);
            accessToken = token;
        })
    })
    it('creates a site and adds a test flag', () => {
        cy.pause();
        cy.request({
            method: 'POST',
            url: 'https://craftranker.sharepoint.com/sites/DocumentCenterSiteCollection/_api/web/webs/add',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;odata=verbose',
                Accept: 'application/json;odata=verbose'
            },
            body: {
                parameters: {

                    '__metadata': { 'type': 'SP.WebCreationInformation' },               
                    Url: 'test-site-02', 
                    Title: "Test Site 02",
                    Description: "Test site created by Cypress [TEST-SITE]",
                    Language: 1033,
                    WebTemplate: 'STS#3',
                    "UseSamePermissionsAsParentSite": false               
                }
            }
        }).then((res) => {
            cy.log('Subsite created:', res.body);
            const newSiteUrl = res.body.d.Url;
            cy.log('URL:', res.body.d.Url);

            cy.pause();

            //Set custom property (TEST flag)
            cy.request({
                method: 'POST',
                url: `${newSiteUrl}/_api/web/AllProperties`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': '*'
                },
                body: {
                    __metadata: {
                        type: 'SP.PropertyValues'
                    },
                    IsTestSite: true,
                    TestSiteCreatedBy: 'Cypress',
                    TestSiteCreatedDate: new Date().toISOString
                }
            })
        })
    })
})