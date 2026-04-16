import type { ReactNode } from "react";

interface TerminalBlockProps {
  prompt?: string;
  command?: string;
  children: ReactNode;
  label?: string;
}

export default function TerminalBlock({
  prompt = "$",
  command,
  children,
  label,
}: TerminalBlockProps) {
  return (
    <figure className="my-6">
      {label && (
        <figcaption className="mono text-xs text-muted mb-1">
          {label}
        </figcaption>
      )}
      <pre className="cc-card p-4 overflow-x-auto text-sm leading-relaxed">
        {command && (
          <div>
            <span className="text-success mono">{prompt}</span>{" "}
            <span className="text-fg">{command}</span>
          </div>
        )}
        <div className="text-fg-subtle whitespace-pre">{children}</div>
      </pre>
    </figure>
  );
}
