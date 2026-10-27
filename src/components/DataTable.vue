<script setup lang="ts" generic="T">
import { TableColumn } from '@nuxt/ui';
import { Pagination } from '../types';

defineProps<{
  columns: TableColumn<T>[];
  data: T[];
  pagination: Pagination;
  loading: boolean;
}>()

const emit = defineEmits<{
  updatePage: [page: number]
}>()
</script>

<template>
  <slot name="filter" />

  <UTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination-options="{ manualPagination: true }"
  />

  <div class="flex justify-end border-t border-default pt-4 mt-auto">
    <UPagination
      :page="pagination.page"
      :items-per-page="pagination.pageSize"
      :total="pagination.total"
      show-edges
      @update:page="emit('updatePage')"
    />
  </div>
</template>
