import { navigationRepository, type NavigationNodeWriteData } from "../repositories/navigation.repository";

export const navigationService = {
  async getRoot() {
    const nodes = await navigationRepository.findRoot();
    return nodes;
  },
  
  async getChildren(slug: string) {
  return navigationRepository.findChildrenBySlug(slug);
  },

  async findAll() {
    return navigationRepository.findAll();
  },

  async create(data: NavigationNodeWriteData) {
    return navigationRepository.create(data);
  },

  async update(id: number, data: NavigationNodeWriteData) {
    return navigationRepository.update(id, data);
  },

  async remove(id: number) {
    return navigationRepository.remove(id);
  },
};
