export class Student {
  id!: string;
  name!: string;
  guardianName!: string;
  contact!: string;

  constructor(data: Student) {
    this.id = data.id;
    this.name = data.name;
    this.guardianName = data.guardianName;
    this.contact = data.contact;
  }
}
