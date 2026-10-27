import { Schedule } from "../dto/schedule";
import { useInstructor } from "./useInstructor";
import { useStudent } from "./useStudent";
import { useAttendance } from "./useAttendance";

const _baseUrl = import.meta.env.VITE_BASE_URL;

export const useSchedule = () => {

  const { getInstructors } = useInstructor();
  const { getStudents } = useStudent();
  const { getAttendance } = useAttendance();

  async function getSchedules(): Promise<Schedule[]> {
    try {
      const [response, instructors, students, attendance] = await Promise.all([
        fetch(`${_baseUrl}/data/schedules.json`),
        getInstructors(),
        getStudents(),
        getAttendance(),
      ]);
      const responseJson = await response.json();
      if (responseJson instanceof Array) {
        return responseJson.map((schedule) => {
          if (schedule satisfies Schedule) {
            const scheduleInstructor = instructors.find((instructor) => instructor.id === schedule.instructorId)
            if (!scheduleInstructor) throw Error('Error happen when getting schedule instructor');

            const scheduleStudent = students.find((student) => student.id === schedule.studentId)
            if (!scheduleStudent) throw Error('Error happen when getting schedule student');

            const scheduleAttendance = attendance.find((attendance) => attendance.scheduleId === schedule.id)

            schedule.instructor = scheduleInstructor;
            schedule.attendance = scheduleAttendance;
            schedule.student = scheduleStudent;
            return new Schedule(schedule);
          }
          throw Error('Error happen when fetching attendance')
        })
      } else {
        throw Error('Error happen when fetching schedules');
      }
    } catch (e) {
      if (e instanceof Error) throw e;
      throw Error('Error happen when fetching schedules');
    }
  }

  return { getSchedules }
}
