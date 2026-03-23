import { ArrowUpRight, Flame, Scale, Sparkles, Swords, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "What reputation means?",
    text: "Reputation is your signal as a predictor. It reflects how consistently you judge arguments, outcomes, and community sentiment well.",
    icon: TrendingUp
  },
  {
    title: "How predictions affect reputation?",
    text: "When your prediction lines up with the winning side, you gain reputation. Stronger conviction can produce bigger swings, so confident calls matter more.",
    icon: ArrowUpRight
  },
  {
    title: "Why you can gain or lose reputation?",
    text: "The system is skill-based, so correct calls move you up and wrong calls can move you down. That keeps reputation meaningful instead of automatic.",
    icon: Scale
  },
  {
    title: "How titles work?",
    text: "Titles mark your current level as a predictor. As your reputation grows, you move from early titles like Rookie into stronger tiers like Expert and Oracle.",
    icon: Swords
  },
  {
    title: "How streaks help?",
    text: "Voting consistently helps you build momentum. Streaks reinforce regular participation and make it easier to stay engaged with the system.",
    icon: Flame
  }
];

export default function ReputationPage() {
  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 overflow-hidden px-6 py-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[color:var(--primary)]" />
          <p className="kicker">Progression</p>
        </div>
        <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-5xl">
          Reputation Explained
        </h1>
        <p className="text-base leading-7 text-[color:var(--text)]/90">
          Reputation is the most competitive part of Banter. It tracks how sharp your judgment is, how consistently you call outcomes well, and how far you have climbed as a predictor.
        </p>
      </section>

      <section className="grid gap-4">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <div key={section.title} className="section-panel grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-5 py-5">
              <div>
                <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-[color:var(--primary)] sm:text-xl">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text)] sm:text-base">
                  {section.text}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[color:var(--surface-high)] neon-shadow-green sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 text-[color:var(--secondary)] sm:h-6 sm:w-6" />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
