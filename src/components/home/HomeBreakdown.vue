<script setup lang="ts">
import { DashboardBreakdown } from '../../types';

defineProps<{
  breakdownByStatus: DashboardBreakdown[];
  breakdownByGrade: DashboardBreakdown[];
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <UCard variant="subtle" class="lg:flex-1">
        <template #header>
          <p class="font-semibold text-sm opacity-70">
            By Employee Status
          </p>
        </template>

        <div class="flex flex-col gap-2">
          <HomeBreakdownItem
            v-for="breakdown in breakdownByStatus"
            :key="breakdown.key"
            :breakdown="breakdown"
          />
        </div>
      </UCard>

      <UCard variant="subtle" class="lg:flex-1">
        <template #header>
          <p class="font-semibold text-sm opacity-70">
            By Grade
          </p>
        </template>

        <div class="flex flex-col gap-2">
          <HomeBreakdownItem
            v-for="breakdown in breakdownByGrade"
            :key="breakdown.key"
            :breakdown="breakdown"
          />
        </div>
      </UCard>
    </div>
    <UCard variant="subtle">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-primary rounded" />
          <p>
            Reports
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-success rounded" />
          <p>Eligible</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-warning rounded" />
          <p>Excluded</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
