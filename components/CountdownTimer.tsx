import { getTimeRemaining } from "@/lib/pollLogic";

type CountdownTimerProps = {
  endTime: string | Date;
};

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const time = getTimeRemaining(new Date(endTime));

  return (
    <span className={time.isClosingSoon ? "text-orange-400" : "text-zinc-400"}>
      {time.label}
    </span>
  );
}
