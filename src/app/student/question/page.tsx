"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useQuestionStore } from "@/store/question.store";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";

const boilerTypes = [
  "Ariston kotyol", "Qol - bola kotyol", "Kontromarka", "Elektro pech",
  "Qol - bola pech", "Konditsioner", "Isitish uskunasi yo'q", "Boshqa",
];

const apartmentBuildingTypes = [
  { value: "multi", label: "Ko'p qavatli bino" },
  { value: "land", label: "Yer uchastkasi" },
];

interface Mahalla { _id: string; name: string; region: string; }

const formatPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return d.slice(0, 2) + " " + d.slice(2);
  if (d.length <= 7) return d.slice(0, 2) + " " + d.slice(2, 5) + " " + d.slice(5);
  return d.slice(0, 2) + " " + d.slice(2, 5) + " " + d.slice(5, 7) + " " + d.slice(7);
};
const formatNumber = (raw: string): string => {
  const d = raw.replace(/\D/g, ""); if (!d) return "";
  return Number(d).toLocaleString("ru-RU").replace(/,/g, " ");
};
const unformatNumber = (f: string): string => f.replace(/\s/g, "");

function QuestionContent() {
  const router = useRouter();
  useAuthGuard();
  const searchParams = useSearchParams();
  const permission = searchParams.get("permission") || "";
  const typeFromUrl = searchParams.get("type") || "";
  const store = useQuestionStore();
  const { setQuestionNumber, setHasFormFilled, studentGender } = useAuthStore();
  const mapGender = (g: string | null): string => {
    if (!g) return "";
    const l = g.toLowerCase();
    if (l === "erkak" || l === "male") return "ogil";
    if (l === "ayol" || l === "female") return "qiz";
    return "";
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otherBoiler, setOtherBoiler] = useState("");
  const [hasContract, setHasContract] = useState<boolean | null>(null);
  const [buildingType, setBuildingType] = useState("");
  const [mahallas, setMahallas] = useState<Mahalla[]>([]);
  const [filteredMahallas, setFilteredMahallas] = useState<Mahalla[]>([]);
  const [mahallaSearch, setMahallaSearch] = useState("");
  const [selectedMahalla, setSelectedMahalla] = useState<Mahalla | null>(null);

  // --- Address: ko'cha qidiruv + uy raqami qo'lda ---
  interface StreetResult { name: string; fullAddress: string; lat: number; lon: number; }
  const [streetQuery, setStreetQuery] = useState("");
  const [streetResults, setStreetResults] = useState<StreetResult[]>([]);
  const [streetSearching, setStreetSearching] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<StreetResult | null>(null);
  const [showStreetResults, setShowStreetResults] = useState(false);
  const [addressHouse, setAddressHouse] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streetWrapperRef = useRef<HTMLDivElement>(null);

  // --- Camera ---
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraField, setCameraField] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sahifa ochilganda oldingi ma'lumotlarni tozalash
  useEffect(() => {
    store.reset();
    setStep(1);
    setBuildingType("");
    setSelectedMahalla(null);
    setMahallaSearch("");
    setSelectedStreet(null);
    setStreetQuery("");
    setAddressHouse("");
    setHasContract(null);
    setOtherBoiler("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFromUrl]);

  useEffect(() => {
    fetch("/data/nukus_districts.json").then(r => r.json())
      .then((d: Mahalla[]) => { setMahallas(d); setFilteredMahallas(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mahallaSearch.trim()) { setFilteredMahallas(mahallas); return; }
    const s = mahallaSearch.toLowerCase();
    setFilteredMahallas(mahallas.filter(m => m.name.toLowerCase().includes(s)));
  }, [mahallaSearch, mahallas]);


  useEffect(() => { if (typeFromUrl && !store.q5ApartmentType) store.setField("q5ApartmentType", typeFromUrl); }, [typeFromUrl, store]);
  useEffect(() => { if (!typeFromUrl && permission) router.replace(`/student/apartment-type/${permission}`); }, [typeFromUrl, permission, router]);

  const apartmentType = store.q5ApartmentType || typeFromUrl;

  const getSteps = (): string[] => {
    if (apartmentType === "tenant") {
      const steps = ["phone","buildingType","mahalla","address"];
      steps.push("contract","boilerType");
      if (buildingType !== "land") steps.push("centralizedHeating");
      steps.push("price","studentsCount","owner","addition",
        "orphan","disability","notebooks");
      if (store.isCentralizedHeating !== true) steps.push("boilerImage","gasImage","chimneyImage","additionImage");
      else steps.push("gasImage","additionImage");
      return steps;
    }
    if (apartmentType === "bedroom") return ["phone","bedroomNumber","roomNumber","addition","orphan","disability","notebooks"];
    if (apartmentType === "littleHouse") {
      const steps = ["phone","buildingType","mahalla","address"];
      steps.push("ownerName","ownerPhone");
      if (buildingType !== "land") steps.push("centralizedHeating");
      steps.push("addition","orphan","disability","notebooks");
      if (store.isCentralizedHeating !== true) steps.push("boilerImage","gasImage","chimneyImage","additionImage");
      else steps.push("gasImage","additionImage");
      return steps;
    }
    if (apartmentType === "relative") {
      const steps = ["phone","buildingType","mahalla","address"];
      steps.push("ownerName","ownerPhone");
      if (buildingType !== "land") steps.push("centralizedHeating");
      steps.push("addition","orphan","disability","notebooks");
      if (store.isCentralizedHeating !== true) steps.push("boilerImage","gasImage","chimneyImage","additionImage");
      else steps.push("gasImage","additionImage");
      return steps;
    }
    return ["phone","ownerName","ownerPhone","addition","orphan","disability","notebooks"];
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const currentStepName = steps[step - 1];

  // Click outside — dropdown yopish
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (streetWrapperRef.current && !streetWrapperRef.current.contains(e.target as Node)) {
        setShowStreetResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced street search via geocoder API
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (streetQuery.length < 2) { setStreetResults([]); setStreetSearching(false); return; }
    setStreetSearching(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(streetQuery)}`);
        const data = await res.json();
        const items: StreetResult[] = (data.results || []).map((r: any) => ({
          name: r.name, fullAddress: r.fullAddress, lat: r.lat, lon: r.lon,
        }));
        setStreetResults(items);
        setShowStreetResults(true);
      } catch { setStreetResults([]); }
      finally { setStreetSearching(false); }
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [streetQuery]);

  const geoRequested = useRef(false);
  const handleNext = () => {
    setError("");
    // Task 13: Birinchi "Keyingi" bosilganda geolocation so'rash
    if (!geoRequested.current && navigator.geolocation) {
      geoRequested.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          store.setField("geoLat", pos.coords.latitude);
          store.setField("geoLon", pos.coords.longitude);
        },
        () => {}
      );
    }
    switch (currentStepName) {
      case "phone": if (!store.q1Phone || store.q1Phone.length < 9) { setError("Telefon raqamni to'liq kiriting (9 raqam)"); return; } break;
      case "mahalla": if (!selectedMahalla) { setError("Mahallani tanlang"); return; } break;
      case "address":
        if (!selectedStreet) { setError("Ko'chani qidirib tanlang"); return; }
        if (buildingType === "multi") {
          if (!store.domNumber.trim()) { setError("Dom raqamini kiriting"); return; }
          if (!store.kvartiranumber.trim()) { setError("Kvartira raqamini kiriting"); return; }
        } else {
          if (!addressHouse.trim()) { setError("Uy raqamini kiriting"); return; }
        }
        break;
      case "buildingType": if (!buildingType) { setError("Kvartira turini tanlang"); return; } break;
      case "buildingDetails":
        if (!store.domNumber.trim()) { setError("Dom raqamini kiriting"); return; }
        if (!store.kvartiranumber.trim()) { setError("Kvartira raqamini kiriting"); return; }
        break;
      case "contract": if (hasContract === null) { setError("Shartnoma borligini tanlang"); return; } break;
      case "boilerType":
        if (!store.q7BoilerType) { setError("Isitish turini tanlang"); return; }
        if (store.q7BoilerType === "Boshqa" && !otherBoiler.trim()) { setError("Isitish uskunasi nomini yozing"); return; }
        break;
      case "centralizedHeating":
        if (store.isCentralizedHeating === null) { setError("Isitish tizimini tanlang"); return; }
        if (store.isCentralizedHeating === false && !store.boilerLocation) { setError("Kotelxona joyini tanlang"); return; }
        break;
      case "price": if (!store.q8Price.trim()) { setError("Ijara narxini kiriting"); return; } break;
      case "studentsCount": if (!store.q8MemberCount.trim()) { setError("Talabalar sonini kiriting"); return; } break;
      case "owner":
        if (!store.q9OwnerName.trim()) { setError("Uy egasining ismini kiriting"); return; }
        if (!store.q9OwnerPhone.trim() || store.q9OwnerPhone.replace(/\D/g, "").length < 9) { setError("Uy egasining telefon raqamini to'liq kiriting"); return; }
        break;
      case "ownerName": if (!store.q9OwnerName.trim()) { setError("Ismini kiriting"); return; } break;
      case "ownerPhone": if (!store.q9OwnerPhone.trim() || store.q9OwnerPhone.replace(/\D/g, "").length < 9) { setError("Telefon raqamni to'liq kiriting"); return; } break;
      case "apartmentNumber": if (!store.q10ApartmentNumber.trim()) { setError("Xonadon raqamini kiriting"); return; } break;
      case "bedroomNumber": if (!store.bedroomNumber.trim()) { setError("Yotoqxona raqamini kiriting"); return; } break;
      case "roomNumber": if (!store.roomNumber.trim()) { setError("Xona raqamini kiriting"); return; } break;
      case "orphan":
        if (store.isOrphan) {
          if (!store.orphanType) { setError("Yetimlik turini tanlang"); return; }
          if (store.orphanType === "mehribonlikUyi" && !store.orphanCertificate) { setError("Guvohnomani yuklang"); return; }
          if (store.orphanType === "vasiylik") {
            if (!store.guardianPhone.trim() || store.guardianPhone.replace(/\D/g, "").length < 9) { setError("Vasiy telefon raqamini to'liq kiriting"); return; }
            if (!store.governorDecision) { setError("Hokim qarorini yuklang"); return; }
          }
        } break;
      case "disability":
        if (store.hasDisability) {
          if (!store.disabilityCategory) { setError("Nogironlik guruhini tanlang"); return; }
          if (!store.disabilityType.trim()) { setError("Kasallik turini kiriting"); return; }
          if (!store.disabilityCertificate) { setError("Spravkani yuklang"); return; }
          if (store.disabilityCategory !== 1 && !store.disabilityCertificateExpiry) { setError("Spravka muddatini kiriting"); return; }
        } break;
      case "notebooks":
        if (!store.noNotebooks && !store.youthNotebook && !store.womenNotebook && !store.poorNotebook) { setError("Kamida bittasini tanlang yoki \"Yo'q\" ni belgilang"); return; }
        if (store.youthNotebook && !store.youthNotebookDoc) { setError("Yoshlar daftari hujjatini yuklang"); return; }
        if (store.womenNotebook && !store.womenNotebookDoc) { setError("Xotin-qizlar daftari hujjatini yuklang"); return; }
        if (store.poorNotebook && !store.poorNotebookDoc) { setError("Kambag'al daftari hujjatini yuklang"); return; }
        break;
      case "boilerImage": if (!store.boilerImage) { setError("Isitish qurilmasi suratini oling"); return; } break;
      case "gasImage": if (!store.gasImage) { setError("Gaz plita suratini oling"); return; } break;
      case "chimneyImage": if (!store.chimneyImage) { setError("Mo'ri suratini oling"); return; } break;
    }
    setStep(step + 1);
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      const sid = localStorage.getItem("studentId") || "";
      formData.append("studentId", sid);
      formData.append("studentPhoneNumber", "+998" + store.q1Phone);
      formData.append("typeAppartment", apartmentType);
      if (permission) formData.append("permission", permission);
      formData.append("isCentralizedHeating", (store.isCentralizedHeating === true).toString());
      if (store.isCentralizedHeating !== true && store.boilerLocation) formData.append("boilerLocation", store.boilerLocation);
      if (store.geoLat) formData.append("geoLat", store.geoLat.toString());
      if (store.geoLon) formData.append("geoLon", store.geoLon.toString());

      if (apartmentType === "tenant") {
        formData.append("district", selectedMahalla?.name || store.q4District);
        formData.append("typeOfAppartment", buildingType);
        formData.append("fullAddress", store.q3FullAddress);
        formData.append("lat", store.q4Lat.toString());
        formData.append("lon", store.q4Lon.toString());
        if (buildingType === "multi") {
          formData.append("appartmentNumber", `${store.domNumber}-${store.kvartiranumber}`);
        }
        formData.append("contract", hasContract ? "true" : "false");
        formData.append("typeOfBoiler", store.q7BoilerType === "Boshqa" ? otherBoiler : store.q7BoilerType);
        formData.append("priceAppartment", unformatNumber(store.q8Price));
        formData.append("numberOfStudents", unformatNumber(store.q8MemberCount));
        formData.append("appartmentOwnerName", store.q9OwnerName);
        formData.append("appartmentOwnerPhone", "+998" + store.q9OwnerPhone.replace(/\D/g, ""));
        formData.append("description", store.q10Description);
        if (store.isCentralizedHeating !== true) {
          if (store.boilerImage) formData.append("boilerImage", store.boilerImage);
          if (store.chimneyImage) formData.append("chimney", store.chimneyImage);
        }
        if (store.gasImage) formData.append("gazStove", store.gasImage);
        if (store.additionImage) formData.append("additionImage", store.additionImage);
        if (store.contractImage) formData.append("contractImage", store.contractImage);
        if (store.contractPdf) formData.append("contractPdf", store.contractPdf);
      } else if (apartmentType === "bedroom") {
        formData.append("bedroomNumber", store.bedroomNumber);
        formData.append("roomNumber", store.roomNumber);
        formData.append("description", store.q10Description);
      } else if (apartmentType === "littleHouse") {
        formData.append("district", selectedMahalla?.name || store.q4District);
        formData.append("typeOfAppartment", buildingType);
        formData.append("fullAddress", store.q3FullAddress);
        formData.append("lat", store.q4Lat.toString());
        formData.append("lon", store.q4Lon.toString());
        if (buildingType === "multi") {
          formData.append("appartmentNumber", `${store.domNumber}-${store.kvartiranumber}`);
        }
        formData.append("appartmentOwnerName", store.q9OwnerName);
        formData.append("appartmentOwnerPhone", "+998" + store.q9OwnerPhone.replace(/\D/g, ""));
        formData.append("description", store.q10Description);
        if (store.isCentralizedHeating !== true) {
          if (store.boilerImage) formData.append("boilerImage", store.boilerImage);
          if (store.chimneyImage) formData.append("chimney", store.chimneyImage);
        }
        if (store.gasImage) formData.append("gazStove", store.gasImage);
        if (store.additionImage) formData.append("additionImage", store.additionImage);
      } else if (apartmentType === "relative") {
        formData.append("district", selectedMahalla?.name || store.q4District);
        formData.append("typeOfAppartment", buildingType);
        formData.append("fullAddress", store.q3FullAddress);
        formData.append("lat", store.q4Lat.toString());
        formData.append("lon", store.q4Lon.toString());
        if (buildingType === "multi") {
          formData.append("appartmentNumber", `${store.domNumber}-${store.kvartiranumber}`);
        }
        formData.append("appartmentOwnerName", store.q9OwnerName);
        formData.append("appartmentOwnerPhone", "+998" + store.q9OwnerPhone.replace(/\D/g, ""));
        formData.append("description", store.q10Description);
        if (store.isCentralizedHeating !== true) {
          if (store.boilerImage) formData.append("boilerImage", store.boilerImage);
          if (store.chimneyImage) formData.append("chimney", store.chimneyImage);
        }
        if (store.gasImage) formData.append("gazStove", store.gasImage);
        if (store.additionImage) formData.append("additionImage", store.additionImage);
      } else {
        formData.append("appartmentOwnerName", store.q9OwnerName);
        formData.append("appartmentOwnerPhone", "+998" + store.q9OwnerPhone.replace(/\D/g, ""));
        formData.append("description", store.q10Description);
      }

      formData.append("isOrphan", store.isOrphan.toString());
      if (store.isOrphan) {
        formData.append("orphanType", store.orphanType);
        if (store.orphanType === "mehribonlikUyi" && store.orphanCertificate) formData.append("orphanCertificate", store.orphanCertificate);
        if (store.orphanType === "vasiylik") {
          formData.append("guardianGender", mapGender(studentGender));
          formData.append("guardianPhone", "+998" + store.guardianPhone.replace(/\D/g, ""));
          if (store.governorDecision) formData.append("governorDecision", store.governorDecision);
        }
      }
      formData.append("hasDisability", store.hasDisability.toString());
      if (store.hasDisability) {
        formData.append("disabilityCategory", store.disabilityCategory?.toString() || "");
        formData.append("disabilityType", store.disabilityType);
        if (store.disabilityCertificate) formData.append("disabilityCertificate", store.disabilityCertificate);
        if (store.disabilityCategory !== 1 && store.disabilityCertificateExpiry) formData.append("disabilityCertificateExpiry", store.disabilityCertificateExpiry);
      }
      formData.append("youthNotebook", store.youthNotebook.toString());
      if (store.youthNotebook && store.youthNotebookDoc) formData.append("youthNotebookDoc", store.youthNotebookDoc);
      formData.append("womenNotebook", store.womenNotebook.toString());
      if (store.womenNotebook && store.womenNotebookDoc) formData.append("womenNotebookDoc", store.womenNotebookDoc);
      formData.append("poorNotebook", store.poorNotebook.toString());
      if (store.poorNotebook && store.poorNotebookDoc) formData.append("poorNotebookDoc", store.poorNotebookDoc);

      await mainService.createApartment(formData);
      setQuestionNumber(18); setHasFormFilled(true); store.reset();
      router.replace("/student/question/finish");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Xatolik yuz berdi");
    } finally { setLoading(false); }
  };

  // ===== RENDER STEP =====
  const renderStep = () => {
    switch (currentStepName) {
      case "phone": return renderPhoneStep();
      case "mahalla": return renderMahallaStep();
      case "address": return renderAddressStep();
      case "buildingType": return renderBuildingTypeStep();
      case "buildingDetails": return renderBuildingDetailsStep();
      case "contract": return renderContractStep();
      case "boilerType": return renderBoilerTypeStep();
      case "centralizedHeating": return renderCentralizedStep();
      case "price": return renderPriceStep();
      case "studentsCount": return renderStudentsCountStep();
      case "owner": return renderOwnerStep();
      case "apartmentNumber": return renderApartmentNumberStep();
      case "addition": return renderAdditionStep();
      case "orphan": return renderOrphanStep();
      case "disability": return renderDisabilityStep();
      case "notebooks": return renderNotebooksStep();
      case "boilerImage": return renderImageStep("Isitish tizimi surati", "Isitish qurilmasining suratini oling", "boilerImage", store.boilerImage);
      case "gasImage": return renderImageStep("Gaz plita surati", "Gaz plitangizning suratini oling", "gasImage", store.gasImage);
      case "chimneyImage": return renderImageStep("Mo'ri surati", "Mo'ri suratini oling", "chimneyImage", store.chimneyImage);
      case "additionImage": return renderImageStep("Qo'shimcha surat", "Qo'shimcha surat (ixtiyoriy)", "additionImage", store.additionImage);
      case "bedroomNumber": return renderFieldStep("Yotoqxona raqami", "Yotoqxona raqamingizni kiriting", "bedroomNumber", store.bedroomNumber);
      case "roomNumber": return renderFieldStep("Xona raqami", "Xona raqamingizni kiriting", "roomNumber", store.roomNumber);
      case "ownerName": return renderFieldStep("Uy egasi ismi", "Uy egasining to'liq ismini kiriting", "q9OwnerName", store.q9OwnerName);
      case "ownerPhone": return renderOwnerPhoneStep();
      default: return null;
    }
  };

  const renderFieldStep = (title: string, desc: string, field: string, value: string) => (
    <div><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-sm text-gray-500 mb-4">{desc}</p>
      <input type="text" value={value} onChange={(e) => store.setField(field, e.target.value)} placeholder={desc} className="input-field" /></div>
  );

  const openCamera = async (field: string) => {
    setCameraField(field);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraActive(false);
      setCameraField("");
      setError("Kameraga ruxsat berilmadi");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${cameraField}_${Date.now()}.jpg`, { type: "image/jpeg" });
        store.setField(cameraField, file);
      }
      closeCamera();
    }, "image/jpeg", 0.85);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraField("");
  };

  const renderImageStep = (title: string, desc: string, field: string, file: File | null) => (
    <div><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-sm text-gray-500 mb-4">{desc}</p>
      <button type="button" onClick={() => openCamera(field)}
        className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-[#5B6CF8] hover:bg-blue-50 transition">
        <div className="text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <p className="text-sm font-medium">{file ? "Qayta rasmga olish" : "Rasmga olish"}</p>
        </div>
      </button>
      {file && <img src={URL.createObjectURL(file)} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-xl" />}
    </div>
  );

  const renderPhoneStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Telefon raqamingiz</h3>
      <p className="text-sm text-gray-500 mb-4">Bog&apos;lanish uchun telefon raqamingizni kiriting</p>
      <div className="flex items-center gap-2"><span className="text-gray-500 font-medium whitespace-nowrap">+998</span>
        <input type="tel" inputMode="numeric" value={formatPhone(store.q1Phone)}
          onChange={(e) => store.setField("q1Phone", e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="90 123 45 67" className="input-field flex-1" />
      </div></div>
  );

  const renderOwnerPhoneStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Uy egasi telefoni</h3>
      <p className="text-sm text-gray-500 mb-4">Uy egasining telefon raqamini kiriting</p>
      <div className="flex items-center gap-2"><span className="text-gray-500 font-medium whitespace-nowrap">+998</span>
        <input type="tel" inputMode="numeric" value={formatPhone(store.q9OwnerPhone)}
          onChange={(e) => store.setField("q9OwnerPhone", e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="90 123 45 67" className="input-field flex-1" />
      </div></div>
  );

  const renderMahallaStep = () => (
    <div>
      <h3 className="text-lg font-semibold mb-2">Mahalla (MFY)</h3>
      <p className="text-sm text-gray-500 mb-4">Yashash joyingiz joylashgan mahallani tanlang</p>
      <input type="text" value={mahallaSearch} onChange={(e) => setMahallaSearch(e.target.value)} placeholder="Mahalla qidirish..." className="input-field mb-3" />
      <div className="max-h-[55vh] overflow-y-auto border border-gray-200 rounded-xl">
        {filteredMahallas.map((m) => {
          const sel = selectedMahalla?._id === m._id;
          return (<button key={m._id} onClick={() => { setSelectedMahalla(m); store.setField("q4District", m.name); }}
            className={`w-full flex items-center gap-3 p-3 text-left border-b border-gray-100 last:border-b-0 ${sel ? "bg-blue-50" : "hover:bg-gray-50"}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sel ? "border-[#5B6CF8]" : "border-gray-300"}`}>
              {sel && <div className="w-2 h-2 rounded-full bg-[#5B6CF8]" />}</div>
            <span className={`text-sm ${sel ? "font-semibold" : ""}`}>{m.name}</span></button>);
        })}
        {filteredMahallas.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Topilmadi</p>}
      </div>
    </div>
  );

  // ===== ADDRESS STEP — ko'cha qidiruv + uy raqami =====
  const handleSelectStreet = (s: StreetResult) => {
    setSelectedStreet(s);
    setStreetQuery(s.name);
    store.setField("q3FullAddress", s.fullAddress);
    store.setField("q4Lat", s.lat);
    store.setField("q4Lon", s.lon);
    setStreetResults([]);
    setShowStreetResults(false);
  };

  const handleClearStreet = () => {
    setSelectedStreet(null);
    setStreetQuery("");
    store.setField("q3FullAddress", "");
    store.setField("q4Lat", 0);
    store.setField("q4Lon", 0);
    setStreetResults([]);
    setShowStreetResults(false);
  };

  // Uy raqami o'zgarganda fullAddress yangilanadi
  const handleHouseChange = (val: string) => {
    setAddressHouse(val);
    if (selectedStreet) {
      const full = val ? `${selectedStreet.fullAddress}, ${val}` : selectedStreet.fullAddress;
      store.setField("q3FullAddress", full);
    }
  };

  const renderAddressStep = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Yashash manzili</h3>
        <p className="text-sm text-gray-500 mt-1">{buildingType === "multi" ? "Ko'cha, dom va kvartira raqamini kiriting" : "Ko'cha nomini qidiring va uy raqamini kiriting"}</p>
      </div>

      {/* Ko'cha qidiruv */}
      <div>
        <label className="text-sm text-gray-600 mb-1.5 block">Ko&apos;cha nomi</label>
        {!selectedStreet ? (
          <div className="relative" ref={streetWrapperRef}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" value={streetQuery}
                onChange={(e) => { setStreetQuery(e.target.value); if (selectedStreet) setSelectedStreet(null); }}
                onFocus={() => { if (streetResults.length > 0) setShowStreetResults(true); }}
                placeholder="Ko'cha nomini yozing..."
                autoComplete="off"
                className={`w-full pl-10 pr-10 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error && !selectedStreet ? "border-red-500" : "border-gray-300"}`} />
              {streetSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {showStreetResults && streetResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto">
                {streetResults.map((r, i) => (
                  <div key={i} onClick={() => handleSelectStreet(r)}
                    className="cursor-pointer select-none py-2.5 pl-3 pr-9 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500 truncate">{r.fullAddress}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showStreetResults && streetQuery.length >= 2 && !streetSearching && streetResults.length === 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-3 text-center">
                <p className="text-sm text-gray-500">Topilmadi</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-900 text-sm">{selectedStreet.name}</p>
                <p className="text-xs text-green-700 truncate">{selectedStreet.fullAddress}</p>
              </div>
              <button type="button" onClick={handleClearStreet}
                className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multi: dom + kvartira; Boshqalar: uy raqami */}
      {selectedStreet && buildingType === "multi" && (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Dom raqami</label>
            <input type="text" value={store.domNumber}
              onChange={(e) => store.setField("domNumber", e.target.value)}
              placeholder="Masalan: 5"
              className={`w-full py-3 px-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error && !store.domNumber.trim() ? "border-red-500" : "border-gray-300"}`} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Kvartira raqami</label>
            <input type="text" value={store.kvartiranumber}
              onChange={(e) => store.setField("kvartiranumber", e.target.value)}
              placeholder="Masalan: 12"
              className={`w-full py-3 px-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error && !store.kvartiranumber.trim() ? "border-red-500" : "border-gray-300"}`} />
          </div>
        </div>
      )}
      {selectedStreet && buildingType !== "multi" && (
        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">Uy raqami</label>
          <input type="text" value={addressHouse}
            onChange={(e) => handleHouseChange(e.target.value)}
            placeholder="Masalan: 73"
            autoComplete="off"
            className={`w-full py-3 px-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error && !addressHouse.trim() ? "border-red-500" : "border-gray-300"}`} />
        </div>
      )}
    </div>
  );


  const renderBuildingTypeStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Kvartira turi</h3>
      <p className="text-sm text-gray-500 mb-4">Yashayotgan uyingiz turini tanlang</p>
      <div className="space-y-3">
        {apartmentBuildingTypes.map((t) => (
          <label key={t.value} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${buildingType === t.value ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <input type="radio" name="bt" checked={buildingType === t.value} onChange={() => {
              setBuildingType(t.value);
              if (t.value === "land") {
                store.setField("isCentralizedHeating", false);
                store.setField("boilerLocation", "ichki");
              } else {
                store.setField("isCentralizedHeating", null);
                store.setField("boilerLocation", "");
              }
            }} className="w-4 h-4" />
            <span className="text-sm font-medium">{t.label}</span></label>))}
      </div></div>
  );

  const renderBuildingDetailsStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Bino tafsilotlari</h3>
      <p className="text-sm text-gray-500 mb-4">Dom va kvartira raqamini kiriting</p>
      <div className="space-y-4">
        <div><label className="text-sm text-gray-600 mb-1.5 block">Dom raqami</label>
          <input type="text" value={store.domNumber} onChange={(e) => store.setField("domNumber", e.target.value)} placeholder="Masalan: 5" className="input-field" /></div>
        <div><label className="text-sm text-gray-600 mb-1.5 block">Kvartira raqami</label>
          <input type="text" value={store.kvartiranumber} onChange={(e) => store.setField("kvartiranumber", e.target.value)} placeholder="Masalan: 12" className="input-field" /></div>
      </div></div>
  );

  const renderContractStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Ijara shartnomasi mavjudmi?</h3>
      <p className="text-sm text-gray-500 mb-4">Uy egasi bilan shartnoma tuzilganmi?</p>
      <div className="space-y-3 mb-4">
        {[true, false].map(v => (
          <label key={String(v)} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${hasContract === v ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <input type="radio" name="contract" checked={hasContract === v} onChange={() => setHasContract(v)} className="w-4 h-4" />
            <span className="text-sm font-medium">{v ? "Ha" : "Yo'q"}</span></label>))}
      </div>
      {hasContract && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <label className="text-sm text-gray-600 mb-1.5 block">Shartnoma fayli (rasm yoki PDF)</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (file?.type === "application/pdf") { store.setField("contractPdf", file); store.setField("contractImage", null); }
            else { store.setField("contractImage", file); store.setField("contractPdf", null); }
          }} className="input-field" />
          {(store.contractImage || store.contractPdf) && (
            <p className="text-xs text-green-600 mt-1">Fayl: {(store.contractImage as File)?.name || (store.contractPdf as File)?.name}</p>
          )}
        </div>
      )}</div>
  );

  const renderBoilerTypeStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Isitish turi</h3>
      <p className="text-sm text-gray-500 mb-4">Xonadonda qanday isitish uskunasi o&apos;rnatilgan?</p>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {boilerTypes.map((t) => (
          <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${store.q7BoilerType === t ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <input type="radio" name="boiler" checked={store.q7BoilerType === t} onChange={() => store.setField("q7BoilerType", t)} className="w-4 h-4" />
            <span className="text-sm">{t}</span></label>))}
      </div>
      {store.q7BoilerType === "Boshqa" && <input type="text" value={otherBoiler} onChange={(e) => setOtherBoiler(e.target.value)} placeholder="Isitish uskunasi nomini yozing..." className="input-field mt-3" />}
    </div>
  );

  const renderCentralizedStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Isitish tizimi</h3>
      <p className="text-sm text-gray-500 mb-4">Uyingizda markazlashgan kotelxona bormi?</p>
      <div className="space-y-3 mb-4">
        <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${store.isCentralizedHeating === true ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200"}`}>
          <input type="radio" name="ch" checked={store.isCentralizedHeating === true} onChange={() => { store.setField("isCentralizedHeating", true); store.setField("boilerLocation", ""); }} className="w-4 h-4" />
          <div><p className="text-sm font-medium">Ha, markazlashgan</p></div></label>
        <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${store.isCentralizedHeating === false ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200"}`}>
          <input type="radio" name="ch" checked={store.isCentralizedHeating === false} onChange={() => store.setField("isCentralizedHeating", false)} className="w-4 h-4" />
          <div><p className="text-sm font-medium">Yo&apos;q, alohida kotel</p></div></label>
      </div>
      {store.isCentralizedHeating === false && (
        <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm font-medium mb-3">Kotelxona qayerda?</p>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${store.boilerLocation === "ichki" ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200"}`}>
              <input type="radio" name="bl" checked={store.boilerLocation === "ichki"} onChange={() => store.setField("boilerLocation", "ichki")} className="w-4 h-4" />
              <p className="text-sm font-medium">Uy ichida</p></label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${store.boilerLocation === "tashqi" ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200"}`}>
              <input type="radio" name="bl" checked={store.boilerLocation === "tashqi"} onChange={() => store.setField("boilerLocation", "tashqi")} className="w-4 h-4" />
              <p className="text-sm font-medium">Uy tashqarisida</p></label>
          </div></div>
      )}</div>
  );

  const renderPriceStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Ijara narxi</h3>
      <p className="text-sm text-gray-500 mb-4">Oylik ijara narxini kiriting (so&apos;m)</p>
      <div className="relative">
        <input type="text" inputMode="numeric" value={formatNumber(store.q8Price)}
          onChange={(e) => store.setField("q8Price", unformatNumber(e.target.value))} placeholder="1 000 000" className="input-field pr-14" />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">so&apos;m</span>
      </div></div>
  );

  const renderStudentsCountStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Talabalar soni</h3>
      <p className="text-sm text-gray-500 mb-4">Uyda nechta talaba yashaydi?</p>
      <input type="text" inputMode="numeric" value={store.q8MemberCount}
        onChange={(e) => store.setField("q8MemberCount", e.target.value.replace(/\D/g, ""))} placeholder="1" className="input-field" /></div>
  );

  const renderOwnerStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Uy egasi ma&apos;lumotlari</h3>
      <div className="space-y-4">
        <div><label className="text-sm text-gray-600 mb-1.5 block">Ismi</label>
          <input type="text" value={store.q9OwnerName} onChange={(e) => store.setField("q9OwnerName", e.target.value)} placeholder="To'liq ism" className="input-field" /></div>
        <div><label className="text-sm text-gray-600 mb-1.5 block">Telefoni</label>
          <div className="flex items-center gap-2"><span className="text-gray-500 font-medium whitespace-nowrap">+998</span>
            <input type="tel" inputMode="numeric" value={formatPhone(store.q9OwnerPhone)}
              onChange={(e) => store.setField("q9OwnerPhone", e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="90 123 45 67" className="input-field flex-1" /></div></div>
      </div></div>
  );

  const renderApartmentNumberStep = () => renderFieldStep("Xonadon raqami", "Xonadon raqamini kiriting", "q10ApartmentNumber", store.q10ApartmentNumber);

  const renderAdditionStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Qo&apos;shimcha ma&apos;lumot</h3>
      <p className="text-sm text-gray-500 mb-4">Qo&apos;shimcha izoh (ixtiyoriy)</p>
      <textarea value={store.q10Description} onChange={(e) => store.setField("q10Description", e.target.value)} placeholder="Qo'shimcha ma'lumot..." className="input-field min-h-[100px] resize-none" /></div>
  );

  const renderOrphanStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Mehribonlik uyi tarbiyalanuvchisimisiz?</h3>
      <div className="space-y-3 mb-4">
        {[false, true].map(v => (
          <label key={String(v)} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${store.isOrphan === v ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <input type="radio" name="orphan" checked={store.isOrphan === v} onChange={() => {
              store.setField("isOrphan", v);
              if (!v) { store.setField("orphanType", ""); store.setField("orphanCertificate", null); store.setField("guardianGender", ""); store.setField("guardianPhone", ""); store.setField("governorDecision", null); }
            }} className="w-4 h-4" /><span className="text-sm">{v ? "Ha" : "Yo'q"}</span></label>))}
      </div>
      {store.isOrphan && (
        <div className="p-4 bg-purple-50 rounded-xl space-y-4">
          <p className="text-sm font-medium">Turi:</p>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${store.orphanType === "mehribonlikUyi" ? "border-purple-500 bg-purple-50" : "border-purple-200"}`}>
              <input type="radio" name="ot" checked={store.orphanType === "mehribonlikUyi"} onChange={() => store.setField("orphanType", "mehribonlikUyi")} className="w-4 h-4" /><span className="text-sm">Mehribonlik uyi</span></label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-white cursor-pointer transition ${store.orphanType === "vasiylik" ? "border-purple-500 bg-purple-50" : "border-purple-200"}`}>
              <input type="radio" name="ot" checked={store.orphanType === "vasiylik"} onChange={() => store.setField("orphanType", "vasiylik")} className="w-4 h-4" /><span className="text-sm">Vasiylikka qaraydi</span></label>
          </div>
          {store.orphanType === "mehribonlikUyi" && (
            <div><label className="text-sm text-gray-600 mb-1.5 block">Guvohnoma (rasm yoki PDF)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => store.setField("orphanCertificate", e.target.files?.[0] || null)} className="input-field" />
              {store.orphanCertificate && <p className="text-xs text-green-600 mt-1">Fayl: {store.orphanCertificate.name}</p>}</div>
          )}
          {store.orphanType === "vasiylik" && (
            <div className="space-y-3">
              <div><label className="text-sm text-gray-600 mb-1.5 block">Vasiy telefoni</label>
                <div className="flex items-center gap-2"><span className="text-gray-500 font-medium whitespace-nowrap">+998</span>
                  <input type="tel" inputMode="numeric" value={formatPhone(store.guardianPhone)}
                    onChange={(e) => store.setField("guardianPhone", e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="90 123 45 67" className="input-field flex-1" /></div></div>
              <div><label className="text-sm text-gray-600 mb-1.5 block">Hokim qarori (rasm yoki PDF)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => store.setField("governorDecision", e.target.files?.[0] || null)} className="input-field" />
                {store.governorDecision && <p className="text-xs text-green-600 mt-1">Fayl: {store.governorDecision.name}</p>}</div>
            </div>
          )}
        </div>
      )}</div>
  );

  const renderDisabilityStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Nogironligingiz bormi?</h3>
      <div className="space-y-3 mb-4">
        {[false, true].map(v => (
          <label key={String(v)} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${store.hasDisability === v ? "border-[#5B6CF8] bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <input type="radio" name="dis" checked={store.hasDisability === v} onChange={() => {
              store.setField("hasDisability", v);
              if (!v) { store.setField("disabilityCategory", null); store.setField("disabilityType", ""); store.setField("disabilityCertificate", null); store.setField("disabilityCertificateExpiry", ""); }
            }} className="w-4 h-4" /><span className="text-sm">{v ? "Ha" : "Yo'q"}</span></label>))}
      </div>
      {store.hasDisability && (
        <div className="p-4 bg-orange-50 rounded-xl space-y-4">
          <div><p className="text-sm font-medium mb-3">Guruh:</p>
            <div className="flex gap-2">
              {[1, 2, 3].map(c => (
                <label key={c} className={`flex-1 p-3 rounded-xl border-2 cursor-pointer text-center transition ${store.disabilityCategory === c ? "border-orange-500 bg-orange-100" : "border-orange-200"}`}>
                  <input type="radio" name="dc" checked={store.disabilityCategory === c} onChange={() => store.setField("disabilityCategory", c)} className="hidden" />
                  <span className="text-lg font-bold">{c}</span><p className="text-xs text-gray-500">guruh</p></label>))}
            </div></div>
          <div><label className="text-sm text-gray-600 mb-1.5 block">Kasallik turi</label>
            <input type="text" value={store.disabilityType} onChange={(e) => store.setField("disabilityType", e.target.value)} placeholder="Kasallik turini kiriting" className="input-field" /></div>
          <div><label className="text-sm text-gray-600 mb-1.5 block">Spravka (rasm yoki PDF)</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => store.setField("disabilityCertificate", e.target.files?.[0] || null)} className="input-field" />
            {store.disabilityCertificate && <p className="text-xs text-green-600 mt-1">Fayl: {store.disabilityCertificate.name}</p>}</div>
          {store.disabilityCategory && store.disabilityCategory !== 1 && (
            <div><label className="text-sm text-gray-600 mb-1.5 block">Spravka muddati</label>
              <input type="date" value={store.disabilityCertificateExpiry} onChange={(e) => store.setField("disabilityCertificateExpiry", e.target.value)} className="input-field" />
              <p className="text-xs text-gray-400 mt-1">2 va 3 guruh uchun muddat kerak</p></div>
          )}
          {store.disabilityCategory === 1 && <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">1-guruh muddatsiz</p>}
        </div>
      )}</div>
  );

  const renderNotebooksStep = () => (
    <div><h3 className="text-lg font-semibold mb-2">Daftarlarga kiritilganmisiz?</h3>
      <p className="text-sm text-gray-500 mb-4">Tegishli daftarlarga belgi qo&apos;ying va hujjatni yuklang</p>
      <div className="space-y-4">
        {([
          { field: "youthNotebook", docField: "youthNotebookDoc", label: "Yoshlar daftari", val: store.youthNotebook, doc: store.youthNotebookDoc },
          { field: "womenNotebook", docField: "womenNotebookDoc", label: "Xotin-qizlar daftari", val: store.womenNotebook, doc: store.womenNotebookDoc },
          { field: "poorNotebook", docField: "poorNotebookDoc", label: "Kambag'al daftari", val: store.poorNotebook, doc: store.poorNotebookDoc },
        ] as const).map(nb => (
          <div key={nb.field} className="p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={nb.val} onChange={(e) => {
                if (e.target.checked) store.setField("noNotebooks", false);
                store.setField(nb.field, e.target.checked);
                if (!e.target.checked) store.setField(nb.docField, null);
              }} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium">{nb.label}</span></label>
            {nb.val && (
              <div className="mt-3"><input type="file" accept="image/*,.pdf" onChange={(e) => store.setField(nb.docField, e.target.files?.[0] || null)} className="input-field" />
                {nb.doc && <p className="text-xs text-green-600 mt-1">Fayl: {(nb.doc as File).name}</p>}</div>
            )}
          </div>
        ))}
        <div className="p-4 bg-gray-50 rounded-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={store.noNotebooks} onChange={(e) => {
              store.setField("noNotebooks", e.target.checked);
              if (e.target.checked) {
                store.setField("youthNotebook", false); store.setField("youthNotebookDoc", null);
                store.setField("womenNotebook", false); store.setField("womenNotebookDoc", null);
                store.setField("poorNotebook", false); store.setField("poorNotebookDoc", null);
              }
            }} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium">Yo&apos;q</span></label>
        </div>
      </div></div>
  );

  if (!typeFromUrl && permission) return <div className="flex items-center justify-center min-h-screen"><div className="loading-spinner" /></div>;
  if (!permission) return <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4"><p className="text-gray-500 mb-4">Permission ID topilmadi</p><button onClick={() => router.push("/student/home")} className="btn-primary">Bosh sahifaga</button></div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8 pb-10 pt-6 bg-gradient-to-t from-black/70 to-transparent">
            <button type="button" onClick={closeCamera}
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button type="button" onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 flex items-center justify-center active:scale-95 transition">
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
            <div className="w-14 h-14" />
          </div>
        </div>
      )}
      <Header title={`Qadam ${step} / ${totalSteps}`} />
      <div className="px-4 pt-3"><div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-full bg-gradient-to-r from-[#5B6CF8] to-[#7B5BF8] rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div></div>
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        {renderStep()}
      </div>
      <div className="px-4 pb-6 flex gap-3">
        {step > 1 && <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium">Orqaga</button>}
        {step < totalSteps ? (
          <button onClick={handleNext} className="flex-1 btn-primary">Keyingi</button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className={`flex-1 btn-primary ${loading ? "opacity-50 pointer-events-none" : ""}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Yuborilmoqda...
              </span>
            ) : "Yuborish"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuestionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="loading-spinner border-[#5B6CF8] border-t-transparent" style={{borderWidth: 3, width: 40, height: 40}} /></div>}>
      <QuestionContent />
    </Suspense>
  );
}
