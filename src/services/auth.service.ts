import { authApi } from "./api";
import { API_PATHS } from "@/utils/constants";
import type {
  StudentLoginRequest,
  StudentLoginResponse,
  TutorLoginRequest,
  TutorLoginResponse,
} from "@/types";

export const authService = {
  studentLogin: async (data: StudentLoginRequest): Promise<StudentLoginResponse> => {
    const response = await authApi.post(API_PATHS.STUDENT_LOGIN, data);
    return response.data;
  },

  tutorLogin: async (data: TutorLoginRequest): Promise<TutorLoginResponse> => {
    const response = await authApi.post(API_PATHS.TUTOR_LOGIN, data);
    return response.data;
  },
};
