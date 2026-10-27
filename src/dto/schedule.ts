import { ScheduleStatus } from "../types";
import { Attendance } from "./attendance";
import { Instructor } from "./instructor";
import { Student } from "./student";

export class Schedule {
  id!: string;
  instructorId!: string;
  studentId!: string;
  date!: string;
  startTime!: string;
  endTime!: string;
  grade!: number;
  subject!: string;
  status!: ScheduleStatus;
  createdAt!: string;
  note?: string;
  instructor?: Instructor;
  student?: Student;
  attendance?: Attendance;

  constructor(data: Schedule) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.date = data.date;
    this.endTime = data.endTime;
    this.grade = data.grade;
    this.instructorId = data.instructorId;
    this.studentId = data.studentId;
    this.startTime = data.startTime;
    this.status = data.status;
    this.subject = data.subject;
    this.note = data.note;
    if (data.instructor) this.instructor = new Instructor(data.instructor);
    if (data.student) this.student = new Student(data.student);
    if (data.attendance) this.attendance = new Attendance(data.attendance);
  }
}
