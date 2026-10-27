import { Student } from "../dto/student";

const _baseUrl = import.meta.env.VITE_BASE_URL;

export const useStudent = () => {
    async function getStudents(): Promise<Student[]> {
      try {
        const response = await fetch(`${_baseUrl}/data/students.json`);
        const responseJson = await response.json();
        if (responseJson instanceof Array) {
          return responseJson.map((student) => new Student(student))
        } else {
          throw Error('Error happen when fetching students');
        }
      } catch (e) {
        if (e instanceof Error) throw e;
        throw Error('Error happen when fetching students');
      }
    }

    return { getStudents }
}
