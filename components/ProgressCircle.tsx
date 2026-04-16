export default function ProgressCircle({
  completed,
  size = "sm",
}: {
  completed: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full border-2 ${dim} ${
        completed
          ? "bg-success border-success"
          : "border-surface-border bg-transparent"
      }`}
      role="img"
      aria-label={completed ? "Completed" : "Not completed"}
    >
      {completed && (
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-bg" fill="none">
          <path
            d="M2.5 6l2.5 2.5 4.5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
