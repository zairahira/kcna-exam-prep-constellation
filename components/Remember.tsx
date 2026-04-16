import type { ReactNode } from "react";

/**
 * The "what you need to remember" block that closes every lesson.
 *
 * This is the anti-dilution guardrail: strip every character, every bit of
 * dialog, every story beat - this bullet list still stands alone as a
 * complete KCNA revision sheet for the lesson. Aggregated across lessons,
 * these form the final exam cheat sheet view.
 *
 * Always renders in BOTH story and straight view.
 */

interface RememberProps {
  points: ReactNode[];
}

export default function Remember({ points }: RememberProps) {
  return (
    <section className="cc-card p-5 my-8 border-l-4 border-l-warning">
      <h3 className="mono text-sm text-warning uppercase tracking-wide mb-3">
        What you need to remember
      </h3>
      <ul className="list-disc ml-5 space-y-2 text-fg-secondary">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  );
}
