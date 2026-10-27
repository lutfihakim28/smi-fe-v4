import { Report } from "../dto/report";
import { useSchedule } from "./useSchedule";

const _baseUrl = import.meta.env.VITE_BASE_URL;

export const useReport = () => {
  const { getSchedules } = useSchedule();

  async function getReports(): Promise<Report[]> {
    try {
      const [response, schedules] = await Promise.all([
        fetch(`${_baseUrl}/data/reports.json`),
        getSchedules(),
      ]);
      const responseJson = await response.json();
      if (responseJson instanceof Array) {
        return responseJson.map((report) => {
          if (report satisfies Report) {
            const reportSchedule = schedules.find((schedule) => schedule.id === report.scheduleId)
            if (!reportSchedule) throw Error('Error happen when getting report schedule');
            report.schedule = reportSchedule;
            return new Report(report);
          }
          throw Error('Error happen when fetching report')
        })
      } else {
        throw Error('Error happen when fetching report');
      }
    } catch (e) {
      if (e instanceof Error) throw e;
      throw Error('Error happen when fetching report');
    }
  }

  return { getReports }
}
