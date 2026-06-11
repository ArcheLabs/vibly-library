import { RichMarkdown } from "./RichMarkdown";

interface DocumentRendererProps {
  markdown: string;
}

export function DocumentRenderer({ markdown }: DocumentRendererProps) {
  return <RichMarkdown>{markdown}</RichMarkdown>;
}
