export const BASE_URL = "https://tutorapp.asadbek-durdana.uz";
export const SOCKET_URL = "https://tutorapp.asadbek-durdana.uz";
// export const BASE_URL = "http://localhost:7788";
// export const SOCKET_URL = "http://localhost:7788";

export const API_PATHS = {
  // Auth
  STUDENT_LOGIN: "student/sign",
  TUTOR_LOGIN: "tutor/login",

  // Student
  STUDENT_NOTIFICATIONS: "student/notification", // + /:studentId
  STUDENT_CREATE_APARTMENT: "appartment/create",
  STUDENT_PROFILE: "student/profile",
  STUDENT_ADS: "ads/all",
  STUDENT_EXIST_APARTMENT: "student/existAppartment",
  STUDENT_FIND: "student/find", // + /:id
  STUDENT_APARTMENT: "students", // + /:id/apartment

  // Appartment
  APPARTMENT_UPDATE: "appartment", // PUT /:id
  APPARTMENT_CHECK: "appartment/check",
  APPARTMENT_STATUS: "appartment/status", // + /:status or /:status/:groupId
  APPARTMENT_MY: "appartment/my-appartments", // + /:studentId
  APPARTMENT_NEW: "appartment/new", // + /:studentId?permissionId=xxx
  APPARTMENT_STATISTICS: "appertment/statistics/for-tutor", // note: backend typo "appertment"
  APPARTMENT_VISIT_REPORT: "appartment/visit-report", // + /:appartmentId

  // Tutor
  TUTOR_PROFILE: "tutor/profile",
  TUTOR_CHANGE_PASSWORD: "tutor/change-password",
  TUTOR_MY_STUDENTS: "tutor/my-students",
  TUTOR_STUDENTS_GROUP: "tutor/students-group", // + /:group
  TUTOR_GROUPS: "tutor/my-groups",
  TUTOR_NO_DATA_STUDENTS: "tutor/no-data-students", // + /:groupId

  // Chat (messages)
  CHAT_BY_GROUP: "messages/by-group", // + /:groupId
  CHAT_DELETE: "messages/delete", // DELETE /:groupId
  CHAT_FIREBASE: "messages/firebase", // + /:groupId?limit=50

  // Notifications
  NOTIFICATION_PUSH: "notification/push", // POST + GET /:userId
  NOTIFICATION_REPORT: "notification/report", // POST + GET /:userId
  TUTOR_NOTIFICATIONS: "tutor-notification/my-messages",

  // Permission
  PERMISSION_CREATE: "permission/permission-create",
  PERMISSION_MY: "permission/my-permissions",
  PERMISSION_BY_ID: "permission", // + /:permissionId
  PERMISSION_GROUP: "permission", // + /:permissionId/:groupId
  PERMISSION_SPECIAL: "permission/special",
  PERMISSION_APARTMENTS_BY_TYPE: "permission", // + /:permissionId/apartments-by-type/:type

  // FCM
  SEND_FCM_TOKEN: "api/save-fcm-token",
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  TUTOR_OR_STUDENT: "tutorOrStudent",
  TUTOR_NAME: "tutorName",
  TUTOR_PHONE: "tutorPhone",
  TUTOR_IMAGE: "tutorImage",
  TUTOR_GROUPS: "tutorGroups",
  TUTOR_ID: "tutorId",
  STUDENT_FULL_NAME: "studentFullName",
  STUDENT_FIRST_NAME: "studentFirstName",
  STUDENT_ID: "studentId",
  STUDENT_IMAGE: "studentImage",
  STUDENT_REGION: "studentRegion",
  STUDENT_DISTRICT: "studentDistrict",
  STUDENT_GROUP_NAME: "studentGroupName",
  STUDENT_GROUP_ID: "studentGroupId",
  STUDENT_FACULTY_NAME: "studentFacultyName",
  STUDENT_GENDER: "studentGender",
  STUDENT_LEVEL: "studentLevel",
  STUDENT_ADDRESS: "studentAddress",
  HAS_FORM_FILLED: "hasFormFilled",
  QUESTION_NUMBER: "questionNumber",
};
