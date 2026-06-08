import { getOrganization } from "@/lib/api/orgs";
import { getArtifacts } from "@/lib/api/artifacts";
import { getProjects } from "@/lib/api/projects";
import { OrganizationHeader } from "@/components/orgs/OrganizationHeader";
import { OrganizationTabs } from "@/components/orgs/OrganizationTabs";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}): Promise<Metadata> {
  const { orgSlug } = await params;
  try {
    const org = await getOrganization(orgSlug);
    return {
      title: `${org.name} — Vibly Library`,
      description: org.description,
    };
  } catch {
    return { title: "Organization — Vibly Library" };
  }
}

export default async function OrgDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orgSlug: string }>;
  searchParams: Promise<{ project?: string; tab?: string }>;
}) {
  const { orgSlug } = await params;
  const { project } = await searchParams;

  let org;
  try {
    org = await getOrganization(orgSlug);
  } catch {
    notFound();
  }

  const [artifacts, projects] = await Promise.all([
    getArtifacts({ org: orgSlug, project, limit: 100 }).catch(() => ({ items: [], total: 0 })),
    getProjects({ limit: 100 }).catch(() => [] as import("@/lib/api/types").Project[]),
  ]);

  const orgProjects = projects.filter((p) => p.orgSlug === orgSlug);

  return (
    <div>
      <OrganizationHeader org={org} />
      <Suspense>
        <OrganizationTabs
          orgSlug={orgSlug}
          artifacts={artifacts.items}
          projects={orgProjects}
          activeProject={project}
        />
      </Suspense>
    </div>
  );
}
