describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it.only('Priority', () => {
  const expectedLength = 5
  let selectedPriorityValues = []
  const selectPriority = '[data-testid="select:priority"]'
  const priorityOptions = 'div[class="sc-csuQGl ihmNIY"]'
  //const priorityOptions = ['Lowest', 'Low', 'Medium', 'High', 'Highest']

 // cy.get(selectPriority).selectedPriorityValues.push('[class="sc-dymIpo jpWath"]');
  cy.get('div[class="sc-dymIpo jpWath"]').invoke('text').then((initialPriority) => {
    selectedPriorityValues.push(initialPriority.trim())
  })

  cy.get(selectPriority).click();

  /*
  cy.get(selectPriority).invoke('val').then((initialPriority) => {
    selectedPriorityValues.push(initialPriority);

    // Step 3: Open the priority dropdown
    cy.get(selectPriority).click();
    
    // Step 4: Loop through priority options and push values into the array
    cy.get('div[class="sc-csuQGl ihmNIY"]' > 'option').each(($option) => {
      const optionValue = $option.val();
      selectedPriorityValues.push(optionValue);

      // Step 5: Log the added value and array length during each iteration
      cy.log(`Added value: ${optionValue}, Array length: ${selectedPriorityValues.length}`);
    }).then(() => {
      // Step 6: Assert that the array has the expected length
      expect(selectedPriorityValues).to.have.length(expectedLength);

      // Step 7: Assert the expected priority values in the array
      const expectedPriorityValues = ['Lowest', 'Low', 'Medium', 'High', 'Highest'];
      expect(selectedPriorityValues).to.deep.equal(expectedPriorityValues);

      // Optional: Log the final array for verification
      cy.log('Final array:', selectedPriorityValues);
    });
  })
*/
  //cy.get(selectPriority).click().contains("High").click()
  //cy.get(selectPriority).then(($priorityDropdown) => {
    //const initialPriority = $priorityDropdown.text().trim();
    //selectedPriorityValues.push(initialPriority);
    
    //cy.get(selectPriority).click();
    
    // Access all options from the dropdown and loop through them
    //cy.get(selectPriority).each(($option) => {
      //const priorityValue = $option.text().trim();
      //selectedPriorityValues.push(priorityValue);
      //cy.log(`Added value: ${priorityValue}, Array length: ${selectedPriorityValues.length}`);

      //cy.wrap(selectedPriorityValues).should('have.length', expectedLength);
})
  })


  it('Should check that reporter name has only characters in it', () => {
    cy.get('[data-testid="select:reporter"]').invoke('text').then((reporterName) => {
      expect(reporterName).to.match(/^[A-Za-z ]*$/);
    });
  })

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
