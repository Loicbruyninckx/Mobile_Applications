export const TESTGROEP_CODE = 'TEST01';
export const TEST_BEER_NAME = 'Testbier';
export const TEST_CAFE_NAME = 'Testcafé';

export const RATE_REVIEW = 'E2E-test review';
export const FEED_REVIEW = 'E2E-feed rating';

export const E2E_REVIEWS = [RATE_REVIEW, FEED_REVIEW];

export interface TestContext {
  groupId: string;
  test1Id: string;
  test2Id: string;
}
