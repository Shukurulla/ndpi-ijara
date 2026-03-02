import { create } from "zustand";

interface QuestionState {
  q1Phone: string;
  q3FullAddress: string;
  q4District: string;
  q4Lat: number;
  q4Lon: number;
  q5ApartmentType: string;
  q7BoilerType: string;
  q8Price: string;
  q8MemberCount: string;
  q9OwnerName: string;
  q9OwnerPhone: string;
  q10ApartmentNumber: string;
  q10Description: string;
  boilerImage: File | null;
  gasImage: File | null;
  chimneyImage: File | null;
  additionImage: File | null;
  contractImage: File | null;
  contractPdf: File | null;
  bedroomNumber: string;
  roomNumber: string;

  // Task 5-6: Markazlashgan kotelxona
  isCentralizedHeating: boolean | null;
  boilerLocation: string;

  // Task 2: Yetimlik
  isOrphan: boolean;
  orphanType: string;
  orphanCertificate: File | null;
  guardianGender: string;
  guardianPhone: string;
  governorDecision: File | null;

  // Task 3: Nogironlik
  hasDisability: boolean;
  disabilityCategory: number | null;
  disabilityType: string;
  disabilityCertificate: File | null;
  disabilityCertificateExpiry: string;

  // Task 4: Daftarlar
  youthNotebook: boolean;
  youthNotebookDoc: File | null;
  womenNotebook: boolean;
  womenNotebookDoc: File | null;
  poorNotebook: boolean;
  poorNotebookDoc: File | null;
  noNotebooks: boolean;

  // Task 7: Bino tafsilotlari
  domNumber: string;
  kvartiranumber: string;

  // Task 13: Geolocation
  geoLat: number;
  geoLon: number;

  setField: (field: string, value: any) => void;
  reset: () => void;
}

const initialState = {
  q1Phone: "",
  q3FullAddress: "",
  q4District: "",
  q4Lat: 0,
  q4Lon: 0,
  q5ApartmentType: "",
  q7BoilerType: "",
  q8Price: "",
  q8MemberCount: "",
  q9OwnerName: "",
  q9OwnerPhone: "",
  q10ApartmentNumber: "",
  q10Description: "",
  boilerImage: null,
  gasImage: null,
  chimneyImage: null,
  additionImage: null,
  contractImage: null,
  contractPdf: null,
  bedroomNumber: "",
  roomNumber: "",
  isCentralizedHeating: null,
  boilerLocation: "",
  isOrphan: false,
  orphanType: "",
  orphanCertificate: null,
  guardianGender: "",
  guardianPhone: "",
  governorDecision: null,
  hasDisability: false,
  disabilityCategory: null,
  disabilityType: "",
  disabilityCertificate: null,
  disabilityCertificateExpiry: "",
  youthNotebook: false,
  youthNotebookDoc: null,
  womenNotebook: false,
  womenNotebookDoc: null,
  poorNotebook: false,
  poorNotebookDoc: null,
  noNotebooks: false,
  domNumber: "",
  kvartiranumber: "",
  geoLat: 0,
  geoLon: 0,
};

export const useQuestionStore = create<QuestionState>((set) => ({
  ...initialState,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () => set(initialState),
}));
