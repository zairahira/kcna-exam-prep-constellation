"use client";

import { useState, type ReactNode } from "react";

interface Choice {
  id: string;
  label: ReactNode;
}

interface CheckpointProps {
  id: string;
  question: ReactNode;
  choices: Choice[];
  correctId: string;
  feedback: ReactNode;
}

export default function Checkpoint({
  id,
  question,
  choices,
  correctId,
  feedback,
}: CheckpointProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && picked === correctId;

  return (
    <section className="cc-card p-5 my-8" aria-labelledby={`quiz-${id}-q`}>
      <div id={`quiz-${id}-q`} className="font-bold mb-4">
        {question}
      </div>

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
                name={`quiz-${id}`}
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
          Submit answer
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
          <div className="text-fg-secondary">{feedback}</div>
        </div>
      )}
    </section>
  );
}
