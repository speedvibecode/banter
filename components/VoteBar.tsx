type VoteBarProps = {
  aPercent: number;
  bPercent: number;
  className?: string;
};

export function VoteBar({ aPercent, bPercent, className = "" }: VoteBarProps) {
  return (
    <div
      className={`flex h-2 overflow-hidden bg-white/[0.08] ${className}`.trim()}
      aria-label={`Option A ${aPercent}% and Option B ${bPercent}%`}
    >
      <div
        className="h-full bg-[color:var(--primary)] shadow-[0_0_16px_rgba(109,254,156,0.5)] transition-all duration-500"
        style={{ width: `${aPercent}%` }}
      />
      <div
        className="h-full bg-[color:var(--secondary)] shadow-[0_0_16px_rgba(193,128,255,0.45)] transition-all duration-500"
        style={{ width: `${bPercent}%` }}
      />
    </div>
  );
}
