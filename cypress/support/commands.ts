declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      waitForHydration(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForHydration', () => {
  cy.get('[data-testid]')
    .first()
    .should(($element) => {
      const isHydrated = Object.keys($element[0]).some((key) => key.startsWith('__reactFiber$'));
      expect(isHydrated, 'React heeft de pagina overgenomen').to.equal(true);
    });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.waitForHydration();
  cy.get('[data-testid="email-input"]').clear().type(email);
  cy.get('[data-testid="password-input"]').clear().type(password, { log: false });
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="tab-bar"]').should('be.visible');
});

export {};
