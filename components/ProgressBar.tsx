"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-end gap-2 mb-2">
        <span className="text-[10px] md:text-sm font-bold mono uppercase tracking-wider text-muted truncate">
          {label || "Course Progress"}
        </span>
        <span className="text-[10px] md:text-sm mono text-fg-secondary whitespace-nowrap">
          {current}/{total} <span className="hidden sm:inline">steps</span> <span className="text-muted">({percentage}%)</span>
        </span>
      </div>
      <div className="w-full h-3 bg-surface border border-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-success transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
