import { getTimeRemaining } from "@/lib/pollLogic";

type CountdownTimerProps = {
  endTime: string | Date;
};

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const time = getTimeRemaining(new Date(endTime));

  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.26em] ${
        time.isClosingSoon ? "text-[color:var(--secondary)]" : "text-[color:var(--muted)]"
      }`}
    >
      {time.label}
    </span>
  );
}
