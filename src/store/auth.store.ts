import { create } from "zustand";
import { STORAGE_KEYS } from "@/utils/constants";
import type { TutorGroup } from "@/types";

interface AuthState {
  token: string | null;
  userType: number | null;
  tutorName: string | null;
  tutorPhone: string | null;
  tutorImage: string | null;
  tutorGroups: TutorGroup[];
  tutorId: string | null;
  studentFullName: string | null;
  studentFirstName: string | null;
  studentId: string | null;
  studentImage: string | null;
  studentRegion: string | null;
  studentGroupName: string | null;
  studentGroupId: string | null;
  studentFacultyName: string | null;
  studentGender: string | null;
  studentLevel: string | null;
  hasFormFilled: boolean;
  questionNumber: number;

  init: () => void;
  setToken: (token: string) => void;
  setStudentData: (data: {
    fullName: string;
    firstName: string;
    id: string;
    image: string | null;
    region: string;
    groupName: string;
    groupId: string;
    facultyName: string;
    gender: string;
    level?: string;
  }) => void;
  setTutorData: (data: {
    name: string;
    phone: string;
    image: string | null;
    groups: TutorGroup[];
    id: string;
  }) => void;
  setUserType: (type: number) => void;
  setHasFormFilled: (filled: boolean) => void;
  setQuestionNumber: (num: number) => void;
  setTutorImage: (image: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userType: null,
  tutorName: null,
  tutorPhone: null,
  tutorImage: null,
  tutorGroups: [],
  tutorId: null,
  studentFullName: null,
  studentFirstName: null,
  studentId: null,
  studentImage: null,
  studentRegion: null,
  studentGroupName: null,
  studentGroupId: null,
  studentFacultyName: null,
  studentGender: null,
  studentLevel: null,
  hasFormFilled: false,
  questionNumber: 0,

  init: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userType = localStorage.getItem(STORAGE_KEYS.TUTOR_OR_STUDENT);
    const groupsStr = localStorage.getItem(STORAGE_KEYS.TUTOR_GROUPS);
    let groups: TutorGroup[] = [];
    try {
      groups = groupsStr ? JSON.parse(groupsStr) : [];
    } catch {
      groups = [];
    }

    set({
      token,
      userType: userType ? parseInt(userType) : null,
      tutorName: localStorage.getItem(STORAGE_KEYS.TUTOR_NAME),
      tutorPhone: localStorage.getItem(STORAGE_KEYS.TUTOR_PHONE),
      tutorImage: localStorage.getItem(STORAGE_KEYS.TUTOR_IMAGE),
      tutorGroups: groups,
      tutorId: localStorage.getItem(STORAGE_KEYS.TUTOR_ID),
      studentFullName: localStorage.getItem(STORAGE_KEYS.STUDENT_FULL_NAME),
      studentFirstName: localStorage.getItem(STORAGE_KEYS.STUDENT_FIRST_NAME),
      studentId: localStorage.getItem(STORAGE_KEYS.STUDENT_ID),
      studentImage: localStorage.getItem(STORAGE_KEYS.STUDENT_IMAGE),
      studentRegion: localStorage.getItem(STORAGE_KEYS.STUDENT_REGION),
      studentGroupName: localStorage.getItem(STORAGE_KEYS.STUDENT_GROUP_NAME),
      studentGroupId: localStorage.getItem(STORAGE_KEYS.STUDENT_GROUP_ID),
      studentFacultyName: localStorage.getItem(
        STORAGE_KEYS.STUDENT_FACULTY_NAME,
      ),
      studentGender: localStorage.getItem(STORAGE_KEYS.STUDENT_GENDER),
      studentLevel: localStorage.getItem(STORAGE_KEYS.STUDENT_LEVEL),
      hasFormFilled:
        localStorage.getItem(STORAGE_KEYS.HAS_FORM_FILLED) === "true",
      questionNumber: parseInt(
        localStorage.getItem(STORAGE_KEYS.QUESTION_NUMBER) || "0",
      ),
    });
  },

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    set({ token });
  },

  setStudentData: (data) => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_FULL_NAME, data.fullName);
    localStorage.setItem(STORAGE_KEYS.STUDENT_FIRST_NAME, data.firstName);
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, data.id);
    if (data.image)
      localStorage.setItem(STORAGE_KEYS.STUDENT_IMAGE, data.image);
    localStorage.setItem(STORAGE_KEYS.STUDENT_REGION, data.region);
    localStorage.setItem(STORAGE_KEYS.STUDENT_GROUP_NAME, data.groupName);
    localStorage.setItem(STORAGE_KEYS.STUDENT_GROUP_ID, data.groupId);
    localStorage.setItem(STORAGE_KEYS.STUDENT_FACULTY_NAME, data.facultyName);
    localStorage.setItem(STORAGE_KEYS.STUDENT_GENDER, data.gender);
    if (data.level)
      localStorage.setItem(STORAGE_KEYS.STUDENT_LEVEL, data.level);
    localStorage.setItem(STORAGE_KEYS.TUTOR_OR_STUDENT, "1");
    set({
      studentFullName: data.fullName,
      studentFirstName: data.firstName,
      studentId: data.id,
      studentImage: data.image,
      studentRegion: data.region,
      studentGroupName: data.groupName,
      studentGroupId: data.groupId,
      studentFacultyName: data.facultyName,
      studentGender: data.gender,
      studentLevel: data.level || null,
      userType: 1,
    });
  },

  setTutorData: (data) => {
    localStorage.setItem(STORAGE_KEYS.TUTOR_NAME, data.name);
    localStorage.setItem(STORAGE_KEYS.TUTOR_PHONE, data.phone);
    if (data.image) localStorage.setItem(STORAGE_KEYS.TUTOR_IMAGE, data.image);
    localStorage.setItem(
      STORAGE_KEYS.TUTOR_GROUPS,
      JSON.stringify(data.groups),
    );
    localStorage.setItem(STORAGE_KEYS.TUTOR_ID, data.id);
    localStorage.setItem(STORAGE_KEYS.TUTOR_OR_STUDENT, "2");
    set({
      tutorName: data.name,
      tutorPhone: data.phone,
      tutorImage: data.image,
      tutorGroups: data.groups,
      tutorId: data.id,
      userType: 2,
    });
  },

  setUserType: (type) => {
    localStorage.setItem(STORAGE_KEYS.TUTOR_OR_STUDENT, type.toString());
    set({ userType: type });
  },

  setHasFormFilled: (filled) => {
    localStorage.setItem(STORAGE_KEYS.HAS_FORM_FILLED, filled.toString());
    set({ hasFormFilled: filled });
  },

  setQuestionNumber: (num) => {
    localStorage.setItem(STORAGE_KEYS.QUESTION_NUMBER, num.toString());
    set({ questionNumber: num });
  },

  setTutorImage: (image) => {
    localStorage.setItem(STORAGE_KEYS.TUTOR_IMAGE, image);
    set({ tutorImage: image });
  },

  logout: () => {
    localStorage.clear();
    set({
      token: null,
      userType: null,
      tutorName: null,
      tutorPhone: null,
      tutorImage: null,
      tutorGroups: [],
      tutorId: null,
      studentFullName: null,
      studentFirstName: null,
      studentId: null,
      studentImage: null,
      studentRegion: null,
      studentGroupName: null,
      studentGroupId: null,
      studentFacultyName: null,
      studentGender: null,
      studentLevel: null,
      hasFormFilled: false,
      questionNumber: 0,
    });
  },
}));
