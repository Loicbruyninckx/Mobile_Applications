import { envValue } from '../support/env';
import { RATE_REVIEW, TEST_BEER_NAME, TEST_CAFE_NAME, type TestContext } from '../support/testData';

describe('Bier raten', () => {
  let context: TestContext;

  before(() => {
    cy.task('deleteE2eRatings');
    cy.task<TestContext>('getTestContext').then((result) => {
      context = result;
    });
  });

  after(() => {
    cy.task('deleteE2eRatings');
  });

  beforeEach(() => {
    cy.login(envValue('TEST1_EMAIL'), envValue('TEST1_PASSWORD'));
    cy.get('[data-testid="tab-toevoegen"]').click();
  });

  function chooseTestBeer() {
    cy.get('[data-testid="beer-search"]').type(TEST_BEER_NAME);
    cy.get('[data-testid="beer-result"]').first().click();
    cy.get('[data-testid="beer-selected"]').should('contain.text', TEST_BEER_NAME);
  }

  it('2a: een rating maken verschijnt in Mijn ratings en in de feed', () => {
    chooseTestBeer();

    cy.get('[data-testid="star-4"]').click();
    [1, 2, 3, 4].forEach((star) => {
      cy.get(`[data-testid="star-${star}-filled"]`).should('exist');
    });
    cy.get('[data-testid="star-5-filled"]').should('not.exist');
    cy.get('[data-testid="star-4"]').should('have.attr', 'aria-checked', 'true');
    cy.get('[data-testid="star-3"]').should('have.attr', 'aria-checked', 'false');

    cy.get('[data-testid="review-input"]').type(RATE_REVIEW);

    cy.get('[data-testid="cafe-search"]').type(TEST_CAFE_NAME);
    cy.get('[data-testid="cafe-result"]').first().click();
    cy.get('[data-testid="cafe-selected"]').should('contain.text', TEST_CAFE_NAME);

    cy.get(`[data-testid="group-chip-${context.groupId}"]`).then(($chip) => {
      if ($chip.attr('aria-checked') !== 'true') cy.wrap($chip).click();
    });
    cy.get(`[data-testid="group-chip-${context.groupId}"]`).should('have.attr', 'aria-checked', 'true');

    cy.get('[data-testid="save-rating-button"]').click();
    cy.get('[data-testid="rating-toast"]').should('be.visible');
    cy.get('[data-testid="rating-error"]').should('not.exist');

    cy.get('[data-testid="tab-mijn-ratings"]').click();
    cy.contains('[data-testid="rating-card"]', RATE_REVIEW).within(() => {
      cy.get('[data-testid="rating-card-beer-name"]').should('contain.text', TEST_BEER_NAME);
      cy.get('[data-testid="rating-card-stars"]').should('have.attr', 'aria-label', '4 van 5 sterren');
    });

    cy.get('[data-testid="tab-index"]').click();
    cy.contains('[data-testid="feed-card"]', RATE_REVIEW).within(() => {
      cy.get('[data-testid="feed-card-beer-name"]').should('contain.text', TEST_BEER_NAME);
      cy.get('[data-testid="feed-card-stars"]').should('have.attr', 'aria-label', '4 van 5 sterren');
    });
  });

  it('2b: zonder score wordt er niets opgeslagen', () => {
    cy.task<number>('countTest1Ratings').then((countBefore) => {
      chooseTestBeer();
      cy.get('[data-testid="save-rating-button"]').click();

      cy.get('[data-testid="rating-error"]').should('be.visible').and('contain.text', 'score');
      cy.get('[data-testid="rating-toast"]').should('not.exist');
      cy.task<number>('countTest1Ratings').should('eq', countBefore);
    });
  });
});
