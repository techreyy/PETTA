type CategorizedProject = { slug: string; categorySlug: string };

export function relatedProjects<T extends CategorizedProject>(projects: T[], current: CategorizedProject): T[] {
  const others = projects.filter(project => project.slug !== current.slug);
  return [
    ...others.filter(project => project.categorySlug === current.categorySlug),
    ...others.filter(project => project.categorySlug !== current.categorySlug),
  ].slice(0, 2);
}
