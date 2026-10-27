import { onMounted, reactive, ref, shallowReactive, shallowRef, watch } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { sleep } from '../utils';
import { useReport } from './useReport';
import { Report } from '../dto/report';
import type { Pagination, TeachingReportFilters } from '../types';

const _delay = import.meta.env.VITE_REQUEST_DELAY || 500;

function createDefaultFilters(): TeachingReportFilters {
  const end = today(getLocalTimeZone());

  return {
    range: { start: end.subtract({ months: 3 }), end },
    instructorSearch: '',
    grade: 'all',
    employmentStatus: 'all',
    scheduleStatus: 'all',
    attendanceStatus: 'all',
    classification: 'all',
  };
}

export const useTeachingReport = () => {
  const toast = useToast();
  const loading = ref(false);
  const error = ref<string>();
  const reports = shallowRef<Report[]>([]);

  const pagination = reactive<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const filters = shallowReactive<TeachingReportFilters>(createDefaultFilters());

  const { getReports } = useReport();

  let reloadTimer: ReturnType<typeof setTimeout> | undefined;
  let requestId = 0;

  onMounted(() => {
    reload(1);
  })

  function reload(page = pagination.page, delay = 0) {
    pagination.page = page;
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => getTeachingReports(pagination, filters), delay);
  }

  function goToPage(page: number) {
    reload(page);
  }

  function resetFilters() {
    Object.assign(filters, createDefaultFilters());
    reload(1);
  }

  async function getTeachingReports(
    _pagination: Pagination,
    _filters: TeachingReportFilters = filters
  ) {
    const page = _pagination.page;
    const pageSize = _pagination.pageSize;
    const filter = { ..._filters };
    const id = ++requestId;

    try {
      loading.value = true;
      error.value = undefined;
      await sleep(_delay);
      const allReports = await getReports();
      if (id !== requestId) return;

      const filtered = allReports.filter((report) => matchesFilters(report, filter));

      pagination.page = page;
      pagination.pageSize = pageSize;
      pagination.total = filtered.length;

      const start = (page - 1) * pageSize;
      reports.value = filtered.slice(start, start + pageSize);
    } catch (e) {
      if (id !== requestId) return;
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      if (id === requestId) loading.value = false;
    }
  }

  function matchesFilters(report: Report, filter: TeachingReportFilters) {
    const schedule = report.schedule;
    if (!schedule) return false;

    const instructorQuery = filter.instructorSearch.trim().toLowerCase();
    if (instructorQuery) {
      const instructor = schedule.instructor;
      const haystack = [instructor?.name, instructor?.email, instructor?.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(instructorQuery)) return false;
    }

    if (filter.grade !== 'all' && schedule.grade !== filter.grade) return false;
    if (filter.employmentStatus !== 'all' && schedule.instructor?.employmentStatus !== filter.employmentStatus) return false;
    if (filter.scheduleStatus !== 'all' && schedule.status !== filter.scheduleStatus) return false;
    if (filter.attendanceStatus !== 'all' && schedule.attendance?.status !== filter.attendanceStatus) return false;
    if (filter.classification !== 'all' && report.classification !== filter.classification) return false;

    const startDate = filter.range.start.toString();
    const endDate = filter.range.end.toString();
    if (schedule.date < startDate || schedule.date > endDate) return false;

    return true;
  }

  watch(filters, () => reload(1, 250));

  watch(error, () => {
    if (error.value) {
      toast.add({
        title: error.value,
        color: 'error'
      })
    }
  })

  return {
    reports,
    loading,
    error,
    pagination,
    filters,
    getTeachingReports,
    goToPage,
    resetFilters,
  }
}
