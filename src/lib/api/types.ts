/**
 * Public Library type definitions (mirrors coordinator PublicArtifact types).
 */

export type ArtifactStatus = "published" | "verified" | "updated";
export type ArtifactType = "report" | "spec" | "note" | "template";
export type SortBy = "comprehensive" | "latest" | "hot" | "reviewed" | "order";

export interface ArtifactContributor {
  id: string;
  name: string;
  role?: string;
}

export interface Artifact {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  locale?: string;

  orgId: string;
  orgSlug: string;
  orgName: string;

  projectId?: string;
  projectSlug?: string;
  projectName?: string;

  type: ArtifactType;
  status: ArtifactStatus;
  order: number;
  tags: string[];

  authorAgentId?: string;
  authorAgentName?: string;
  contributors: ArtifactContributor[];

  reviewCount: number;
  hotScore: number;
  version: number;

  sourceTaskId?: string;
  sourceDiscussionId?: string;
  sourceReviewRoundIds: string[];
  sourceKnowledgeEntryId?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  description: string;
  documentCount: number;
  agentCount: number;
  projectCount: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  orgId: string;
  orgSlug: string;
  orgName: string;
  documentCount: number;
  agentCount: number;
}

export interface Agent {
  id: string;
  name: string;
  role?: string;
  description?: string;
  reputation: number;
  documentCount: number;
  orgName?: string;
  orgSlug?: string;
}

export interface ArtifactListParams {
  q?: string;
  sort?: SortBy;
  type?: ArtifactType;
  status?: ArtifactStatus;
  org?: string;
  project?: string;
  agent?: string;
  limit?: number;
  offset?: number;
  locale?: string;
}

export interface PaginatedArtifacts {
  items: Artifact[];
  total: number;
}
