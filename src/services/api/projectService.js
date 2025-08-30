import projectData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.data = [...projectData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const project = this.data.find(p => p.Id === id);
    if (!project) {
      throw new Error("Projet introuvable");
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
    const newProject = {
      ...projectData,
      Id: Math.max(...this.data.map(p => p.Id)) + 1
    };
    this.data.push(newProject);
    return { ...newProject };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Projet introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Projet introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const projectService = new ProjectService();