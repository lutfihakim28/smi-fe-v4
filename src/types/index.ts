import { CalendarDate } from "@internationalized/date";

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export type Payroll = {
  instructorId: string;
  instructor?: string;
  employmentStatus?: EmploymentStatus;
  employmentLabel?: string;
  grade?: number;
  eligibleCount: number;
}

export type ExportPayrollOptions = {
  fileName?: string
  rates?: Record<string, number>
}

export type AttendanceStatus = 'scheduled' | 'attended' | 'absent';
export type ScheduleStatus = 'Submitted' | 'Draft' | 'Cancelled';
export type ReportClassification = 'excluded' | 'eligible' | 'needs-attention';
export type EmploymentStatus = 'full-time' | 'part-time' | 'freelance';

type AllOr<T> = T | 'all';

export type DateRange = {
  start: CalendarDate;
  end: CalendarDate;
}

export interface TeachingReportFilters {
  range: DateRange;
  instructorSearch: string;
  grade: AllOr<number>;
  employmentStatus: AllOr<EmploymentStatus>;
  scheduleStatus: AllOr<ScheduleStatus>;
  attendanceStatus: AllOr<AttendanceStatus>;
  classification: AllOr<ReportClassification>;
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  color: 'primary' | 'error' | 'warning' | 'success'
  formatter?: (value: number) => string
}

export type DashboardBreakdown = {
  key: string;
  label: string;
  reports: number;
  eligible: number;
  excluded: number;
}

export interface Range {
  start: Date
  end: Date
}
