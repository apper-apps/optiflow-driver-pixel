import cashData from "@/services/mockData/cashEntries.json";

class CashEntryService {
  constructor() {
    this.data = [...cashData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const entry = this.data.find(e => e.Id === id);
    if (!entry) {
      throw new Error("Écriture introuvable");
    }
    return { ...entry };
  }

  async create(entryData) {
    await this.delay();
    const newEntry = {
      ...entryData,
      Id: Math.max(...this.data.map(e => e.Id)) + 1
    };
    this.data.push(newEntry);
    return { ...newEntry };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Écriture introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Écriture introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const cashEntryService = new CashEntryService();