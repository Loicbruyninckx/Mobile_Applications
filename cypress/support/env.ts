export function envValue(key: string): string {
  const value: unknown = Cypress.env(key);
  if (typeof value !== 'string' || value === '') {
    throw new Error(`${key} ontbreekt in cypress.env.json (zie cypress.env.example.json).`);
  }
  return value;
}
