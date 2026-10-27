import { reactive, ref, watch } from 'vue'
import { DashboardBreakdown, DateRange, Stat } from '../types'
import { useReport } from './useReport'
import { sleep } from '../utils';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Report } from '../dto/report';

const _delay = import.meta.env.VITE_REQUEST_DELAY || 500;

export const useDashboard = () => {
  const toast = useToast();
  const stats = reactive<Stat[]>([]);
  const reportByEmployeeStatus = reactive<DashboardBreakdown[]>([]);
  const reportByGrade = reactive<DashboardBreakdown[]>([]);
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
      stats.splice(0);
      reportByEmployeeStatus.splice(0);
      reportByGrade.splice(0);
      loading.value = true;
      error.value = undefined;
      await sleep(_delay);

      const reports = await getReports();
      const filteredReports = reports.filter((report) => new Date(report.submittedAt) > range.start.toDate(getLocalTimeZone()) && new Date(report.submittedAt) < range.end.toDate(getLocalTimeZone()) );
      breakdownByEmployeeStatus(filteredReports);
      breakdownByGrade(filteredReports);
      stats.push({
        icon: 'i-lucide-file-text',
        title: 'Teaching Reports',
        value: filteredReports.length,
        color: 'primary',
      })

      const eligible = filteredReports.filter((report) => report.classification === 'eligible');
      stats.push({
        icon: 'i-lucide-check',
        title: 'Eligible Meeting',
        value: eligible.length,
        color: 'success',

      })

      const excluded = filteredReports.filter((report) => report.classification === 'excluded');
      stats.push({
        icon: 'i-lucide-x',
        title: 'Excluded',
        value: excluded.length,
        color: 'warning',
      })

      const attention = filteredReports.filter((report) => report.classification === 'needs-attention');
      stats.push({
        icon: 'i-lucide-triangle-alert',
        title: 'Needs Attention',
        value: attention.length,
        color: 'error',
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  function breakdownByEmployeeStatus(reports: Report[]) {
    reports.forEach((report) => {
      const status = report.schedule?.instructor?.employmentStatus;
      const index = reportByEmployeeStatus.findIndex((breakdown) => breakdown.key === status);
      const _report = reportByEmployeeStatus[index];
      if (index === -1) {
        const eligible = report.classification === 'eligible' ? 1 : 0;
        const excluded = report.classification === 'excluded' ? 1 : 0;
        const reports = 1;
        reportByEmployeeStatus.push({
          key: status || 'uncategorized',
          label: report.schedule?.instructor?.statusLabel || 'Uncategorized',
          reports,
          eligible,
          excluded,
        })
      } else {
        reportByEmployeeStatus[index].reports = _report.reports + 1;
        reportByEmployeeStatus[index].eligible = report.classification === 'eligible' ? _report.eligible + 1 : _report.eligible;
        reportByEmployeeStatus[index].excluded = report.classification === 'excluded' ? _report.excluded + 1 : _report.excluded;
      }
    })
  }

  function breakdownByGrade(reports: Report[]) {
    reports.forEach((report) => {
      const grade = report.schedule?.grade.toString();
      const index = reportByGrade.findIndex((breakdown) => breakdown.key === grade);
      const _report = reportByGrade[index];
      if (index === -1) {
        const eligible = report.classification === 'eligible' ? 1 : 0;
        const excluded = report.classification === 'excluded' ? 1 : 0;
        const reports = 1;
        reportByGrade.push({
          key: grade || 'uncategorized',
          label: grade ? `Grade ${grade}` : 'Uncategorized',
          reports,
          eligible,
          excluded,
        })
      } else {
        reportByGrade[index].reports = _report.reports + 1;
        reportByGrade[index].eligible = report.classification === 'eligible' ? _report.eligible + 1 : _report.eligible;
        reportByGrade[index].excluded = report.classification === 'excluded' ? _report.excluded + 1 : _report.excluded;
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

  return { stats, breakdownByStatus: reportByEmployeeStatus, breakdownByGrade: reportByGrade, range, loading, error }
}

