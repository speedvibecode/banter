export function calculateExposure(aPoints: number, bPoints: number): number {
  return aPoints - bPoints;
}

export function reputationChange(exposure: number, winner: "A" | "B"): number {
  return winner === "A" ? exposure : -exposure;
}
