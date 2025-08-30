import inventoryData from "@/services/mockData/inventory.json";

class InventoryService {
  constructor() {
    this.data = [...inventoryData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const item = this.data.find(i => i.Id === id);
    if (!item) {
      throw new Error("Élément introuvable");
    }
    return { ...item };
  }

  async create(itemData) {
    await this.delay();
    const newItem = {
      ...itemData,
      Id: Math.max(...this.data.map(i => i.Id)) + 1
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(i => i.Id === id);
    if (index === -1) {
      throw new Error("Élément introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(i => i.Id === id);
    if (index === -1) {
      throw new Error("Élément introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }
}

export const inventoryService = new InventoryService();