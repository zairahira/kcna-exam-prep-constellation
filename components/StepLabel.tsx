type StepType = "lesson" | "debug" | "review" | "quiz";

const LABEL_STYLES: Record<StepType, string> = {
  lesson: "bg-success/20 text-success border-success/30",
  debug: "bg-warning/20 text-warning border-warning/30",
  review: "bg-fg-subtle/20 text-fg-subtle border-fg-subtle/30",
  quiz: "bg-accent/20 text-accent border-accent/30",
};

const LABEL_TEXT: Record<StepType, string> = {
  lesson: "Lesson",
  debug: "Debug",
  review: "Review",
  quiz: "Quiz",
};

export default function StepLabel({ type }: { type: StepType }) {
  return (
    <span
      className={`mono text-[11px] px-2 py-0.5 rounded border ${LABEL_STYLES[type]}`}
    >
      {LABEL_TEXT[type]}
    </span>
  );
}
