import client from "./client";

export const authApi = {
  login: (email, password) => client.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => client.get("/auth/me").then((r) => r.data),
  changePassword: (currentPassword, newPassword) =>
    client.post("/auth/change-password", { currentPassword, newPassword }).then((r) => r.data),
};

export const projectsApi = {
  // public
  publicList: (params) => client.get("/projects/public", { params }).then((r) => r.data),
  publicGet: (slug) => client.get(`/projects/public/${slug}`).then((r) => r.data),

  // admin
  list: (params) => client.get("/projects", { params }).then((r) => r.data),
  get: (id) => client.get(`/projects/${id}`).then((r) => r.data),
  create: (data) => client.post("/projects", data).then((r) => r.data),
  update: (id, data) => client.put(`/projects/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/projects/${id}`).then((r) => r.data),

  uploadFeatured: (id, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return client
      .post(`/projects/${id}/featured-image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  uploadGallery: (id, files) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    return client
      .post(`/projects/${id}/gallery`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  removeGallery: (id, publicId) =>
    client.delete(`/projects/${id}/gallery/${encodeURIComponent(publicId)}`).then((r) => r.data),
};

export const galleryApi = {
  publicList: (params) => client.get("/gallery/public", { params }).then((r) => r.data),
  list: () => client.get("/gallery").then((r) => r.data),
  uploadImage: (file, meta) => {
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(meta || {}).forEach(([k, v]) => fd.append(k, v));
    return client
      .post("/gallery/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  uploadVideo: (file, meta) => {
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(meta || {}).forEach(([k, v]) => fd.append(k, v));
    return client
      .post("/gallery/upload-video", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  createYoutube: (data) => client.post("/gallery/youtube", data).then((r) => r.data),
  update: (id, data) => client.put(`/gallery/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/gallery/${id}`).then((r) => r.data),
};

export const enquiriesApi = {
  submit: (data) => client.post("/enquiries", data).then((r) => r.data),
  list: (params) => client.get("/enquiries", { params }).then((r) => r.data),
  get: (id) => client.get(`/enquiries/${id}`).then((r) => r.data),
  update: (id, data) => client.put(`/enquiries/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/enquiries/${id}`).then((r) => r.data),
};

export const statsApi = {
  dashboard: () => client.get("/stats/dashboard").then((r) => r.data),
};
