"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { ArtifactListParams, ArtifactType, ArtifactStatus, SortBy } from "@/lib/api/types";

interface DocumentFiltersProps {
  params: ArtifactListParams;
  onChange: (updates: Partial<ArtifactListParams>) => void;
}

const SORT_OPTIONS: { value: SortBy; labelKey: string }[] = [
  { value: "comprehensive", labelKey: "comprehensive" },
  { value: "latest", labelKey: "latest" },
  { value: "hot", labelKey: "hot" },
  { value: "reviewed", labelKey: "reviewed" },
  { value: "order", labelKey: "order" },
];

const TYPE_OPTIONS: { value: ArtifactType | ""; labelKey: string }[] = [
  { value: "", labelKey: "all" },
  { value: "report", labelKey: "report" },
  { value: "spec", labelKey: "spec" },
  { value: "note", labelKey: "note" },
  { value: "template", labelKey: "template" },
];

const STATUS_OPTIONS: { value: ArtifactStatus | ""; labelKey: string }[] = [
  { value: "", labelKey: "all" },
  { value: "published", labelKey: "published" },
  { value: "verified", labelKey: "verified" },
  { value: "updated", labelKey: "updated" },
];

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="relative flex items-center gap-1">
      <label className="text-xs text-[var(--text-subtle)] shrink-0">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none text-sm bg-[var(--surface-muted)] border border-[var(--border)] rounded-md pl-2 pr-6 py-1 text-[var(--text)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-subtle)]" />
      </div>
    </div>
  );
}

export function DocumentFilters({ params, onChange }: DocumentFiltersProps) {
  const t = useTranslations("filters");

  return (
    <div className="flex flex-wrap items-center gap-4 py-3">
      <Select<SortBy>
        label={t("sortBy")}
        value={params.sort ?? "comprehensive"}
        options={SORT_OPTIONS.map((o) => ({ value: o.value, label: t(`sortOptions.${o.labelKey}`) }))}
        onChange={(sort) => onChange({ sort })}
      />
      <Select<ArtifactType | "">
        label={t("type")}
        value={params.type ?? ""}
        options={TYPE_OPTIONS.map((o) => ({ value: o.value, label: t(`typeOptions.${o.labelKey}`) }))}
        onChange={(type) => onChange({ type: type || undefined })}
      />
      <Select<ArtifactStatus | "">
        label={t("status")}
        value={params.status ?? ""}
        options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: t(`statusOptions.${o.labelKey}`) }))}
        onChange={(status) => onChange({ status: status || undefined })}
      />
    </div>
  );
}
