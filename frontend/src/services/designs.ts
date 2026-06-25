import { NailDesign } from "../data/designs";
import { apiService, CollectionData } from "./api";

export interface GalleryCategories {
  shapes: string[];
  types: string[];
}

export const dynamicDesignService = {
  // 1. Manage Designs via Backend Database
  async getDesigns(): Promise<NailDesign[]> {
    return apiService.getDesigns();
  },

  async addDesign(design: Omit<NailDesign, "id">): Promise<NailDesign> {
    return apiService.createDesign(design);
  },

  async updateDesign(id: string, updatedData: Partial<NailDesign>): Promise<NailDesign | null> {
    return apiService.updateDesign(id, updatedData);
  },

  async deleteDesign(id: string): Promise<boolean> {
    return apiService.deleteDesign(id);
  },

  // 2. Manage Static Categories (for Try-On Filters)
  getCategories(): GalleryCategories {
    return {
      shapes: ["Almond", "Oval", "Coffin", "Square", "Stiletto"],
      types: ["Gel", "Acrylic", "French", "Luxury", "Minimalist", "Chrome"],
    };
  },

  // 3. Manage Dynamic Collections (for Homepage and Gallery Categories)
  async getCollections(): Promise<CollectionData[]> {
    return apiService.getCollections();
  },

  async addCollection(name: string, image: string): Promise<CollectionData> {
    return apiService.createCollection({ name, image });
  },

  async deleteCollection(idOrName: string): Promise<boolean> {
    return apiService.deleteCollection(idOrName);
  },
};
