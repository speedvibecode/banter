type VoteBarProps = {
  aPercent: number;
  bPercent: number;
  className?: string;
};

export function VoteBar({ aPercent, bPercent, className = "" }: VoteBarProps) {
  return (
    <div
      className={`flex h-3 overflow-hidden rounded-full bg-zinc-800 ${className}`.trim()}
      aria-label={`Option A ${aPercent}% and Option B ${bPercent}%`}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-500"
        style={{ width: `${aPercent}%` }}
      />
      <div
        className="h-full bg-orange-500 transition-all duration-500"
        style={{ width: `${bPercent}%` }}
      />
    </div>
  );
}
