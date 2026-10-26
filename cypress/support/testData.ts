/**
 * Vaste testdata uit supabase/seed.sql, gedeeld door de tests (browser)
 * en de taken (Node). Pas seed.sql en dit bestand altijd samen aan.
 */
export const TESTGROEP_CODE = 'TEST01';
export const TEST_BEER_NAME = 'Testbier';
export const TEST_CAFE_NAME = 'Testcafé';

/** Review van de rating die rate-beer.cy.ts via de UI maakt. */
export const RATE_REVIEW = 'E2E-test review';
/** Review van de rating die join-group.cy.ts klaarzet via een taak. */
export const FEED_REVIEW = 'E2E-feed rating';

/** Alles met een van deze reviews mag na een testrun weg. */
export const E2E_REVIEWS = [RATE_REVIEW, FEED_REVIEW];

/** Wat de taak getTestContext teruggeeft: id's die de tests nodig hebben voor hun testID's. */
export interface TestContext {
  groupId: string;
  test1Id: string;
  test2Id: string;
}
