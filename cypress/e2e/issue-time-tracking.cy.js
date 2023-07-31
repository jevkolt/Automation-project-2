describe('Time tracking', () => {
    const issueTitle = 'Time tracking 1'
    const issueDescription = 'TEST Time tracking'

beforeEach(() => {


    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Story"]')
                .trigger('click');
            cy.get('.ql-editor').type(issueDescription);
            cy.get('input[name="title"]').type(issueTitle);
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Lord Gaben"]').click();
            cy.get('button[type="submit"]').click();
            cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        })
    })
})
it('Time estimation - adding, editing, deleting', () => {

    //Add estimation
    cy.get('[data-testid="list-issue"]')
    cy.contains(issueTitle).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('No time logged').should('be.visible')
    cy.contains('Original Estimate (hours)').next().click()
    cy.get('input[placeholder="Number"]').type('10')
    cy.contains('10h estimated').should('be.visible')
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should('not.exist')
    cy.contains(issueTitle).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('10h estimated').should('be.visible')
    cy.contains('Original Estimate (hours)').next().within(() => {
        cy.get('[placeholder="Number"]').click().should('have.value', '10');
    })

    //Update estimation
    cy.contains('Original Estimate (hours)').next().click()
    cy.get('input[placeholder="Number"]').clear().type('20')
    cy.contains('20h estimated').should('be.visible')
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should('not.exist')
    cy.contains(issueTitle).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('20h estimated').should('be.visible')
    cy.contains('Original Estimate (hours)').next().within(() => {
        cy.get('[placeholder="Number"]').click().should('have.value', '20');
    })

    //Remove estimation
    cy.contains('Original Estimate (hours)').next().click()
    cy.get('input[placeholder="Number"]').clear()
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should('not.exist')
    cy.contains(issueTitle).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('Original Estimate (hours)').next().within(() => {
        cy.get('[placeholder="Number"]').should('be.visible');
    })
})

it('Time logging', () => {
    //Log time
    cy.get('[data-testid="list-issue"]')
    cy.contains(issueTitle).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('Time Tracking').next().click()
    cy.get('[data-testid="modal:tracking"]').should('be.visible')
    cy.contains('Time spent (hours)').next().click().type('2')
    cy.contains('Time remaining (hours)').next().click().type('5')
    cy.get('button').contains('Done').click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('No time logged').should('not.exist')
    cy.contains('2h logged').should('be.visible')
    cy.contains('5h remaining').should('be.visible')

    //Remove logged time
    cy.contains('Time Tracking').next().click()
    cy.get('[data-testid="modal:tracking"]').should('be.visible')
    cy.contains('Time spent (hours)').next().click().clear()
    cy.contains('Time remaining (hours)').next().click().clear()
    cy.get('button').contains('Done').click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    cy.contains('No time logged').should('be.visible')
    cy.contains('2h logged').should('not.exist')
    cy.contains('5h remaining').should('not.exist')
})
})
