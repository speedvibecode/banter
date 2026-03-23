export const dynamic = "force-dynamic";

const sections = [
  {
    title: "What reputation means",
    text: "Reputation is your signal as a predictor. It reflects how consistently you judge arguments, outcomes, and community sentiment well."
  },
  {
    title: "How predictions affect reputation",
    text: "When your prediction lines up with the winning side, you gain reputation. Stronger conviction can produce bigger swings, so confident calls matter more."
  },
  {
    title: "Why you can gain or lose reputation",
    text: "The system is skill-based, so correct calls move you up and wrong calls can move you down. That keeps reputation meaningful instead of automatic."
  },
  {
    title: "How titles work",
    text: "Titles mark your current level as a predictor. As your reputation grows, you move from early titles like Rookie into stronger tiers like Expert and Oracle."
  },
  {
    title: "How streaks help",
    text: "Voting consistently helps you build momentum. Streaks reinforce regular participation and make it easier to stay engaged with the system."
  }
];

export default function ReputationPage() {
  return (
    <main className="space-y-6">
      <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
        <p className="kicker">Progression</p>
        <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-5xl">
          Reputation Explained
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Reputation is designed to reward strong judgment, consistent participation, and better predictions over time.
        </p>
      </section>

      <section className="grid gap-4">
        {sections.map((section) => (
          <div key={section.title} className="section-panel px-5 py-5">
            <h2 className="panel-title">{section.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              {section.text}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
