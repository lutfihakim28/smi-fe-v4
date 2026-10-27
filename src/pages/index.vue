<script setup lang="ts">
import { computed } from 'vue';
import { useDashboard } from '../composables/useDashboard';
import { getLocalTimeZone } from '@internationalized/date';
import { Range } from '../types';
import { toCalendarDate } from '../utils';

const { range, stats, loading, breakdownByStatus, breakdownByGrade } = useDashboard();

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
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Dashboard" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <DateRangePicker v-model="dateRange" class="-ms-1" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div v-if="loading" class="flex items-center justify-center">
        <p>Loading...</p>
      </div>
      <template v-else>
        <HomeStats :stats="stats" />
        <HomeBreakdown :breakdown-by-status="breakdownByStatus" :breakdown-by-grade="breakdownByGrade" />
      </template>
    </template>
  </UDashboardPanel>
</template>
