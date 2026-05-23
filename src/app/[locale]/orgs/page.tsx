import { getOrganizations } from "@/lib/api/orgs";
import { OrganizationCard } from "@/components/orgs/OrganizationCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Organizations — Vibly Library" };
export const revalidate = 60;

export default async function OrgsPage() {
  const orgs = await getOrganizations({ limit: 100 }).catch(() => []);

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--text)] mb-6">Organizations</h1>
      {orgs.length === 0 ? (
        <p className="text-[var(--text-subtle)] text-center py-12">No organizations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}
