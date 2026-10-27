<script setup lang="ts">
import { computed, h, resolveComponent } from 'vue';
import { getLocalTimeZone } from '@internationalized/date';
import { useTeachingReport } from '../composables/useTeachingReport';
import type { AttendanceStatus, EmploymentStatus, Range, ReportClassification, ScheduleStatus } from '../types';
import { toCalendarDate } from '../utils';
import { TableColumn } from '@nuxt/ui';
import { Report } from '../dto/report';
import { useDateFormat } from '@vueuse/core';

const UBadge = resolveComponent('UBadge')

const { reports, loading, pagination, filters, goToPage, resetFilters } = useTeachingReport();

const range = computed<Range>({
  get: () => ({
    start: filters.range.start.toDate(getLocalTimeZone()),
    end: filters.range.end.toDate(getLocalTimeZone()),
  }),
  set: (value) => {
    filters.range = {
      start: toCalendarDate(value.start),
      end: toCalendarDate(value.end),
    }
  },
})

const gradeOptions = [
  { label: 'All', value: 'all' },
  ...[1, 2, 3, 4].map((grade) => ({ label: `Grade ${grade}`, value: grade })),
]

const employmentOptions: { label: string; value: 'all' | EmploymentStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Freelance', value: 'freelance' },
]

const scheduleStatusOptions: { label: string; value: 'all' | ScheduleStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const attendanceOptions: { label: string; value: 'all' | AttendanceStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Attended', value: 'attended' },
  { label: 'Absent', value: 'absent' },
]

const classificationOptions: { label: string; value: 'all' | ReportClassification }[] = [
  { label: 'All', value: 'all' },
  { label: 'Eligible', value: 'eligible' },
  { label: 'Excluded', value: 'excluded' },
  { label: 'Needs attention', value: 'needs-attention' },
]

const columns: TableColumn<Report>[] = [
    {
      header: 'Date',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { date } = row.original.schedule;
        return `${useDateFormat(date, 'DD MMMM YYYY').value}`
      },
    },
    {
      header: 'Time',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { startTime, endTime } = row.original.schedule;
        return `${startTime} - ${endTime}`
      },
    },
    {
      header: 'Student',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { student } = row.original.schedule;
        if (!student) return 'No Student';

        return `${student.name} | ${student.id}`
      },
    },
    {
      header: 'Grade',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { grade } = row.original.schedule;

        return grade
      },
    },
    {
      header: 'Instructor',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { instructor } = row.original.schedule;
        if (!instructor) return 'No Instructor';

        return `${instructor.name}`
      },
    },
    {
      header: 'Employment',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { instructor } = row.original.schedule;
        if (!instructor) return 'No Instructor';

        return `${instructor.statusLabel}`
      },
    },
    {
      header: 'Schedule',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { status } = row.original.schedule;

        const colorOptions: Record<ScheduleStatus, string> = {
          Submitted: 'success' as const,
          Draft: 'warning' as const,
          Cancelled: 'error' as const
        }

        const color = colorOptions[status];

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          status
        )
      },
    },
    {
      header: 'Attendance',
      cell({ row }) {
        if (!row.original.schedule) return 'Unscheduled';
        const { attendance } = row.original.schedule;
        if (!attendance) return h(UBadge, { class: 'capitalize', variant: 'subtle', color: 'error' }, () =>
          'Missing'
        );

        const colorOptions: Record<AttendanceStatus, string> = {
          attended: 'success' as const,
          scheduled: 'warning' as const,
          absent: 'error' as const
        }

        const color = colorOptions[attendance.status];

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          attendance.status
        )
      },
    },
    {
      header: 'Payroll',
      cell({ row }) {
        const colorOptions: Record<ReportClassification, string> = {
          eligible: 'success' as const,
          excluded: 'neutral' as const,
          'needs-attention': 'error' as const
        }

        const color = colorOptions[row.original.classification];

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.original.classificationLabel
        )
      },
    },
  ];
</script>

<template>
  <UDashboardPanel id="teaching-reports">
    <template #header>
      <UDashboardNavbar title="Teaching Report">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :columns="columns"
        :data="reports"
        :loading="loading"
        :pagination="pagination"
        @update-page="goToPage"
      >
        <template #filter>
          <div class="grid gap-3">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <UFormField label="Period">
                <DateRangePicker v-model="range" />
              </UFormField>

              <UFormField label="Instructor">
                <UInput v-model="filters.instructorSearch" placeholder="Name, email, or phone" class="w-full" />
              </UFormField>

              <UFormField label="Grade">
                <USelect v-model="filters.grade" :items="gradeOptions" class="w-full" />
              </UFormField>

              <UFormField label="Employment status">
                <USelect v-model="filters.employmentStatus" :items="employmentOptions" class="w-full" />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <UFormField label="Schedule status">
                <USelect v-model="filters.scheduleStatus" :items="scheduleStatusOptions" class="w-full" />
              </UFormField>

              <UFormField label="Attendance status">
                <USelect v-model="filters.attendanceStatus" :items="attendanceOptions" class="w-full" />
              </UFormField>

              <UFormField label="Classification">
                <USelect v-model="filters.classification" :items="classificationOptions" class="w-full" />
              </UFormField>

              <div class="flex items-end">
                <UButton
                  label="Reset filters"
                  icon="i-lucide-rotate-ccw"
                  color="neutral"
                  variant="outline"
                  class="w-full justify-center"
                  @click="resetFilters"
                />
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </template>
  </UDashboardPanel>
</template>
