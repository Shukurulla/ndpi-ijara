import api from "./api";
import { API_PATHS } from "@/utils/constants";
import type {
  NotificationResponse,
  ApartmentResponseData,
  StudentProfileResponse,
  AdsHomeResponse,
  ImageUploadResponse,
  StudentExistApartmentResponse,
  TutorStatisticsResponse,
  TutorProfileResponse,
  TutorUpdateProfileImageResponse,
  TutorChangePasswordResponse,
  TutorGetChatResponse,
  TutorChatDeleteResponse,
  TutorNotificationsResponse,
  StudentsResponse,
  StudentStatusResponse,
  GroupsByStatusResponse,
  NotLoggedStudentsResponse,
  CheckRequest,
  CheckResponse,
  StudentByStudentIdResponse,
  PushNotificationRequest,
  PushNotificationResponse,
  MyNoticeResponse,
  MyNoticeGroupResponse,
  MyNoticeStudentsResponse,
  MyNoticeSelectStudentSendRequest,
  MyNoticeSelectStudentSendResponse,
  PermissionCreateResponse,
  SendFCMTokenResponse,
} from "@/types";

export const mainService = {
  // ===== Student =====

  // GET /student/notification/:studentId
  getStudentNotifications: async (studentId: string): Promise<NotificationResponse> => {
    const res = await api.get(`${API_PATHS.STUDENT_NOTIFICATIONS}/${studentId}`);
    return res.data;
  },

  // POST /appartment/create (multipart)
  createApartment: async (formData: FormData): Promise<ApartmentResponseData> => {
    const res = await api.post(API_PATHS.STUDENT_CREATE_APARTMENT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // GET /student/profile
  getStudentProfile: async (): Promise<StudentProfileResponse> => {
    const res = await api.get(API_PATHS.STUDENT_PROFILE);
    return res.data;
  },

  // GET /notification/report/:userId (student home - tutor permissions/reports)
  getStudentHome: async (userId: string): Promise<NotificationResponse> => {
    const res = await api.get(`${API_PATHS.NOTIFICATION_REPORT}/${userId}`);
    return res.data;
  },

  // GET /ads/all?page=1&limit=10
  getAdsHome: async (): Promise<AdsHomeResponse> => {
    const res = await api.get(API_PATHS.STUDENT_ADS, { params: { page: 1, limit: 10 } });
    return res.data;
  },

  // PUT /appartment/:id (multipart - update images)
  uploadImage: async (appartmentId: string, formData: FormData): Promise<ImageUploadResponse> => {
    const res = await api.put(`${API_PATHS.APPARTMENT_UPDATE}/${appartmentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // GET /student/existAppartment?appartmentId=xxx or ?permissionId=xxx
  getExistApartment: async (params?: { appartmentId?: string; permissionId?: string }): Promise<StudentExistApartmentResponse> => {
    const res = await api.get(API_PATHS.STUDENT_EXIST_APARTMENT, { params });
    return res.data;
  },

  // ===== Tutor =====

  // GET /appertment/statistics/for-tutor (note backend typo)
  getTutorStatistics: async (): Promise<TutorStatisticsResponse> => {
    const res = await api.get(API_PATHS.APPARTMENT_STATISTICS);
    return res.data;
  },

  // GET /tutor/profile
  getTutorProfile: async (): Promise<TutorProfileResponse> => {
    const res = await api.get(API_PATHS.TUTOR_PROFILE);
    return res.data;
  },

  // PUT /tutor/profile (multipart)
  updateTutorProfileImage: async (formData: FormData): Promise<TutorUpdateProfileImageResponse> => {
    const res = await api.put(API_PATHS.TUTOR_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // POST /tutor/change-password { currentPassword, newPassword }
  changeTutorPassword: async (data: { currentPassword: string; newPassword: string }): Promise<TutorChangePasswordResponse> => {
    const res = await api.post(API_PATHS.TUTOR_CHANGE_PASSWORD, data);
    return res.data;
  },

  // GET /messages/by-group/:groupId
  getTutorChat: async (groupId: string): Promise<TutorGetChatResponse> => {
    const res = await api.get(`${API_PATHS.CHAT_BY_GROUP}/${groupId}`);
    return res.data;
  },

  // DELETE /messages/delete/:groupId
  deleteTutorChat: async (groupId: string): Promise<TutorChatDeleteResponse> => {
    const res = await api.delete(`${API_PATHS.CHAT_DELETE}/${groupId}`);
    return res.data;
  },

  // GET /tutor/my-groups
  getTutorChatGroups: async () => {
    const res = await api.get(API_PATHS.TUTOR_GROUPS);
    return res.data;
  },

  // GET /tutor-notification/my-messages
  getTutorNotifications: async (): Promise<TutorNotificationsResponse> => {
    const res = await api.get(API_PATHS.TUTOR_NOTIFICATIONS);
    return res.data;
  },

  // GET /tutor/my-groups (same as chat groups, for not-logged listing)
  getTutorNotLoggedGroups: async () => {
    const res = await api.get(API_PATHS.TUTOR_GROUPS);
    return res.data;
  },

  // ===== Students =====

  // GET /tutor/students-group/:group
  getStudentsByGroup: async (group: string): Promise<StudentsResponse> => {
    const res = await api.get(`${API_PATHS.TUTOR_STUDENTS_GROUP}/${group}`);
    return res.data;
  },

  // GET /appartment/status/:status/:groupId
  getStudentsByStatus: async (status: string, groupId: string): Promise<StudentStatusResponse> => {
    const res = await api.get(`${API_PATHS.APPARTMENT_STATUS}/${status}/${groupId}`);
    return res.data;
  },

  // GET /appartment/status/:status
  getGroupsByStatus: async (status: string): Promise<GroupsByStatusResponse> => {
    const res = await api.get(`${API_PATHS.APPARTMENT_STATUS}/${status}`);
    return res.data;
  },

  // GET /tutor/no-data-students/:groupId
  getNotLoggedStudents: async (groupId: string): Promise<NotLoggedStudentsResponse> => {
    const res = await api.get(`${API_PATHS.TUTOR_NO_DATA_STUDENTS}/${groupId}`);
    return res.data;
  },

  // ===== Check/Status =====

  // POST /appartment/check { appartmentId, chimney, gazStove, boiler, additionImage }
  submitCheck: async (data: CheckRequest): Promise<CheckResponse> => {
    const res = await api.post(API_PATHS.APPARTMENT_CHECK, data);
    return res.data;
  },

  // GET /student/find/:id
  getStudentByStudentId: async (studentId: string): Promise<StudentByStudentIdResponse> => {
    const res = await api.get(`${API_PATHS.STUDENT_FIND}/${studentId}`);
    return res.data;
  },

  // GET /students/:id/apartment
  getStudentApartment: async (studentId: string) => {
    const res = await api.get(`${API_PATHS.STUDENT_APARTMENT}/${studentId}/apartment`);
    return res.data;
  },

  // GET /appartment/my-appartments/:studentId
  getMyAppartments: async (studentId: string) => {
    const res = await api.get(`${API_PATHS.APPARTMENT_MY}/${studentId}`);
    return res.data;
  },

  // POST /notification/push { userId, message, status, appartmentId }
  pushNotification: async (data: PushNotificationRequest): Promise<PushNotificationResponse> => {
    const res = await api.post(API_PATHS.NOTIFICATION_PUSH, data);
    return res.data;
  },

  // POST /notification/report { userId, message, status, appartmentId, need_data }
  sendReport: async (data: { userId: string; message: string; status: string; appartmentId: string; need_data: string }): Promise<PushNotificationResponse> => {
    const res = await api.post(API_PATHS.NOTIFICATION_REPORT, data);
    return res.data;
  },

  // ===== Permission =====

  // POST /permission/permission-create
  createPermission: async (): Promise<PermissionCreateResponse> => {
    const res = await api.post(API_PATHS.PERMISSION_CREATE);
    return res.data;
  },

  // GET /permission/my-permissions
  getMyNotice: async (): Promise<MyNoticeResponse> => {
    const res = await api.get(API_PATHS.PERMISSION_MY);
    return res.data;
  },

  // GET /permission/:permissionId
  getMyNoticeGroup: async (permissionId: string): Promise<MyNoticeGroupResponse> => {
    const res = await api.get(`${API_PATHS.PERMISSION_BY_ID}/${permissionId}`);
    return res.data;
  },

  // GET /permission/:permissionId/:groupId
  getMyNoticeStudents: async (permissionId: string, groupId: string): Promise<MyNoticeStudentsResponse> => {
    const res = await api.get(`${API_PATHS.PERMISSION_GROUP}/${permissionId}/${groupId}`);
    return res.data;
  },

  // POST /permission/special { students: [{ studentId, permissionId }] }
  sendNoticeSelectStudents: async (data: MyNoticeSelectStudentSendRequest): Promise<MyNoticeSelectStudentSendResponse> => {
    const res = await api.post(API_PATHS.PERMISSION_SPECIAL, data);
    return res.data;
  },

  // GET /permission/:permissionId/apartments-by-type/:type
  getApartmentsByType: async (permissionId: string, type: string) => {
    const res = await api.get(`${API_PATHS.PERMISSION_APARTMENTS_BY_TYPE}/${permissionId}/apartments-by-type/${type}`);
    return res.data;
  },

  // ===== Visit Report (Task 7) =====

  // POST /appartment/visit-report/:appartmentId (multipart)
  uploadVisitReport: async (appartmentId: string, formData: FormData) => {
    const res = await api.post(`${API_PATHS.APPARTMENT_VISIT_REPORT}/${appartmentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // ===== FCM =====

  // POST /api/save-fcm-token { token }
  sendFCMToken: async (token: string): Promise<SendFCMTokenResponse> => {
    const res = await api.post(API_PATHS.SEND_FCM_TOKEN, { token });
    return res.data;
  },
};
