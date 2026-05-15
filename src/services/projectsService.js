import { projectsApi } from "../admin/api/endpoints";
import { adaptProject, adaptProjects } from "../utils/projectAdapter";

export const projectsService = {
  list: (params) =>
    projectsApi
      .publicList(params)
      .then(({ items = [], total = 0 }) => ({ items: adaptProjects(items), total })),

  getBySlug: (slug) =>
    projectsApi.publicGet(slug).then((data) => {
      // Backend may return the doc directly or wrapped in { project }
      const raw = data?.project ?? data;
      return adaptProject(raw);
    }),

  related: (currentSlug, limit = 3) =>
    projectsApi
      .publicList({ limit: limit + 1 })
      .then(({ items = [] }) =>
        adaptProjects(items)
          .filter((p) => p.slug !== currentSlug)
          .slice(0, limit)
      ),
};
