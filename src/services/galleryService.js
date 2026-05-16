import { galleryApi } from "../admin/api/endpoints";
import { adaptGalleryItems } from "../utils/galleryAdapter";

export const galleryService = {
  list: (params) =>
    galleryApi
      .publicList(params)
      .then(({ items = [] }) => ({ items: adaptGalleryItems(items) })),
};
