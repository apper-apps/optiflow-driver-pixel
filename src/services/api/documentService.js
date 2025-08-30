import documentData from "@/services/mockData/documents.json";

class DocumentService {
  constructor() {
    this.data = [...documentData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const document = this.data.find(d => d.Id === id);
    if (!document) {
      throw new Error("Document introuvable");
    }
    return { ...document };
  }

  async create(documentData) {
    await this.delay();
    const newDocument = {
      ...documentData,
      Id: Math.max(...this.data.map(d => d.Id)) + 1
    };
    this.data.push(newDocument);
    return { ...newDocument };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Document introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Document introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const documentService = new DocumentService();