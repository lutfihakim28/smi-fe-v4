import { Instructor } from "../dto/instructor";

const _baseUrl = import.meta.env.VITE_BASE_URL;

export const useInstructor = () => {
  async function getInstructors(): Promise<Instructor[]> {
    try {
      const response = await fetch(`${_baseUrl}/data/instructors.json`);
      const responseJson = await response.json();
      if (responseJson instanceof Array) {
        return responseJson.map((instructor) => new Instructor(instructor))
      } else {
        throw Error('Error happen when fetching instructors');
      }
    } catch (e) {
      if (e instanceof Error) throw e;
      throw Error('Error happen when fetching instructors');
    }
  }

  return { getInstructors }
}
