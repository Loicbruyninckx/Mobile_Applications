import { envValue } from '../support/env';
import { FEED_REVIEW, TESTGROEP_CODE, type TestContext } from '../support/testData';

describe('Groep joinen met een code', () => {
  let context: TestContext;

  const testgroepCard = () => `[data-testid="group-card-${context.groupId}"]`;

  const countGroupCards = () =>
    cy.get('[data-testid="group-list"]').then(($list) => $list.find('[data-testid^="group-card-"]').length);

  before(() => {
    cy.task('leaveTestgroep');
    cy.task('deleteE2eRatings');
    cy.task('createFeedRating');
    cy.task<TestContext>('getTestContext').then((result) => {
      context = result;
    });
  });

  after(() => {
    cy.task('leaveTestgroep');
    cy.task('deleteE2eRatings');
  });

  function openGroepenAsTest2() {
    cy.login(envValue('TEST2_EMAIL'), envValue('TEST2_PASSWORD'));
    cy.get('[data-testid="tab-groepen"]').click();
    cy.get('[data-testid="group-list"]').should('exist');
  }

  function joinWithCode(code: string) {
    cy.get('[data-testid="join-code-input"]').clear().type(code);
    cy.get('[data-testid="join-button"]').click();
  }

  it('3a: met een geldige code word je lid en zie je de feed van de groep', () => {
    openGroepenAsTest2();
    cy.get(testgroepCard()).should('not.exist');

    joinWithCode(TESTGROEP_CODE);
    cy.get('[data-testid="join-toast"]').should('be.visible').and('not.contain.text', 'al lid');
    cy.get('[data-testid="join-error"]').should('not.exist');
    cy.get(testgroepCard()).should('be.visible');

    cy.get(testgroepCard()).click();
    cy.get(`[data-testid="member-${context.test1Id}"]`).should('be.visible');
    cy.get(`[data-testid="member-${context.test2Id}"]`).should('be.visible');

    cy.get('[data-testid="tab-index"]').click();
    cy.contains('[data-testid="feed-card"]', FEED_REVIEW).scrollIntoView().should('be.visible');
  });

  it('3b: een ongeldige code geeft een foutmelding en geen nieuwe groep', () => {
    openGroepenAsTest2();
    countGroupCards().then((countBefore) => {
      joinWithCode('XXXXXX');
      cy.get('[data-testid="join-error"]').should('be.visible');
      cy.get('[data-testid="join-toast"]').should('not.exist');
      countGroupCards().should('eq', countBefore);
    });
  });

  it('3c: als je al lid bent, krijg je een melding en staat de groep er niet dubbel', () => {
    cy.task('joinTestgroep');
    openGroepenAsTest2();
    cy.get(testgroepCard()).should('have.length', 1);

    joinWithCode(TESTGROEP_CODE);
    cy.get('[data-testid="join-toast"]').should('be.visible').and('contain.text', 'al lid');
    cy.get('[data-testid="join-error"]').should('not.exist');
    cy.get(testgroepCard()).should('have.length', 1);
  });
});
