<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DashboardBreakdown } from '../../types';

const props = defineProps<{
  breakdown: DashboardBreakdown
}>()

const reports = ref(0);
const eligible = ref(0);
const excluded = ref(0);

onMounted(() => {
  reports.value = props.breakdown.reports;
  eligible.value = props.breakdown.eligible;
  excluded.value = props.breakdown.excluded;
})
</script>

<template>
  <div class="flex items-center">
    <p class="flex-2">
      {{ breakdown.label }}
    </p>
    <div class="flex flex-col flex-10 gap-px">
      <UProgress v-model="reports" :max="reports" color="primary" />
      <UProgress v-model="eligible" :max="reports" color="success" />
      <UProgress v-model="excluded" :max="reports" color="warning" />
    </div>
  </div>
</template>
