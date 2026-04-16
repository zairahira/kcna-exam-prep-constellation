"use client";

import { useState, type ReactNode } from "react";

/**
 * Debug-this puzzle - the "challenging" layer of the curriculum.
 *
 * Structure: a prompt, a static artifact (broken YAML, kubectl output, etc.),
 * a set of multiple-choice answers, and a reveal that explains the correct
 * answer. Every puzzle carries syllabus IDs so it can be traced back to
 * specific KCNA concepts (guardrail #6 in the plan).
 *
 * Renders in BOTH story and straight view - reasoning reps are load-bearing
 * for the exam, not narrative dressing.
 */

interface Choice {
  id: string;
  label: ReactNode;
}

interface DebugPuzzleProps {
  id: string;
  syllabusIds: string[];
  prompt: ReactNode;
  artifact: ReactNode;
  choices: Choice[];
  correctId: string;
  explanation: ReactNode;
}

export default function DebugPuzzle({
  id,
  syllabusIds,
  prompt,
  artifact,
  choices,
  correctId,
  explanation,
}: DebugPuzzleProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && picked === correctId;
  const isWrong = submitted && picked !== null && picked !== correctId;

  return (
    <section
      id={`debug-${id}`}
      className="cc-card p-5 my-8"
      aria-labelledby={`debug-${id}-title`}
    >
      <header className="flex items-baseline justify-between mb-3">
        <h3
          id={`debug-${id}-title`}
          className="mono text-sm text-warning uppercase tracking-wide"
        >
          Debug this
        </h3>
        <div className="flex gap-1">
          {syllabusIds.map((sid) => (
            <span
              key={sid}
              className="mono text-[10px] px-1.5 py-0.5 rounded border border-surface-border text-muted"
            >
              {sid}
            </span>
          ))}
        </div>
      </header>

      <div className="mb-4 text-fg-secondary">{prompt}</div>

      <div className="mb-5">{artifact}</div>

      <fieldset className="space-y-2 mb-4" disabled={submitted}>
        <legend className="sr-only">Answer choices</legend>
        {choices.map((c) => {
          const isThisCorrect = submitted && c.id === correctId;
          const isThisWrongPick =
            submitted && c.id === picked && c.id !== correctId;
          return (
            <label
              key={c.id}
              className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition ${
                isThisCorrect
                  ? "border-success text-success"
                  : isThisWrongPick
                    ? "border-danger text-danger"
                    : picked === c.id
                      ? "border-highlight"
                      : "border-surface-border hover:border-highlight"
              }`}
            >
              <input
                type="radio"
                name={`debug-${id}`}
                value={c.id}
                checked={picked === c.id}
                onChange={() => setPicked(c.id)}
                className="mt-1 accent-highlight"
              />
              <span className="flex-1">{c.label}</span>
            </label>
          );
        })}
      </fieldset>

      {!submitted ? (
        <button
          type="button"
          onClick={() => picked && setSubmitted(true)}
          disabled={!picked}
          className="bg-warning text-bg font-bold px-4 py-2 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      ) : (
        <div
          className={`p-4 rounded border ${
            isCorrect
              ? "border-success text-success"
              : "border-danger text-danger"
          }`}
          role="status"
        >
          <p className="font-bold mb-1">
            {isCorrect ? "Correct." : "Not quite."}
          </p>
          <div className="text-fg-secondary">{explanation}</div>
          {isWrong && (
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setPicked(null);
              }}
              className="mono text-xs text-highlight mt-3 underline"
            >
              try again
            </button>
          )}
        </div>
      )}
    </section>
  );
}
