export function determineWinner(totalA: number, totalB: number): "A" | "B" {
  if (totalA > totalB) {
    return "A";
  }

  if (totalB > totalA) {
    return "B";
  }

  return Math.random() >= 0.5 ? "A" : "B";
}

export function calculateSplit(totalA: number, totalB: number) {
  const total = totalA + totalB;

  if (total === 0) {
    return { aPercent: 50, bPercent: 50 };
  }

  const aPercent = Math.round((totalA / total) * 100);
  return { aPercent, bPercent: 100 - aPercent };
}

export function getTimeRemaining(endTime: Date) {
  const diffMs = endTime.getTime() - Date.now();

  if (diffMs <= 0) {
    return { label: "Closed", isClosingSoon: false, isExpired: true };
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const label = hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
  const isClosingSoon = totalMinutes <= 15;

  return { label, isClosingSoon, isExpired: false };
}
