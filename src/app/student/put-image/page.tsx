"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";

export default function StudentPutImagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <StudentPutImageContent />
    </Suspense>
  );
}

function StudentPutImageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useAuthGuard();
  const { studentId } = useAuthStore();
  const [boilerImage, setBoilerImage] = useState<File | null>(null);
  const [gasImage, setGasImage] = useState<File | null>(null);
  const [chimneyImage, setChimneyImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appartmentId, setAppartmentId] = useState(searchParams.get("apartmentId") || "");
  const needData = searchParams.get("needData") || "";

  // needData bo'yicha qaysi rasmlar kerakligini aniqlash
  const showBoiler = !needData || needData.includes("Isitish qurilmasi");
  const showGas = !needData || needData.includes("Gaz plitasi");
  const showChimney = !needData || needData.includes("Mo'ri");

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraField, setCameraField] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    useAuthStore.getState().init();
    // URL dan apartmentId kelgan bo'lsa, API chaqirish shart emas
    if (appartmentId) return;
    if (studentId) {
      mainService.getMyAppartments(studentId)
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data) && data.length > 0) {
            setAppartmentId(data[0]._id);
          } else if (data?._id) {
            setAppartmentId(data._id);
          }
        })
        .catch(console.error);
    }
  }, [studentId, appartmentId]);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraField("");
  }, []);

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
      closeCamera();
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
        if (cameraField === "boiler") setBoilerImage(file);
        else if (cameraField === "gas") setGasImage(file);
        else if (cameraField === "chimney") setChimneyImage(file);
      }
      closeCamera();
    }, "image/jpeg", 0.85);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!boilerImage && !gasImage && !chimneyImage) {
      setError("Kamida bitta rasm tanlang");
      return;
    }
    if (!appartmentId) {
      setError("Kvartira topilmadi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (boilerImage) formData.append("boilerImage", boilerImage);
      if (gasImage) formData.append("gazStove", gasImage);
      if (chimneyImage) formData.append("chimney", chimneyImage);
      await mainService.uploadImage(appartmentId, formData);
      alert("Rasmlar muvaffaqiyatli yuklandi!");
      router.back();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const renderImageField = (label: string, field: string, image: File | null) => (
    <div>
      <label className="text-sm text-gray-600 mb-1.5 block">{label}</label>
      {image ? (
        <div className="relative">
          <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
          <button
            onClick={() => openCamera(field)}
            className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-lg shadow text-gray-700"
          >
            Qayta olish
          </button>
        </div>
      ) : (
        <button
          onClick={() => openCamera(field)}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 active:bg-gray-50"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="text-sm">Kamerani ochish</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Rasmlarni yangilash" />
      <div className="flex-1 px-4 py-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

        {showBoiler && renderImageField("Isitish qurilmasi rasmi", "boiler", boilerImage)}
        {showGas && renderImageField("Gaz plitasi rasmi", "gas", gasImage)}
        {showChimney && renderImageField("Mo'ri rasmi", "chimney", chimneyImage)}
      </div>

      <div className="px-4 pb-6">
        <button onClick={handleSubmit} disabled={loading} className="btn-primary">
          {loading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </div>

      {/* Camera Overlay */}
      {cameraActive && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="flex-1 object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 pb-10 pt-6 flex items-center justify-center gap-8 bg-gradient-to-t from-black/80 to-transparent">
            <button onClick={closeCamera} className="text-white/80 text-sm font-medium px-4 py-2">
              Bekor qilish
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full border-4 border-white bg-white/20 active:bg-white/40"
            />
            <div className="w-16" />
          </div>
        </div>
      )}
    </div>
  );
}
