<script setup lang="ts">
import { computed } from 'vue';
import { getLocalTimeZone } from '@internationalized/date';
import { Payroll, Range } from '../types';
import { toCalendarDate } from '../utils';
import { usePayroll } from '../composables/usePayroll';
import { TableColumn } from '@nuxt/ui';
import { exportPayrollToExcel } from '../services/export-excel';

const columns: TableColumn<Payroll>[] = [
  {
    accessorKey: 'instructor',
    header: 'Instructor',
  },
  {
    header: 'Employment',
    cell({ row }) {
      if (!row.original.employmentLabel) return 'No Instructor';

      return row.original.employmentLabel
    },
  },
  {
    header: 'Grade',
    cell({ row }) {
      if (!row.original.grade) return 'Unscheduled';
      const { grade } = row.original;

      return grade
    },
  },
  {
    accessorKey: 'eligibleCount',
    header: 'Eligible Meeting',
  },
];

const { range, payrolls } = usePayroll();
const toast = useToast();

const dateRange = computed<Range>({
  get: () => ({
    start: range.start.toDate(getLocalTimeZone()),
    end: range.end.toDate(getLocalTimeZone()),
  }),
  set: (value) => {
    range.start = toCalendarDate(value.start)
    range.end = toCalendarDate(value.end)
  },
})

function handleExport() {
  if (payrolls.length === 0) {
    toast.add({
      title: 'No Payroll to export',
      color: 'error'
    })
    return;
  }
  exportPayrollToExcel(payrolls, { fileName: 'payroll.xlsx' })
}
</script>

<template>
  <UDashboardPanel id="payroll">
    <template #header>
      <UDashboardNavbar title="Payroll" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <DateRangePicker v-model="dateRange" class="-ms-1" />
        </template>

        <template #right>
          <UButton
            label="Export Excel"
            icon="i-lucide-download"
            class="-ms-1"
            @click="handleExport"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable :columns="columns" :data="payrolls" />
    </template>
  </UDashboardPanel>
</template>
