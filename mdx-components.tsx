import type { MDXComponents } from "mdx/types";

/**
 * Default MDX component overrides. Lessons can also import their own
 * components explicitly (as they do today) - this file just lets us style
 * default elements (h2, p, code, etc.) consistently across MDX.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="text-2xl font-bold mt-8 mb-3 tracking-tight"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="text-xl font-bold mt-6 mb-2" {...props} />
    ),
    p: (props) => <p className="my-4 text-fg-secondary" {...props} />,
    ul: (props) => (
      <ul className="list-disc ml-6 my-4 text-fg-secondary space-y-1" {...props} />
    ),
    ol: (props) => (
      <ol
        className="list-decimal ml-6 my-4 text-fg-secondary space-y-1"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="mono bg-surface px-1.5 py-0.5 rounded text-sm"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-bold text-fg" {...props} />
    ),
    a: (props) => (
      <a
        className="text-highlight underline hover:opacity-80"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table
          className="w-full text-sm border-collapse cc-card overflow-hidden"
          {...props}
        />
      </div>
    ),
    thead: (props) => (
      <thead className="bg-bg-2 border-b border-surface-border" {...props} />
    ),
    tbody: (props) => <tbody {...props} />,
    tr: (props) => (
      <tr
        className="border-b border-surface-border last:border-b-0"
        {...props}
      />
    ),
    th: (props) => (
      <th
        className="text-left px-4 py-2 font-bold text-fg mono text-xs uppercase tracking-wide"
        {...props}
      />
    ),
    td: (props) => (
      <td className="px-4 py-2 text-fg-secondary align-top" {...props} />
    ),
    hr: (props) => (
      <hr className="my-8 border-surface-border" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-accent pl-4 my-6 italic text-fg-subtle"
        {...props}
      />
    ),
    ...components,
  };
}
