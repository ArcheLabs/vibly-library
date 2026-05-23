import { getProjects } from "@/lib/api/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects — Vibly Library" };
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects({ limit: 100 }).catch(() => []);

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--text)] mb-6">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-[var(--text-subtle)] text-center py-12">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
