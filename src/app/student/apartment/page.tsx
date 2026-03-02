"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { ExistApartmentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

function ApartmentContent() {
  const router = useRouter();
  useAuthGuard();
  const searchParams = useSearchParams();
  const appartmentId = searchParams.get("appartmentId");
  const permissionId = searchParams.get("permissionId");
  
  const [data, setData] = useState<ExistApartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState<string | null>(null);

  useEffect(() => {
    if (!appartmentId && !permissionId) {
      setLoading(false);
      return;
    }
    
    mainService
      .getExistApartment({ appartmentId: appartmentId || undefined, permissionId: permissionId || undefined })
      .then((res) => {
        setData(res.data || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appartmentId, permissionId]);

  const getImg = (p: string) => (p.startsWith("http") ? p : BASE_URL + p);

  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    green: { label: "Tasdiqlangan", bg: "bg-[rgba(34,197,94,0.1)]", text: "text-[#22C55E]" },
    yellow: { label: "Kutilmoqda", bg: "bg-[rgba(245,158,11,0.1)]", text: "text-[#F59E0B]" },
    red: { label: "Qayta to'ldiring", bg: "bg-[rgba(239,68,68,0.1)]", text: "text-[#EF4444]" },
    blue: { label: "Ko'rib chiqilmoqda", bg: "bg-[rgba(59,130,246,0.1)]", text: "text-[#3B82F6]" },
    "Being checked": { label: "Tekshirilmoqda", bg: "bg-[rgba(59,130,246,0.1)]", text: "text-[#3B82F6]" },
  };

  const getStatus = (s: string) => statusMap[s] || { label: s, bg: "bg-gray-100", text: "text-gray-700" };

  const overallStatus = getStatus(data?.status || "");

  const typeLabels: Record<string, string> = {
    tenant: "Ijarachi",
    relative: "Qarindosh",
    littleHouse: "Xususiy uy",
    bedroom: "Yotoqxona",
  };

  if (loading) return <><Header title="Ijara ma'lumotlari" /><Loading /></>;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F6FA]">
        <Header title="Ijara ma'lumotlari" />
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/>
          </svg>
          <p className="mt-4 text-[#9E9E9E] text-sm text-center">Ijara ma'lumotlari topilmadi</p>
          <button onClick={() => router.back()} className="mt-6 px-6 py-2.5 rounded-xl bg-[#0259EF] text-white text-sm font-medium">
            Orqaga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header title="Ijara ma'lumotlari" />

      <div className="px-4 py-4 space-y-3 pb-8">

        {/* Overall Status Card */}
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Umumiy holat</h3>
            <span className={"px-3 py-1 rounded-full text-xs font-bold " + overallStatus.bg + " " + overallStatus.text}>
              {overallStatus.label}
            </span>
          </div>
        </div>

        {/* Address & Details */}
        <div className="card space-y-3">
          <h3 className="text-sm font-bold text-[#1A1A2E]">Manzil</h3>

          {data.fullAddress && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[rgba(2,89,239,0.08)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0259EF"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <p className="text-xs text-[#9E9E9E]">To'liq manzil</p>
                <p className="text-sm text-[#1A1A2E]">{data.fullAddress}</p>
              </div>
            </div>
          )}

          {(data.region || data.district) && (
            <div className="flex gap-4">
              {data.region && (
                <div className="flex-1">
                  <p className="text-xs text-[#9E9E9E]">Viloyat</p>
                  <p className="text-sm text-[#1A1A2E] font-medium">{data.region}</p>
                </div>
              )}
              {data.district && (
                <div className="flex-1">
                  <p className="text-xs text-[#9E9E9E]">Tuman</p>
                  <p className="text-sm text-[#1A1A2E] font-medium">{data.district}</p>
                </div>
              )}
            </div>
          )}

          {(data.typeOfAppartment || data.typeAppartment) && (
            <div>
              <p className="text-xs text-[#9E9E9E]">Turar joy turi</p>
              <p className="text-sm text-[#1A1A2E] font-medium">{typeLabels[data.typeOfAppartment || data.typeAppartment || ""] || data.typeOfAppartment || data.typeAppartment}</p>
            </div>
          )}

          {data.bedroom && data.bedroom.bedroomNumber && (
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#9E9E9E]">Yotoqxona raqami</p>
                <p className="text-sm text-[#1A1A2E] font-medium">{data.bedroom.bedroomNumber}</p>
              </div>
              {data.bedroom.roomNumber && (
                <div className="flex-1">
                  <p className="text-xs text-[#9E9E9E]">Xona raqami</p>
                  <p className="text-sm text-[#1A1A2E] font-medium">{data.bedroom.roomNumber}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Owner Info */}
        {(data.appartmentOwnerName || data.appartmentOwnerPhone) && (
          <div className="card space-y-3">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Uy egasi</h3>
            {data.appartmentOwnerName && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[rgba(2,89,239,0.08)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0259EF"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div>
                  <p className="text-xs text-[#9E9E9E]">Ismi</p>
                  <p className="text-sm text-[#1A1A2E] font-medium">{data.appartmentOwnerName}</p>
                </div>
              </div>
            )}
            {data.appartmentOwnerPhone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[rgba(34,197,94,0.08)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div>
                  <p className="text-xs text-[#9E9E9E]">Telefon</p>
                  <a href={"tel:" + data.appartmentOwnerPhone} className="text-sm text-[#0259EF] font-medium">{data.appartmentOwnerPhone}</a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boiler Image */}
        {data.boilerImage && data.boilerImage.url && (
          <ImageCard
            title="Isitish qurilmasi"
            imageUrl={getImg(data.boilerImage.url)}
            status={getStatus(data.boilerImage.status)}
            onImageClick={() => setShowImage(getImg(data.boilerImage!.url))}
          />
        )}

        {/* Gas Stove */}
        {data.gazStove && data.gazStove.url && (
          <ImageCard
            title="Gaz plitasi"
            imageUrl={getImg(data.gazStove.url)}
            status={getStatus(data.gazStove.status)}
            onImageClick={() => setShowImage(getImg(data.gazStove!.url))}
          />
        )}

        {/* Chimney */}
        {data.chimney && data.chimney.url && (
          <ImageCard
            title="Mo'ri"
            imageUrl={getImg(data.chimney.url)}
            status={getStatus(data.chimney.status)}
            onImageClick={() => setShowImage(getImg(data.chimney!.url))}
          />
        )}

        {/* Additional Image */}
        {data.additionImage && data.additionImage.url && (
          <ImageCard
            title="Qo'shimcha rasm"
            imageUrl={getImg(data.additionImage.url)}
            status={getStatus(data.additionImage.status)}
            onImageClick={() => setShowImage(getImg(data.additionImage!.url))}
          />
        )}

        {/* Contract Image */}
        {data.contractImage && (
          <div className="card">
            <h4 className="text-sm font-bold text-[#1A1A2E] mb-3">Shartnoma</h4>
            <img
              src={getImg(data.contractImage)}
              alt="Shartnoma"
              className="w-full rounded-xl cursor-pointer"
              onClick={() => setShowImage(getImg(data.contractImage!))}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Location */}
        {data.location && data.location.lat && data.location.lat !== "0" && (
          <div className="card">
            <h4 className="text-sm font-bold text-[#1A1A2E] mb-3">Joylashuv</h4>
            <a
              href={"https://maps.google.com/?q=" + data.location.lat + "," + data.location.long}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[rgba(2,89,239,0.08)] rounded-xl"
            >
              <div className="w-10 h-10 bg-[#0259EF] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0259EF]">Google Maps da ko'rish</p>
                <p className="text-xs text-[#9E9E9E]">{data.location.lat}, {data.location.long}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0259EF" className="ml-auto flex-shrink-0"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            </a>
          </div>
        )}

        {/* Action buttons based on status */}
        {data.status === "red" && (
          <button
            onClick={() => router.push("/student/put-image?appartmentId=" + data._id)}
            className="w-full py-3.5 rounded-xl bg-[#EF4444] text-white font-semibold text-sm"
          >
            Rasmlarni qayta yuklash
          </button>
        )}
        {data.status === "yellow" && (
          <button
            onClick={() => router.push("/student/put-image?appartmentId=" + data._id)}
            className="w-full py-3.5 rounded-xl bg-[#F59E0B] text-white font-semibold text-sm"
          >
            Rasmlarni yuklash
          </button>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {showImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setShowImage(null)}>
          <img src={showImage} alt="Full" className="max-w-full max-h-full object-contain" />
          <button onClick={() => setShowImage(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ImageCard({
  title,
  imageUrl,
  status,
  onImageClick,
}: {
  title: string;
  imageUrl: string;
  status: { label: string; bg: string; text: string };
  onImageClick: () => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-[#1A1A2E]">{title}</h4>
        <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-bold " + status.bg + " " + status.text}>
          {status.label}
        </span>
      </div>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded-xl cursor-pointer active:opacity-80 transition-opacity"
        onClick={onImageClick}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

export default function ApartmentPage() {
  return (
    <Suspense fallback={<><Header title="Ijara ma'lumotlari" /><Loading /></>}>
      <ApartmentContent />
    </Suspense>
  );
}
