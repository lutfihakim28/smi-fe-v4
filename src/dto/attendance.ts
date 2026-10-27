import { AttendanceStatus } from "../types";
import { Instructor } from "./instructor";

export class Attendance {
  id!: string;
  scheduleId!: string;
  status!: AttendanceStatus;
  markedAt: string | null;
  markedBy!: string;
  note?: string;
  instructor?: Instructor;

  constructor(data: Attendance) {
    this.id = data.id;
    this.scheduleId = data.scheduleId;
    this.status = data.status;
    this.markedAt = data.markedAt;
    this.markedBy = data.markedBy;
    this.note = data.note;
    if (data.instructor) this.instructor = new Instructor(data.instructor);
  }
}
