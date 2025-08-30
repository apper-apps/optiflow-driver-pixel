import operationData from "@/services/mockData/operations.json";

class OperationService {
  constructor() {
    this.data = [...operationData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const operation = this.data.find(o => o.Id === id);
    if (!operation) {
      throw new Error("Opération introuvable");
    }
    return { ...operation };
  }

  async create(operationData) {
    await this.delay();
    const newOperation = {
      ...operationData,
      Id: Math.max(...this.data.map(o => o.Id)) + 1
    };
    this.data.push(newOperation);
    return { ...newOperation };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Opération introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Opération introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 350));
  }
}

export const operationService = new OperationService();