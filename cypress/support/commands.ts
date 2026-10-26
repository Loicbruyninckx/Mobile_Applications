/**
 * Eigen Cypress-commando's.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logt in via het inlogscherm en wacht tot Home met de tabbalk zichtbaar is. */
      login(email: string, password: string): Chainable<void>;
      /**
       * Wacht tot React de pagina overgenomen heeft. De app gebruikt static output:
       * eerst komt kale HTML binnen, pas daarna reageren velden en knoppen.
       */
      waitForHydration(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForHydration', () => {
  // React hangt een __reactFiber$...-sleutel aan elk element dat het beheert.
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
  // log: false = het wachtwoord komt niet in de Cypress-log of op screenshots.
  cy.get('[data-testid="password-input"]').clear().type(password, { log: false });
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="tab-bar"]').should('be.visible');
});

export {};
