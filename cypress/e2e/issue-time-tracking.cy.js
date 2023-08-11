describe("Time tracking", () => {
  const issueTitle = "Time tracking 1";
  const issueDescription = "TEST Time tracking";
  const issueList = '[data-testid="list-issue"]';
  const issueDetails = '[data-testid="modal:issue-details"]'
  const iconClose = '[data-testid="icon:close"]'
  const inputHours = 'input[placeholder="Number"]'
  const windowTimeTracking = '[data-testid="modal:tracking"]'

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
        cy.get('[data-testid="modal:issue-create"]').within(() => {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Story"]').trigger("click");
          cy.get(".ql-editor").type(issueDescription);
          cy.get('input[name="title"]').type(issueTitle);
          cy.get('[data-testid="select:userIds"]').click();
          cy.get('[data-testid="select-option:Lord Gaben"]').click();
          cy.get('button[type="submit"]').click();
          cy.get('[data-testid="modal:issue-create"]').should("not.exist");
        });
      });
  });
  it("Should add, edit and delete time in Time estimation field", () => {
    //Add estimation
    cy.get(issueList);
    cy.contains(issueTitle).click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("No time logged").should("be.visible");
    cy.contains("Original Estimate (hours)").next().click();
    cy.get(inputHours).type("10");
    cy.contains("10h estimated").should("be.visible");
    cy.get(iconClose).first().click();
    cy.get(issueDetails).should("not.exist");
    cy.contains(issueTitle).click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("10h estimated").should("be.visible");
    cy.contains("Original Estimate (hours)")
      .next()
      .within(() => {
        cy.get('[placeholder="Number"]').click().should("have.value", "10");
      });

    //Update estimation
    cy.contains("Original Estimate (hours)").next().click();
    cy.get(inputHours).clear().type("20");
    cy.contains("20h estimated").should("be.visible");
    cy.get(iconClose).first().click();
    cy.get(issueDetails).should("not.exist");
    cy.contains(issueTitle).click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("20h estimated").should("be.visible");
    cy.contains("Original Estimate (hours)")
      .next()
      .within(() => {
        cy.get('[placeholder="Number"]').click().should("have.value", "20");
      });

    //Remove estimation
    cy.contains("Original Estimate (hours)").next().click();
    cy.get(inputHours).clear();
    cy.get(iconClose).first().click();
    cy.get(issueDetails).should("not.exist");
    cy.contains(issueTitle).click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("Original Estimate (hours)")
      .next()
      .within(() => {
        cy.get('[placeholder="Number"]').should("be.visible");
      });
  });

  it("Should log the time and remove the logged time", () => {
    //Log time
    cy.get(issueList);
    cy.contains(issueTitle).click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("Time Tracking").next().click();
    cy.get(windowTimeTracking).should("be.visible");
    cy.contains("Time spent (hours)").next().click().type("2");
    cy.contains("Time remaining (hours)").next().click().type("5");
    cy.get("button").contains("Done").click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("No time logged").should("not.exist");
    cy.contains("2h logged").should("be.visible");
    cy.contains("5h remaining").should("be.visible");

    //Remove logged time
    cy.contains("Time Tracking").next().click();
    cy.get(windowTimeTracking).should("be.visible");
    cy.contains("Time spent (hours)").next().click().clear();
    cy.contains("Time remaining (hours)").next().click().clear();
    cy.get("button").contains("Done").click();
    cy.get(issueDetails).should("be.visible");
    cy.contains("No time logged").should("be.visible");
    cy.contains("2h logged").should("not.exist");
    cy.contains("5h remaining").should("not.exist");
  });
});
