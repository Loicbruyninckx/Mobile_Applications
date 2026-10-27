/** "4,5" i.p.v. "4.5"; hele getallen zonder komma. */
export function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1).replace('.', ',');
}
