import { reactive, ref, watch } from 'vue'
import { DateRange, Payroll } from '../types'
import { useReport } from './useReport'
import { sleep } from '../utils';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Report } from '../dto/report';

const _delay = import.meta.env.VITE_REQUEST_DELAY || 500;

export const usePayroll = () => {
  const toast = useToast();
  const payrolls = reactive<Payroll[]>([]);
  const range = reactive<DateRange>(createDefaultRange());
  const loading = ref(false);
  const error = ref<string>();

  const { getReports } = useReport();

  function createDefaultRange(): DateRange {
    const end = today(getLocalTimeZone());

    return { start: end.subtract({ months: 3 }), end };
  }

  async function getStats() {
    try {
      payrolls.splice(0);
      loading.value = true;
      error.value = undefined;
      await sleep(_delay);

      const _reports = await getReports();
      const filteredReports = _reports.filter((report) =>
        new Date(report.submittedAt) > range.start.toDate(getLocalTimeZone())
        && new Date(report.submittedAt) < range.end.toDate(getLocalTimeZone())
        && report.classification === 'eligible'
      );

      toPayroll(filteredReports);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  function toPayroll(reports: Report[]) {
    reports.forEach((report) => {
      const schedule = report.schedule;
      const instructor = schedule?.instructor;
      const index = payrolls.findIndex((payroll) => payroll.instructorId === schedule?.instructorId);
      if (index === -1) {
        payrolls.push({
          eligibleCount: 1,
          employmentLabel: instructor?.statusLabel,
          employmentStatus: instructor?.employmentStatus,
          grade: schedule?.grade,
          instructor: instructor?.name,
          instructorId: schedule?.instructorId || 'Uncategorized',
        })
      } else {
        payrolls[index].eligibleCount += 1;
      }
    })
  }

  watch(() => [range.start, range.end], () => {
    getStats()
  }, { immediate: true })

  watch(error, () => {
    if (error.value) {
      toast.add({
        title: error.value,
        color: 'error'
      })
    }
  })

  return { payrolls, range, loading, error }
}
