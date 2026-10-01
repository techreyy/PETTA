export const PROJECT_STATUSES = ["built", "ongoing", "proposed", "concept"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function filterProjects<T extends { category: string; categorySlug: string; status: string }>(
  projects: T[], category: string, status: ProjectStatus | "all",
): T[] {
  return projects.filter((project) =>
    (category === "all" || project.categorySlug === category ||
      project.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === category) &&
    (status === "all" || getProjectStatus(project.status) === status),
  );
}

/** Exact labels only: mixed/phased legacy values must never imply completion. */
export function getProjectStatus(status?: string | null): ProjectStatus | null {
  switch (status?.trim().toLowerCase().replace(/\s+/g, " ")) {
    case "built":
    case "completed":
      return "built";
    case "ongoing":
    case "under construction":
    case "in progress":
      return "ongoing";
    case "proposed":
      return "proposed";
    case "concept":
    case "design development":
      return "concept";
    default:
      return null;
  }
}
