"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";

interface RichMarkdownProps {
  children: string;
  className?: string;
}

/**
 * Normalize LaTeX delimiters before rendering:
 *   \( ... \) → $...$
 *   \[ ... \] → $$...$$
 *
 * This ensures remark-math / rehype-katex can parse all common math
 * notation, not just the $ … $$ flavours.
 */
function normalizeMath(source: string): string {
  return source
    .replace(/\\\[([\s\S]*?)\\\]/g, "$$$$$1$$$$")
    .replace(/\\\(([\s\S]*?)\\\)/g, "$$$1$$");
}

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--brand-accent)] hover:underline"
      {...props}
    >
      {children}
    </a>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => (
    <code
      className={`${className ?? ""} bg-[var(--surface-muted)] rounded px-1 py-0.5 text-sm font-mono`}
      {...props}
    >
      {children}
    </code>
  ),
  // Inline math (remark-math wraps $…$ in <span class="math-inline">)
  span: ({ className, children, ...props }) => {
    if (className?.includes("math-inline")) {
      return <span className="math-inline" {...props}>{children}</span>;
    }
    return <span className={className} {...props}>{children}</span>;
  },
};

export function RichMarkdown({ children, className = "" }: RichMarkdownProps) {
  const normalized = normalizeMath(children);

  return (
    <div
      className={`rich-markdown prose prose-neutral dark:prose-invert max-w-none text-[var(--text)] ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={components}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
