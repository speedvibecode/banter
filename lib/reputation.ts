export function calculateExposure(aPoints: number, bPoints: number): number {
  const rawExposure = aPoints - bPoints;
  return Math.max(-50, Math.min(50, rawExposure));
}

export function reputationChange(aPoints: number, bPoints: number, winner: "A" | "B"): number {
  const exposure = calculateExposure(aPoints, bPoints);
  const conviction = Math.abs(exposure);
  const isCorrect = winner === "A" ? aPoints > bPoints : bPoints > aPoints;

  return isCorrect ? conviction : -conviction;
}
