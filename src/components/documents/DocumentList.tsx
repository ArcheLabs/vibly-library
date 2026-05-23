import type { Artifact } from "@/lib/api/types";
import { DocumentCard } from "./DocumentCard";
import { useTranslations } from "next-intl";

interface DocumentListProps {
  artifacts: Artifact[];
  loading?: boolean;
}

export function DocumentList({ artifacts, loading }: DocumentListProps) {
  const t = useTranslations("empty");

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-[var(--surface-muted)] rounded w-3/4 mb-2" />
            <div className="h-3 bg-[var(--surface-muted)] rounded w-full mb-1" />
            <div className="h-3 bg-[var(--surface-muted)] rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-subtle)]">
        {t("noDocuments")}
      </div>
    );
  }

  return (
    <div>
      {artifacts.map((a) => (
        <DocumentCard key={a.id} artifact={a} />
      ))}
    </div>
  );
}
