import { EmploymentStatus } from "../types";

export class Instructor {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  employmentStatus!: EmploymentStatus;
  specialization!: string;
  joinedAt!: string;

  constructor(data: Instructor) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.employmentStatus = data.employmentStatus;
    this.specialization = data.specialization;
    this.joinedAt = data.joinedAt;
  }

  get statusLabel(): string {
    if (this.employmentStatus === 'freelance') return 'Freelance';
    if (this.employmentStatus === 'part-time') return 'Part Time';
    return 'Full Time'
  }
}
