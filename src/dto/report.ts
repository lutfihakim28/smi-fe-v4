import { ReportClassification } from "../types";
import { Schedule } from "./schedule";

export class Report {
  id!: string;
  scheduleId!: string;
  submittedAt!: string;
  topic!: string;
  summary!: string;
  schedule?: Schedule;

  constructor(data: Report) {
    this.id = data.id;
    this.scheduleId = data.scheduleId;
    this.submittedAt = data.submittedAt;
    this.topic = data.topic;
    this.summary = data.summary;
    if (data.schedule) this.schedule = new Schedule(data.schedule);
  }

  get classification(): ReportClassification {
    const attendance = this.schedule?.attendance;

    if (this.schedule?.status === "Cancelled" || attendance?.status === "absent") {
      return "excluded";
    }

    if (this.schedule?.status === "Submitted" && attendance?.status === "attended") {
      return "eligible";
    }

    return "needs-attention";
  }

  get classificationLabel(): string {
    if (this.classification === 'eligible') return 'Eligible';
    if (this.classification === 'excluded') return 'Excluded';
    return 'Needs Attention'
  }
}
