import { envValue } from '../support/env';

describe('Inloggen en uitloggen', () => {
  it('1a: inloggen lukt en je blijft ingelogd na verversen', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.get('[data-testid="login-button"]').should('be.visible');
    cy.waitForHydration();

    cy.get('[data-testid="email-input"]').type(envValue('TEST1_EMAIL'));
    cy.get('[data-testid="password-input"]').type(envValue('TEST1_PASSWORD'), { log: false });
    cy.get('[data-testid="login-button"]').click();

    cy.location('pathname').should('eq', '/');
    cy.get('[data-testid="tab-bar"]').should('be.visible');
    cy.get('[data-testid="tab-index"]').should('have.attr', 'aria-selected', 'true');

    cy.reload();
    cy.location('pathname').should('eq', '/');
    cy.get('[data-testid="tab-bar"]').should('be.visible');
  });

  it('1b: fout wachtwoord geeft een foutmelding', () => {
    cy.visit('/login');
    cy.waitForHydration();
    cy.get('[data-testid="email-input"]').type(envValue('TEST1_EMAIL'));
    cy.get('[data-testid="password-input"]').type('dit-is-fout-123');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-error"]').should('be.visible');
    cy.location('pathname').should('eq', '/login');
    cy.get('[data-testid="tab-bar"]').should('not.exist');
  });

  it('1c: uitloggen brengt je naar het inlogscherm, ook via de URL', () => {
    cy.login(envValue('TEST1_EMAIL'), envValue('TEST1_PASSWORD'));

    cy.get('[data-testid="tab-profiel"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.location('pathname').should('eq', '/login');
    cy.get('[data-testid="login-button"]').should('be.visible');

    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
    cy.get('[data-testid="tab-bar"]').should('not.exist');
  });
});
