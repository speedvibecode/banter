"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, Waves, X } from "lucide-react";

import { VoteBar } from "@/components/VoteBar";

type ResultTrendModalProps = {
  aPercent: number;
  bPercent: number;
  title: string;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function buildInterpolatedPoints(current: number) {
  const baseShift = 12 + (current % 9);
  const secondaryShift = 5 + (current % 5);
  const points = [
    clamp(current - baseShift),
    clamp(current - secondaryShift - 3),
    clamp(current - Math.round(secondaryShift / 2)),
    clamp(current + (current > 52 ? 2 : -2)),
    clamp(current)
  ];

  return points.map((point, index) => ({
    label: `P${index + 1}`,
    value: point
  }));
}

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const controlX = (previous.x + current.x) / 2;
    path += ` C ${controlX} ${previous.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

export function ResultTrendModal({ aPercent, bPercent, title }: ResultTrendModalProps) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => buildInterpolatedPoints(aPercent), [aPercent]);
  const momentum = useMemo(() => {
    const last = data[data.length - 1]?.value ?? aPercent;
    const previous = data[data.length - 2]?.value ?? aPercent;
    const diff = last - previous;

    if (diff > 3) {
      return { icon: TrendingUp, label: "Rising", tone: "text-[color:var(--primary)]" };
    }

    if (diff < -3) {
      return { icon: TrendingDown, label: "Cooling", tone: "text-[color:var(--secondary)]" };
    }

    return { icon: Waves, label: "Stable", tone: "text-[color:var(--muted)]" };
  }, [aPercent, data]);
  const chartPoints = useMemo(() => {
    const width = 320;
    const height = 180;

    return data.map((point, index) => ({
      x: (index / Math.max(1, data.length - 1)) * width,
      y: height - (point.value / 100) * height
    }));
  }, [data]);
  const path = useMemo(() => buildPath(chartPoints), [chartPoints]);
  const finalPoint = chartPoints[chartPoints.length - 1];
  const isAWinning = aPercent >= bPercent;
  const lineColor = isAWinning ? "var(--primary)" : "var(--secondary)";
  const MomentumIcon = momentum.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left transition hover:scale-[1.01]"
        aria-label={`Open trend chart for ${title}`}
      >
        <VoteBar aPercent={aPercent} bPercent={bPercent} className="h-3 cursor-pointer" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="shell-panel w-full max-w-2xl p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker">Trend view</p>
                <h2 className="mt-2 font-[var(--font-space)] text-2xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-3xl">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center bg-[color:var(--ghost-bg)] text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                aria-label="Close trend chart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="muted-kicker">Interpolated momentum</span>
              <span className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] ${momentum.tone}`}>
                <MomentumIcon className="h-4 w-4" />
                {momentum.label}
              </span>
            </div>

            <div className="mt-5 bg-surface-low p-4 sm:p-5">
              <svg viewBox="0 0 320 180" className="h-[180px] w-full overflow-visible">
                <defs>
                  <linearGradient id="trend-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={lineColor} stopOpacity="0.26" />
                    <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 180 L 0 180" fill="none" />
                <path d={`${path} L 320 180 L 0 180 Z`} fill="url(#trend-fill)" className="animate-[fade-in_220ms_ease]" />
                <path
                  d={path}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-[draw-line_400ms_ease]"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
                />
                {finalPoint ? (
                  <circle cx={finalPoint.x} cy={finalPoint.y} r="5" fill={lineColor} />
                ) : null}
              </svg>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="bg-[color:var(--surface-high)] px-3 py-3">
                  <p className="muted-kicker">Option A</p>
                  <p className="mt-2 text-xl font-bold text-[color:var(--text)]">{aPercent}%</p>
                </div>
                <div className="bg-[color:var(--surface-high)] px-3 py-3">
                  <p className="muted-kicker">Option B</p>
                  <p className="mt-2 text-xl font-bold text-[color:var(--text)]">{bPercent}%</p>
                </div>
                <div className="bg-[color:var(--surface-high)] px-3 py-3">
                  <p className="muted-kicker">Start</p>
                  <p className="mt-2 text-xl font-bold text-[color:var(--text)]">{data[0]?.value ?? aPercent}%</p>
                </div>
                <div className="bg-[color:var(--surface-high)] px-3 py-3">
                  <p className="muted-kicker">Now</p>
                  <p className="mt-2 text-xl font-bold text-[color:var(--text)]">{aPercent}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
