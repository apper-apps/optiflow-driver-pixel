import secretariatData from "@/services/mockData/secretariat.json";

class SecretariatService {
  constructor() {
    this.data = { ...secretariatData };
  }

  async getAll() {
    await this.delay();
    return { ...this.data };
  }

  async addMail(mailData) {
    await this.delay();
    const newMail = {
      ...mailData,
      Id: Math.max(...this.data.correspondence.map(c => c.Id)) + 1
    };
    this.data.correspondence.push(newMail);
    return { ...newMail };
  }

  async addMeeting(meetingData) {
    await this.delay();
    const newMeeting = {
      ...meetingData,
      Id: Math.max(...this.data.meetings.map(m => m.Id)) + 1
    };
    this.data.meetings.push(newMeeting);
    return { ...newMeeting };
  }

  async addNote(noteData) {
    await this.delay();
    const newNote = {
      ...noteData,
      Id: Math.max(...this.data.notes.map(n => n.Id)) + 1
    };
    this.data.notes.push(newNote);
    return { ...newNote };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const secretariatService = new SecretariatService();