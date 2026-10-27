import { Attendance } from "../dto/attendance";
import { useInstructor } from "./useInstructor";

const _baseUrl = import.meta.env.VITE_BASE_URL;

export const useAttendance = () => {

  const { getInstructors } = useInstructor();
  async function getAttendance(): Promise<Attendance[]> {
    try {
      const [response, instructors] = await Promise.all([
        fetch(`${_baseUrl}/data/attendance.json`),
        getInstructors(),
      ]);
      const responseJson = await response.json();
      if (responseJson instanceof Array) {
        return responseJson.map((attendance) => {
          if (attendance satisfies Attendance) {
            const markedBy = instructors.find((instructor) => instructor.id === attendance.markedBy)
            if (!markedBy) throw Error('Error happen when getting attendance marked by');
            attendance.instructor = markedBy;
            return new Attendance(attendance);
          }
          throw Error('Error happen when fetching attendance')
        })
      } else {
        throw Error('Error happen when fetching attendance');
      }
    } catch (e) {
      if (e instanceof Error) throw e;
      throw Error('Error happen when fetching attendance');
    }
  }

  return { getAttendance }
}
