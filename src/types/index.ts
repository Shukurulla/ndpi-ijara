export interface StudentLoginRequest {
  login: number;
  password: string;
}

export interface TutorLoginRequest {
  login: string;
  password: string;
}

export interface StudentLoginResponse {
  status: string;
  student: Student;
  token: string;
}

export interface TutorLoginResponse {
  status: string;
  data: Tutor;
  token: string;
}

export interface Student {
  _id: string;
  full_name: string;
  first_name: string;
  second_name: string;
  third_name: string;
  image: string | null;
  student_id_number: string;
  birth_date: string;
  GPA: number;
  credit: number;
  group: StudentGroup;
  semester: StudentSemester;
  specialty: StudentSpecialty;
  level: StudentLevel;
  educationForm: StudentEducationForm;
  educationType: StudentEducationType;
  paymentForm: StudentPaymentForm;
  studentStatus: StudentStudentStatus;
  country: StudentCountry;
  district: StudentDistrict;
  province: StudentProvince;
  socialCategory: StudentSocialCategory;
  accommodation: StudentAccommodation;
  university: StudentUniversity;
  gender: StudentGender;
  department: StudentDepartment;
  educationYear: StudentEducationYear;
  address: string;
  id: number;
}

export interface StudentGroup {
  name: string;
  code: string;
  id: number;
  educationLang: { name: string; code: string; id: number };
}

export interface StudentSemester {
  name: string;
  code: string;
  id: number;
}
export interface StudentSpecialty {
  name: string;
  code: string;
  id: number;
}
export interface StudentLevel {
  name: string;
  code: string;
  id: number;
}
export interface StudentEducationForm {
  name: string;
  code: string;
  id: number;
}
export interface StudentEducationType {
  name: string;
  code: string;
  id: number;
}
export interface StudentPaymentForm {
  name: string;
  code: string;
  id: number;
}
export interface StudentStudentStatus {
  name: string;
  code: string;
  id: number;
}
export interface StudentCountry {
  name: string;
  code: string;
  id: number;
}
export interface StudentDistrict {
  name: string;
  code: string;
  id: number;
}
export interface StudentProvince {
  name: string;
  code: string;
  id: number;
}
export interface StudentSocialCategory {
  name: string;
  code: string;
  id: number;
}
export interface StudentAccommodation {
  name: string;
  code: string;
  id: number;
}
export interface StudentUniversity {
  name: string;
  code: string;
  id: number;
}
export interface StudentGender {
  name: string;
  code: string;
  id: number;
}
export interface StudentEducationYear {
  name: string;
  code: string;
  id: number;
}
export interface StudentDepartment {
  name: string;
  code: string;
  id: number;
  localityType: { name: string; code: string; id: number };
  structureType: { name: string; code: string; id: number };
}

export interface Tutor {
  _id: string;
  login: string;
  name: string;
  role: string;
  createdAt: string;
  phone: string;
  image?: string;
  updatedAt: string;
  group: TutorGroup[];
}

export interface TutorGroup {
  _id: string;
  name: string;
  code: number;
  faculty: string;
  createdAt: string;
  updatedAt: string;
  student_count: number;
}

// ========== Main Response Models ==========
export interface TutorStatisticsResponse {
  statistics?: TutorStatistics | null;
  data?: TutorStatistics | null;
  status?: string;
  green?: StatColor;
  yellow?: StatColor;
  red?: StatColor;
  blue?: StatColor;
}

export interface TutorStatistics {
  green: StatColor;
  yellow: StatColor;
  red: StatColor;
  blue: StatColor;
}

export interface StatColor {
  count?: number;
  total?: number;
  percentage?: number;
  percent?: string;
}

export interface StudentsResponse {
  status: string;
  data: StudentsData[];
}

export interface StudentsData {
  _id?: string;
  id: number;
  full_name: string;
  image: string | null;
  gender: { name: string };
  level?: string;
  province: { name: string };
  department: { name: string };
  specialty: { name: string };
  group: { name: string; code: string };
  appartmentStatus?: string;
}

export interface StudentProfileResponse {
  data: StudentProfileData;
  status: string;
}

export interface StudentProfileData {
  id: number;
  full_name: string;
  first_name: string;
  image: string | null;
  group: { name: string; code: string };
  department: { name: string };
  province: string;
  district: string;
  gender: { name: string };
  level?: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface TutorProfileResponse {
  data: TutorProfileData;
  status: string;
}

export interface TutorProfileData {
  _id: string;
  login: string;
  name: string;
  role: string;
  phone: string;
  image?: string;
  group: TutorProfileGroup[];
}

export interface TutorProfileGroup {
  _id: string;
  name: string;
  code: number;
  faculty: string;
}

export interface NotificationResponse {
  status: string;
  data: NotificationData[];
  length: number;
  unread: number;
}

export interface NotificationData {
  _id: string;
  need_data: string;
  message: string;
  appartmentId: string;
  permission?: string;
  isRead: boolean;
  status: string;
  notification_type: string;
  createdAt: string;
}

export interface TutorNotificationsResponse {
  data?: TutorNotificationItem[];
  messages?: TutorNotificationItem[];
  unreads?: number;
}

export interface TutorNotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface StudentHomeResponse {
  status: string;
  data: StudentHomeData[];
  length: number;
  unread: number;
}

export interface StudentHomeData {
  _id: string;
  needData: string;
  message: string;
  permission: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdsHomeResponse {
  data: AdsData[];
  pagination: AdsPagination;
}

export interface AdsData {
  _id: string;
  title: string;
  image: string;
  icon: string;
  link: string;
}

export interface AdsPagination {
  total: number;
  page: number;
  limit: number;
}

export interface StudentExistApartmentResponse {
  status: string;
  exist: boolean;
  apartmentId: string | null;
  data: ExistApartmentData | null;
}

export interface ExistApartmentData {
  _id: string;
  studentId: string;
  studentPhoneNumber?: string;
  district?: string;
  region?: string;
  fullAddress?: string;
  smallDistrict?: string;
  otherSmallDistrict?: string;
  typeOfAppartment?: string;
  typeAppartment?: string;
  contract?: boolean;
  contractImage?: string;
  contractPdf?: string;
  typeOfBoiler?: string;
  priceAppartment?: number;
  numberOfStudents?: number;
  appartmentOwnerName?: string;
  appartmentOwnerPhone?: string;
  appartmentNumber?: string;
  addition?: string;
  current?: boolean;
  boilerImage?: { url: string; status: string };
  gazStove?: { url: string; status: string };
  chimney?: { url: string; status: string };
  additionImage?: { url: string; status: string };
  status: string;
  needNew?: boolean;
  location?: { lat: string; long: string };
  view?: boolean;
  description?: string;
  permission?: string;
  bedroom?: { bedroomNumber: string; roomNumber: string };
  isCentralizedHeating?: boolean;
  boilerLocation?: string;
  isOrphan?: boolean;
  orphanType?: string;
  orphanCertificate?: string;
  guardianGender?: string;
  guardianPhone?: string;
  governorDecision?: string;
  hasDisability?: boolean;
  disabilityCategory?: number;
  disabilityType?: string;
  disabilityCertificate?: string;
  disabilityCertificateExpiry?: string;
  youthNotebook?: boolean;
  youthNotebookDoc?: string;
  womenNotebook?: boolean;
  womenNotebookDoc?: string;
  poorNotebook?: boolean;
  poorNotebookDoc?: string;
  geoLocation?: { lat: number; long: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface ApartmentResponseData {
  data: ApartmentData;
  message: string;
  status: string;
}

export interface ApartmentData {
  _id: string;
  location: ApartmentLocation;
  boilerImage: ApartmentBoilerImage[];
  gazStove: ApartmentGazStove[];
  chimney: ApartmentChimney[];
  contractImage: ApartmentContractImage[];
  addition?: string[];
}

export interface ApartmentLocation {
  lat: number;
  lon: number;
}

export interface ApartmentBoilerImage {
  image: string;
  status: string;
}
export interface ApartmentGazStove {
  image: string;
  status: string;
}
export interface ApartmentChimney {
  image: string;
  status: string;
}
export interface ApartmentContractImage {
  image: string;
}

export interface StudentStatusResponse {
  data: StudentStatusData[];
}

export interface StudentStatusData {
  student: StatusStudent;
  appartment: StatusApartment;
}

export interface StatusStudent {
  _id: string;
  full_name: string;
  image: string | null;
  id: number;
  group: { name: string };
}

export interface StatusApartment {
  _id: string;
  status: string;
  location: ApartmentLocation;
  boilerImage: ApartmentBoilerImage[];
  gazStove: ApartmentGazStove[];
  chimney: ApartmentChimney[];
}

export interface GroupsByStatusResponse {
  status: string;
  data: GroupStatusData[];
}

export interface GroupStatusData {
  _id?: string;
  code: string | number;
  name?: string;
  groupName?: string;
  faculty?: string;
  student_count?: number;
  countStudents?: number;
  educationLang?: { name: string };
}

export interface TutorGetChatResponse {
  data: TutorChatData[];
}

export interface TutorChatData {
  _id: string;
  group: string;
  message: string;
  tutorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorChatGroupsResponse {
  data: TutorChatGroupsData;
}

export interface TutorChatGroupsData {
  _id: string;
  name: string;
  phone: string;
  image?: string;
  group: TutorChatGroup[];
}

export interface TutorChatGroup {
  _id: string;
  name: string;
  code: number;
  faculty: string;
  student_count: number;
}

export interface TutorChatDeleteResponse {
  message: string;
  status: string;
}

export interface MyNoticeResponse {
  data: MyNoticeData[];
}

export interface MyNoticeData {
  _id: string;
  date: string;
  countDocuments: number;
  status: string;
}

export interface MyNoticeGroupResponse {
  data: MyNoticeGroupData[];
}

export interface MyNoticeGroupData {
  _id: string;
  countDocuments: number;
  groupName: string;
  code: number;
}

export interface MyNoticeStudentsResponse {
  data: MyNoticeStudentData[];
}

export interface MyNoticeStudentData {
  _id: string;
  appartment: MyNoticeApartment;
  student: MyNoticeStudent;
}

export interface MyNoticeApartment {
  _id: string;
  status: string;
  bedroom?: string;
  typeAppartment?: string;
}

export interface MyNoticeStudent {
  _id: string;
  full_name: string;
  image: string | null;
  gender: { name: string };
  level?: string;
  province: { name: string };
  department: { name: string };
  specialty: { name: string };
  group: { name: string };
  university: { name: string };
}

export interface NotLoggedStudentsResponse {
  data: NotLoggedStudentData[];
}

export interface NotLoggedStudentData {
  _id: string;
  full_name: string;
  image: string | null;
  gender: { name: string };
  level?: string;
  province: { name: string };
  specialty: { name: string };
  university: { name: string };
  id: number;
}

export interface TutorNotLoggedGroupsResponse {
  data: TutorNotLoggedGroup[];
}

export interface TutorNotLoggedGroup {
  _id: string;
  code: number;
  name: string;
  totalStudents: number;
}

export interface CheckRequest {
  appartmentId: string;
  boiler: string;
  gazStove: string;
  chimney: string;
  additionImage?: string;
}

export interface CheckResponse {
  data: CheckData;
  status: string;
}

export interface CheckData {
  _id: string;
  status: string;
}

export interface PushNotificationRequest {
  userId: string;
  message: string;
  status: string;
  appartmentId: string;
}

export interface PushNotificationResponse {
  data: { message: string };
  status: string;
}

export interface StudentByStudentIdResponse {
  data: StudentByStudentIdData;
}

export interface StudentByStudentIdData {
  _id: string;
  full_name: string;
  image: string | null;
  group: { name: string };
  location: ApartmentLocation;
  boilerImage: ApartmentBoilerImage[];
  gazStove: ApartmentGazStove[];
  chimney: ApartmentChimney[];
}

export interface TutorChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TutorChangePasswordResponse {
  data: TutorChangePasswordData;
  status: string;
}

export interface TutorChangePasswordData {
  _id: string;
  name: string;
  group: TutorProfileGroup[];
}

export interface SendFCMTokenRequest {
  token: string;
  studentId?: string;
}

export interface SendFCMTokenResponse {
  message: string;
  status: string;
}

export interface ImageUploadResponse {
  data: string;
  status: string;
}

export interface TutorUpdateProfileImageResponse {
  data: {
    _id: string;
    image: string;
    group: TutorProfileGroup[];
  };
  status: string;
}

export interface PermissionCreateResponse {
  data: { message: string };
  status: string;
}

export interface MyNoticeSelectStudentSendRequest {
  students: { studentId: string; permissionId: string }[];
}

export interface MyNoticeSelectStudentSendResponse {
  data: { message: string };
  status: string;
}

// ========== Yetimlik va Nogironlik ==========
export interface OrphanData {
  isOrphan: boolean;
  orphanType?: "bolalarUyi" | "vasiylik" | null;
  orphanCertificate?: string | null;
  guardianPhone?: string | null;
  governorDecision?: string | null;
}

export interface DisabilityData {
  hasDisability: boolean;
  disabilityCategory?: 1 | 2 | 3 | null;
  disabilityType?: string | null;
  disabilityCertificate?: string | null;
  disabilityCertificateExpiry?: string | null;
}

export interface OrphanDisabilityStats {
  orphan: {
    total: number;
    byType: { _id: string; count: number }[];
  };
  disability: {
    total: number;
    byCategory: { _id: number; count: number }[];
  };
}
