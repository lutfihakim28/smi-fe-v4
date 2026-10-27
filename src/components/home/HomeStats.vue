<script setup lang="ts">
import type { Stat } from '../../types'

defineProps<{
  stats: Stat[]
}>()
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: {
          primary: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
          success: 'p-2.5 rounded-full bg-success/10 ring ring-inset ring-success/25',
          error: 'p-2.5 rounded-full bg-error/10 ring ring-inset ring-error/25',
          warning: 'p-2.5 rounded-full bg-warning/10 ring ring-inset ring-warning/25',
        }[stat.color],
        leadingIcon: {
          primary: 'text-primary',
          success: 'text-success',
          error: 'text-error',
          warning: 'text-warning',
        }[stat.color],
        title: 'font-normal text-muted text-xs uppercase'
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
