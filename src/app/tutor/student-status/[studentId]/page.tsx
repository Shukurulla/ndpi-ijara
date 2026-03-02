"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { toast } from "@/components/Toast";

export default function TutorStudentStatusPage() {
  return (
    <Suspense fallback={<><Header title="Talaba holati" /><Loading /></>}>
      <TutorStudentStatusContent />
    </Suspense>
  );
}

function TutorStudentStatusContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params.studentId as string;
  const aptId = searchParams.get("aptId");
  const [student, setStudent] = useState<any>(null);
  const [apt, setApt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [boilerStatus, setBoilerStatus] = useState("green");
  const [gasStatus, setGasStatus] = useState("green");
  const [chimneyStatus, setChimneyStatus] = useState("green");
  const [showImage, setShowImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [resendPending, setResendPending] = useState({ boiler: false, gas: false, chimney: false });

  // Task 7: Visit report
  const [visitUploading, setVisitUploading] = useState(false);

  // Task 14: Camera capture for visit report
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Talaba ma'lumotlarini olish
        const studentRes = await mainService.getStudentByStudentId(studentId);
        const studentData = Array.isArray(studentRes.data) ? studentRes.data[0] : studentRes.data;
        setStudent(studentData);

        // Kvartira ma'lumotlarini olish
        const aptRes = await mainService.getMyAppartments(studentId);
        const apartments = aptRes.data || [];
        // Agar aptId berilgan bo'lsa shu appartmentni tanlash, aks holda eng oxirgi aktiv
        const currentApt = (aptId && apartments.find((a: any) => a._id === aptId))
          || apartments.find((a: any) => a.current) || apartments[0] || null;
        setApt(currentApt);

        if (currentApt) {
          if (currentApt.boilerImage?.status) setBoilerStatus(currentApt.boilerImage.status === "Being checked" ? "green" : currentApt.boilerImage.status);
          if (currentApt.gazStove?.status) setGasStatus(currentApt.gazStove.status === "Being checked" ? "green" : currentApt.gazStove.status);
          if (currentApt.chimney?.status) setChimneyStatus(currentApt.chimney.status === "Being checked" ? "green" : currentApt.chimney.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  const handleSubmit = async () => {
    if (!apt) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await mainService.submitCheck({
        appartmentId: apt._id,
        boiler: boilerStatus,
        gazStove: gasStatus,
        chimney: chimneyStatus,
        additionImage: "green",
      } as any);
      // Local state ni yangilash
      if (res.data) setApt(res.data);
      toast("Muvaffaqiyatli saqlandi!", "success");
      router.back();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  // Har bir rasm uchun qayta jo'natish
  const handleResend = async (field: "boiler" | "gas" | "chimney", label: string) => {
    if (!apt) return;
    try {
      await mainService.sendReport({
        userId: studentId,
        message: `Qayta yuklash kerak: ${label}`,
        status: "yellow",
        appartmentId: apt._id,
        need_data: label,
      });
      setResendPending((prev) => ({ ...prev, [field]: true }));
      toast(`"${label}" qayta jo'natish so'rovi yuborildi!`, "success");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast(error.response?.data?.message || "Xatolik yuz berdi", "error");
    }
  };


  // Task 14: Camera capture functions
  const openVisitCamera = async () => {
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
      toast("Kameraga ruxsat berilmadi", "error");
    }
  };

  const captureVisitPhoto = () => {
    if (!videoRef.current || !apt) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      closeVisitCamera();
      setVisitUploading(true);
      try {
        const file = new File([blob], `visit_${Date.now()}.jpg`, { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("visitReportImage", file);
        const res = await mainService.uploadVisitReport(apt._id, formData);
        setApt(res.data);
        toast("Hisobot foto yuklandi!", "success");
      } catch (err) {
        console.error(err);
        toast("Foto yuklashda xatolik!", "error");
      } finally {
        setVisitUploading(false);
      }
    }, "image/jpeg", 0.85);
  };

  const closeVisitCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const getImg = (p: string) => p?.startsWith("http") ? p : `${BASE_URL}${p}`;
  const isPdf = (p: string) => p?.toLowerCase().endsWith(".pdf");
  const viewFile = (p: string) => {
    const url = getImg(p);
    if (isPdf(p)) window.open(url, "_blank");
    else setShowImage(url);
  };

  const statusColors = [
    { value: "green", label: "Yashil", bg: "bg-green-500" },
    { value: "yellow", label: "Sariq", bg: "bg-yellow-500" },
    { value: "red", label: "Qizil", bg: "bg-red-500" },
  ];

  if (loading) return <><Header title="Talaba holati" /><Loading /></>;
  if (!student) return <><Header title="Talaba holati" /><div className="p-4 text-gray-500">Talaba topilmadi</div></>;
  if (!apt) return <><Header title="Talaba holati" /><div className="p-4 text-gray-500">Kvartira ma&apos;lumotlari topilmadi</div></>;

  const isTenant = apt.typeAppartment === "tenant";
  const isLittleHouse = apt.typeAppartment === "littleHouse";
  const isAlreadyChecked = apt.status === "green" || apt.status === "yellow" || apt.status === "red";
  const canEdit = isTenant && !isAlreadyChecked;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Task 14: Camera overlay */}
      {cameraActive && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col">
          <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8 pb-10 pt-6 bg-gradient-to-t from-black/70 to-transparent">
            <button type="button" onClick={closeVisitCamera}
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button type="button" onClick={captureVisitPhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 flex items-center justify-center active:scale-95 transition">
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
            <div className="w-14 h-14" />
          </div>
        </div>
      )}
      <Header title="Talaba holati" />

      <div className="px-4 py-4 space-y-4">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

        {/* Student Info */}
        <div className="card flex items-center gap-3">
          <img
            src={student.image ? getImg(student.image) : "/default-avatar.svg"}
            alt={student.full_name}
            className="w-12 h-12 rounded-full object-cover bg-gray-200"
            onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
          />
          <div>
            <p className="font-medium text-sm">{student.full_name}</p>
            <p className="text-xs text-gray-500">{student.group?.name}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              apt.status === "green" ? "bg-green-100 text-green-700" :
              apt.status === "yellow" ? "bg-yellow-100 text-yellow-700" :
              apt.status === "red" ? "bg-red-100 text-red-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {apt.typeAppartment === "tenant" ? "Ijarada" :
               apt.typeAppartment === "relative" ? "Qarindosh" :
               apt.typeAppartment === "littleHouse" ? "O'z uyi" : "Yotoqxona"}
            </span>
          </div>
        </div>

        {/* Asosiy ma'lumotlar */}
        <div className="card">
          <h4 className="text-sm font-semibold mb-3">Asosiy ma&apos;lumotlar</h4>
          <div className="space-y-2 text-sm">
            {apt.studentPhoneNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Telefon:</span>
                <a href={`tel:${apt.studentPhoneNumber}`} className="font-medium text-[#4776E6]">{apt.studentPhoneNumber}</a>
              </div>
            )}
            {apt.district && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mahalla:</span>
                <span className="font-medium">{apt.district}</span>
              </div>
            )}
            {apt.fullAddress && (
              <div className="flex justify-between">
                <span className="text-gray-500">Manzil:</span>
                <span className="font-medium text-right max-w-[200px]">{apt.fullAddress}</span>
              </div>
            )}
            {apt.appartmentOwnerName && (
              <div className="flex justify-between">
                <span className="text-gray-500">Uy egasi:</span>
                <span className="font-medium">{apt.appartmentOwnerName}</span>
              </div>
            )}
            {apt.appartmentOwnerPhone && (
              <div className="flex justify-between">
                <span className="text-gray-500">Uy egasi tel:</span>
                <a href={`tel:${apt.appartmentOwnerPhone}`} className="font-medium text-[#4776E6]">{apt.appartmentOwnerPhone}</a>
              </div>
            )}
            {apt.typeOfBoiler && (
              <div className="flex justify-between">
                <span className="text-gray-500">Isitish turi:</span>
                <span className="font-medium">{apt.typeOfBoiler}</span>
              </div>
            )}
            {apt.priceAppartment && (
              <div className="flex justify-between">
                <span className="text-gray-500">Narxi:</span>
                <span className="font-medium">{Number(apt.priceAppartment).toLocaleString()} so&apos;m</span>
              </div>
            )}
            {apt.numberOfStudents && (
              <div className="flex justify-between">
                <span className="text-gray-500">Talabalar soni:</span>
                <span className="font-medium">{apt.numberOfStudents}</span>
              </div>
            )}
            {apt.bedroom?.bedroomNumber && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Yotoqxona:</span>
                  <span className="font-medium">{apt.bedroom.bedroomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Xona:</span>
                  <span className="font-medium">{apt.bedroom.roomNumber}</span>
                </div>
              </>
            )}
            {apt.description && (
              <div className="flex justify-between">
                <span className="text-gray-500">Izoh:</span>
                <span className="font-medium text-right max-w-[200px]">{apt.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Task 5-6: Markazlashgan kotelxona */}
        {(isTenant || isLittleHouse) && (
          <div className="card">
            <h4 className="text-sm font-semibold mb-3">Isitish tizimi</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Markazlashgan:</span>
                <span className={`font-medium ${apt.isCentralizedHeating ? "text-green-600" : "text-gray-700"}`}>
                  {apt.isCentralizedHeating ? "Ha" : "Yo'q"}
                </span>
              </div>
              {!apt.isCentralizedHeating && apt.boilerLocation && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kotelxona joyi:</span>
                  <span className="font-medium">
                    {apt.boilerLocation === "ichki" ? "Ishtema (ichki)" : "Sirtama (tashqi)"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task 2: Yetimlik */}
        {apt.isOrphan && (
          <div className="card border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-lg">&#9829;</div>
              <h4 className="text-sm font-semibold text-purple-700">Mehribonlik uyi tarbiyalanuvchisi</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Turi:</span>
                <span className="font-medium">
                  {apt.orphanType === "mehribonlikUyi" ? "Mehribonlik uyi" : apt.orphanType === "vasiylik" ? "Vasiylik" : "-"}
                </span>
              </div>
              {apt.orphanType === "vasiylik" && (
                <>
                  {apt.guardianGender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Jinsi:</span>
                      <span className="font-medium">{apt.guardianGender === "ogil" ? "O'g'il" : "Qiz"}</span>
                    </div>
                  )}
                  {apt.guardianPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vasiy telefoni:</span>
                      <a href={`tel:${apt.guardianPhone}`} className="font-medium text-[#4776E6]">{apt.guardianPhone}</a>
                    </div>
                  )}
                  {apt.governorDecision && (
                    <button onClick={() => viewFile(apt.governorDecision)} className="mt-2 w-full py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium">
                      Hokim qarorini ko&apos;rish
                    </button>
                  )}
                </>
              )}
              {apt.orphanType === "mehribonlikUyi" && apt.orphanCertificate && (
                <button onClick={() => viewFile(apt.orphanCertificate)} className="mt-2 w-full py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium">
                  Guvohnomani ko&apos;rish
                </button>
              )}
            </div>
          </div>
        )}

        {/* Task 3: Nogironlik */}
        {apt.hasDisability && (
          <div className="card border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-lg">&#9888;</div>
              <h4 className="text-sm font-semibold text-orange-700">Nogironlik</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Toifa:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  apt.disabilityCategory === 1 ? "bg-red-100 text-red-700" :
                  apt.disabilityCategory === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {apt.disabilityCategory}-toifa
                </span>
              </div>
              {apt.disabilityType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kasallik turi:</span>
                  <span className="font-medium">{apt.disabilityType}</span>
                </div>
              )}
              {apt.disabilityCertificateExpiry && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Spravka muddati:</span>
                  <span className="font-medium">{new Date(apt.disabilityCertificateExpiry).toLocaleDateString("uz")}</span>
                </div>
              )}
              {apt.disabilityCategory === 1 && (
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Muddatsiz</p>
              )}
              {apt.disabilityCertificate && (
                <button onClick={() => viewFile(apt.disabilityCertificate)} className="mt-2 w-full py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
                  Spravkani ko&apos;rish
                </button>
              )}
            </div>
          </div>
        )}

        {/* Task 4: Daftarlar */}
        {(apt.youthNotebook || apt.womenNotebook || apt.poorNotebook) && (
          <div className="card border-l-4 border-l-teal-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-lg">&#128214;</div>
              <h4 className="text-sm font-semibold text-teal-700">Daftarlar</h4>
            </div>
            <div className="space-y-2 text-sm">
              {apt.youthNotebook && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Yoshlar daftari</span>
                    <span className="text-green-600 text-xs font-medium">Ha</span>
                  </div>
                  {apt.youthNotebookDoc && (
                    <button onClick={() => viewFile(apt.youthNotebookDoc)} className="mt-1.5 w-full py-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
                      Hujjatni ko&apos;rish
                    </button>
                  )}
                </div>
              )}
              {apt.womenNotebook && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Xotin-qizlar daftari</span>
                    <span className="text-green-600 text-xs font-medium">Ha</span>
                  </div>
                  {apt.womenNotebookDoc && (
                    <button onClick={() => viewFile(apt.womenNotebookDoc)} className="mt-1.5 w-full py-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
                      Hujjatni ko&apos;rish
                    </button>
                  )}
                </div>
              )}
              {apt.poorNotebook && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Kambag&apos;al daftari</span>
                    <span className="text-green-600 text-xs font-medium">Ha</span>
                  </div>
                  {apt.poorNotebookDoc && (
                    <button onClick={() => viewFile(apt.poorNotebookDoc)} className="mt-1.5 w-full py-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
                      Hujjatni ko&apos;rish
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Boiler Image */}
        {apt.boilerImage?.url && (
          <ImageStatusCard
            title="Isitish qurilmasi"
            image={getImg(apt.boilerImage.url)}
            status={boilerStatus}
            onStatusChange={canEdit && !resendPending.boiler ? setBoilerStatus : undefined}
            onImageClick={() => setShowImage(getImg(apt.boilerImage.url))}
            statusColors={statusColors}
            readOnly={!canEdit || resendPending.boiler}
            resendPending={resendPending.boiler}
            onResend={canEdit ? () => handleResend("boiler", "Isitish qurilmasi") : undefined}
          />
        )}

        {/* Gas Stove */}
        {apt.gazStove?.url && (
          <ImageStatusCard
            title="Gaz plitasi"
            image={getImg(apt.gazStove.url)}
            status={gasStatus}
            onStatusChange={canEdit && !resendPending.gas ? setGasStatus : undefined}
            onImageClick={() => setShowImage(getImg(apt.gazStove.url))}
            statusColors={statusColors}
            readOnly={!canEdit || resendPending.gas}
            resendPending={resendPending.gas}
            onResend={canEdit ? () => handleResend("gas", "Gaz plitasi") : undefined}
          />
        )}

        {/* Chimney */}
        {apt.chimney?.url && (
          <ImageStatusCard
            title="Mo'ri"
            image={getImg(apt.chimney.url)}
            status={chimneyStatus}
            onStatusChange={canEdit && !resendPending.chimney ? setChimneyStatus : undefined}
            onImageClick={() => setShowImage(getImg(apt.chimney.url))}
            statusColors={statusColors}
            readOnly={!canEdit || resendPending.chimney}
            resendPending={resendPending.chimney}
            onResend={canEdit ? () => handleResend("chimney", "Mo'ri") : undefined}
          />
        )}

        {/* Addition Image */}
        {apt.additionImage?.url && (
          <div className="card">
            <h4 className="text-sm font-medium mb-2">Qo&apos;shimcha rasm</h4>
            <img
              src={getImg(apt.additionImage.url)}
              alt="Qo'shimcha"
              className="w-full h-48 object-cover rounded-xl cursor-pointer"
              onClick={() => setShowImage(getImg(apt.additionImage.url))}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Contract */}
        {apt.contract && (
          <div className="card">
            <h4 className="text-sm font-medium mb-2">Shartnoma</h4>
            <div className="flex gap-2">
              {apt.contractImage && (
                <button onClick={() => viewFile(apt.contractImage)} className="flex-1 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                  Rasmni ko&apos;rish
                </button>
              )}
              {apt.contractPdf && (
                <a href={getImg(apt.contractPdf)} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium text-center">
                  PDF ko&apos;rish
                </a>
              )}
            </div>
          </div>
        )}

        {/* Map — qurilma GPS joylashuvi */}
        {apt.geoLocation?.lat && apt.geoLocation?.long && (
          <div className="card">
            <h4 className="text-sm font-medium mb-2">Qurilma joylashuvi</h4>
            <a
              href={`https://maps.google.com/?q=${apt.geoLocation.lat},${apt.geoLocation.long}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium text-center block"
            >
              Google Maps da ko&apos;rish
            </a>
          </div>
        )}

        {/* Task 7: Visit Report Photos */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Borgan isboti (hisobot)</h4>
            <button
              onClick={openVisitCamera}
              disabled={visitUploading}
              className="px-3 py-1.5 rounded-lg header-gradient text-white text-xs font-medium"
            >
              {visitUploading ? "Yuklanmoqda..." : "Rasmga olish"}
            </button>
          </div>
          {apt.visitReportImages && apt.visitReportImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {apt.visitReportImages.map((img: any, i: number) => (
                <div key={i} className="relative">
                  <img
                    src={getImg(img.url)}
                    alt={`Hisobot ${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer"
                    onClick={() => setShowImage(getImg(img.url))}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {new Date(img.uploadedAt).toLocaleDateString("uz")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-xs text-center py-4">Hali hisobot foto yuklanmagan</p>
          )}
        </div>

        {/* Submit button - only for unchecked tenant */}
        {canEdit && (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
            {submitting ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        )}

        {/* Already checked badge */}
        {isTenant && isAlreadyChecked && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-50 border border-green-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span className="text-green-700 font-medium text-sm">Ko&apos;rib chiqilgan</span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setShowImage(null)}>
          <img src={showImage} alt="Full" className="max-w-full max-h-full object-contain" />
          <button onClick={() => setShowImage(null)} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
        </div>
      )}
    </div>
  );
}

function ImageStatusCard({
  title,
  image,
  status,
  onStatusChange,
  onImageClick,
  statusColors,
  readOnly = false,
  resendPending = false,
  onResend,
}: {
  title: string;
  image: string;
  status: string;
  onStatusChange?: (s: string) => void;
  onImageClick: () => void;
  statusColors: { value: string; label: string; bg: string }[];
  readOnly?: boolean;
  resendPending?: boolean;
  onResend?: () => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        {onResend && !resendPending && (
          <button
            onClick={onResend}
            className="text-xs text-orange-600 font-medium px-2 py-1 rounded-lg bg-orange-50 border border-orange-200"
          >
            Qayta jo&apos;natish
          </button>
        )}
        {resendPending && (
          <span className="text-xs text-yellow-700 font-medium px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
            Qayta jo&apos;natish kutilmoqda
          </span>
        )}
      </div>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-xl mb-3 cursor-pointer"
        onClick={onImageClick}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {!readOnly && onStatusChange && (
        <div className="flex gap-2">
          {statusColors.map((c) => (
            <button
              key={c.value}
              onClick={() => onStatusChange(c.value)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                status === c.value
                  ? `${c.bg} text-white`
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      {readOnly && !resendPending && (
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "green" ? "bg-green-100 text-green-700" :
            status === "yellow" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}>
            {status === "green" ? "Yashil" : status === "yellow" ? "Sariq" : "Qizil"}
          </span>
        </div>
      )}
    </div>
  );
}
