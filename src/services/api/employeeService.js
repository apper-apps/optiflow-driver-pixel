import employeeData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.data = [...employeeData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const employee = this.data.find(e => e.Id === id);
    if (!employee) {
      throw new Error("Employé introuvable");
    }
    return { ...employee };
  }

  async create(employeeData) {
    await this.delay();
    const newEmployee = {
      ...employeeData,
      Id: Math.max(...this.data.map(e => e.Id)) + 1
    };
    this.data.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.data.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Employé introuvable");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error("Employé introuvable");
    }
    this.data.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const employeeService = new EmployeeService();