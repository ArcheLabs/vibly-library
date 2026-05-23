import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface DocumentRendererProps {
  markdown: string;
}

export function DocumentRenderer({ markdown }: DocumentRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--text)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
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
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
