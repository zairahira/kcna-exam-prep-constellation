import type { ReactNode } from "react";

interface LessonFrameProps {
  lessonTitle: string;
  domain: string;
  mustLearn: string[];
  children: ReactNode;
}

export default function LessonFrame({
  lessonTitle,
  domain,
  mustLearn,
  children,
}: LessonFrameProps) {
  return (
    <article className="max-w-3xl mx-auto px-8 py-10">
      <header className="cc-card p-5 mb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-2xl font-bold tracking-tight">{lessonTitle}</h1>
          <span className="mono text-xs text-muted">{domain}</span>
        </div>

        <div>
          <p className="mono text-xs text-muted mb-2">
            by the end of this lesson you can explain
          </p>
          <ul className="list-disc ml-5 text-fg-secondary text-sm space-y-1">
            {mustLearn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </header>

      <div className="prose-lesson">{children}</div>
    </article>
  );
}
