"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { ExistApartmentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

export default function ApartmentDetailPage() {
  return (
    <Suspense fallback={<><Header title="Ijara ma'lumotlari" /><Loading /></>}>
      <ApartmentDetailContent />
    </Suspense>
  );
}

function ApartmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const appartmentIdFromQuery = searchParams.get("appartmentId");
  
  const [data, setData] = useState<ExistApartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showImage, setShowImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        if (appartmentIdFromQuery) {
          const res = await mainService.getExistApartment({ appartmentId: appartmentIdFromQuery });
          if (res.data) {
            if (res.data.status === "red") {
              router.replace(`/student/apartment-type/${res.data.permission || id}`);
              return;
            }
            setData(res.data);
            setLoading(false);
            return;
          }
        }
        
        let res = await mainService.getExistApartment({ appartmentId: id });
        if (res.data) {
          if (res.data.status === "red") {
            router.replace(`/student/apartment-type/${res.data.permission || id}`);
            return;
          }
          setData(res.data);
          setLoading(false);
          return;
        }
        
        res = await mainService.getExistApartment({ permissionId: id });
        if (res.data) {
          if (res.data.status === "red") {
            router.replace(`/student/apartment-type/${id}`);
            return;
          }
          setData(res.data);
          setLoading(false);
          return;
        }
        
        setNotFound(true);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, appartmentIdFromQuery, router]);

  const getImg = (p: string) => (p?.startsWith("http") ? p : BASE_URL + p);

  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    green: { label: "Tasdiqlangan", bg: "bg-green-100", text: "text-green-700" },
    yellow: { label: "Sariq zona", bg: "bg-yellow-100", text: "text-yellow-700" },
    red: { label: "Qayta to'ldiring", bg: "bg-red-100", text: "text-red-600" },
    blue: { label: "Ko'rib chiqilmoqda", bg: "bg-blue-100", text: "text-blue-700" },
    "Being checked": { label: "Tekshirilmoqda", bg: "bg-blue-100", text: "text-blue-700" },
  };

  const getStatus = (s: string) => statusMap[s] || { label: s, bg: "bg-gray-100", text: "text-gray-700" };

  const typeLabels: Record<string, string> = {
    tenant: "Ijarachi",
    relative: "Qarindosh",
    littleHouse: "Xususiy uy",
    bedroom: "Yotoqxona",
  };

  useEffect(() => {
    if (!loading && (notFound || !data)) {
      router.replace(`/student/apartment-type/${id}`);
    }
  }, [loading, notFound, data, id, router]);

  if (loading || notFound || !data) {
    return <><Header title="Ijara ma'lumotlari" /><Loading /></>;
  }

  const overallStatus = getStatus(data?.status || "");

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <Header title="Ijara ma'lumotlari" />

      <div className="px-4 py-4 space-y-3 pb-8">
        {/* Overall Status Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Umumiy holat</h3>
            <span className={"px-3 py-1 rounded-full text-xs font-bold " + overallStatus.bg + " " + overallStatus.text}>
              {overallStatus.label}
            </span>
          </div>
        </div>

        {/* Address & Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-800">Manzil</h3>

          {data.fullAddress && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4776E6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">To'liq manzil</p>
                <p className="text-sm text-gray-700">{data.fullAddress}</p>
              </div>
            </div>
          )}

          {(data.region || data.district) && (
            <div className="flex gap-4">
              {data.region && <div className="flex-1"><p className="text-xs text-gray-400">Viloyat</p><p className="text-sm text-gray-700 font-medium">{data.region}</p></div>}
              {data.district && <div className="flex-1"><p className="text-xs text-gray-400">Tuman</p><p className="text-sm text-gray-700 font-medium">{data.district}</p></div>}
            </div>
          )}

          {(data.typeOfAppartment || data.typeAppartment) && (
            <div>
              <p className="text-xs text-gray-400">Turar joy turi</p>
              <p className="text-sm text-gray-700 font-medium">{typeLabels[data.typeOfAppartment || data.typeAppartment || ""] || data.typeOfAppartment || data.typeAppartment}</p>
            </div>
          )}

          {data.bedroom && data.bedroom.bedroomNumber && (
            <div className="flex gap-4">
              <div className="flex-1"><p className="text-xs text-gray-400">Yotoqxona raqami</p><p className="text-sm text-gray-700 font-medium">{data.bedroom.bedroomNumber}</p></div>
              {data.bedroom.roomNumber && <div className="flex-1"><p className="text-xs text-gray-400">Xona raqami</p><p className="text-sm text-gray-700 font-medium">{data.bedroom.roomNumber}</p></div>}
            </div>
          )}
        </div>

        {/* Owner Info */}
        {(data.appartmentOwnerName || data.appartmentOwnerPhone) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Uy egasi</h3>
            {data.appartmentOwnerName && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4776E6"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div><p className="text-xs text-gray-400">Ismi</p><p className="text-sm text-gray-700 font-medium">{data.appartmentOwnerName}</p></div>
              </div>
            )}
            {data.appartmentOwnerPhone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div><p className="text-xs text-gray-400">Telefon</p><a href={"tel:" + data.appartmentOwnerPhone} className="text-sm text-[#4776E6] font-medium">{data.appartmentOwnerPhone}</a></div>
              </div>
            )}
          </div>
        )}

        {/* Isitish tizimi (Task 5-6) */}
        {(data as any).isCentralizedHeating !== undefined && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-gray-800">Isitish tizimi</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Markazlashgan isitish:</span>
              <span className={(data as any).isCentralizedHeating ? "text-green-600 font-medium" : "text-gray-700 font-medium"}>
                {(data as any).isCentralizedHeating ? "Ha" : "Yo'q"}
              </span>
            </div>
            {!(data as any).isCentralizedHeating && (data as any).boilerLocation && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Kotelxona joyi:</span>
                <span className="text-gray-700 font-medium">
                  {(data as any).boilerLocation === "ichki" ? "Ishtema (ichki)" : "Sirtama (tashqi)"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Yetimlik (Task 2) */}
        {(data as any).isOrphan && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-purple-500">
            <h3 className="text-sm font-bold text-purple-700 mb-2">Mehribonlik uyi tarbiyalanuvchisi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Turi:</span>
                <span className="font-medium">{(data as any).orphanType === "mehribonlikUyi" ? "Mehribonlik uyi" : "Vasiylik"}</span>
              </div>
              {(data as any).orphanType === "vasiylik" && (data as any).guardianPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Vasiy telefoni:</span>
                  <a href={"tel:" + (data as any).guardianPhone} className="text-[#4776E6] font-medium">{(data as any).guardianPhone}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nogironlik (Task 3) */}
        {(data as any).hasDisability && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-orange-500">
            <h3 className="text-sm font-bold text-orange-700 mb-2">Nogironlik</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Toifa:</span>
                <span className={"px-3 py-1 rounded-full text-xs font-bold " + ((data as any).disabilityCategory === 1 ? "bg-red-100 text-red-700" : (data as any).disabilityCategory === 2 ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700")}>
                  {(data as any).disabilityCategory}-toifa
                </span>
              </div>
              {(data as any).disabilityType && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Kasallik turi:</span>
                  <span className="font-medium">{(data as any).disabilityType}</span>
                </div>
              )}
              {(data as any).disabilityCategory === 1 && <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Muddatsiz</p>}
              {(data as any).disabilityCertificateExpiry && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Muddat:</span>
                  <span className="font-medium">{new Date((data as any).disabilityCertificateExpiry).toLocaleDateString("uz")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daftarlar (Task 4) */}
        {((data as any).youthNotebook || (data as any).womenNotebook || (data as any).poorNotebook) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-l-teal-500">
            <h3 className="text-sm font-bold text-teal-700 mb-2">Daftarlar</h3>
            <div className="space-y-2 text-sm">
              {(data as any).youthNotebook && <div className="flex justify-between"><span className="text-gray-400">Yoshlar daftari</span><span className="text-green-600 font-medium">Ha</span></div>}
              {(data as any).womenNotebook && <div className="flex justify-between"><span className="text-gray-400">Xotin-qizlar daftari</span><span className="text-green-600 font-medium">Ha</span></div>}
              {(data as any).poorNotebook && <div className="flex justify-between"><span className="text-gray-400">Kambag&#39;al daftari</span><span className="text-green-600 font-medium">Ha</span></div>}
            </div>
          </div>
        )}

                {/* Images */}
        {data.boilerImage && data.boilerImage.url && <ImageCard title="Isitish qurilmasi" imageUrl={getImg(data.boilerImage.url)} status={getStatus(data.boilerImage.status)} onImageClick={() => setShowImage(getImg(data.boilerImage!.url))} />}
        {data.gazStove && data.gazStove.url && <ImageCard title="Gaz plitasi" imageUrl={getImg(data.gazStove.url)} status={getStatus(data.gazStove.status)} onImageClick={() => setShowImage(getImg(data.gazStove!.url))} />}
        {data.chimney && data.chimney.url && <ImageCard title="Mo'ri" imageUrl={getImg(data.chimney.url)} status={getStatus(data.chimney.status)} onImageClick={() => setShowImage(getImg(data.chimney!.url))} />}
        {data.additionImage && data.additionImage.url && <ImageCard title="Qo'shimcha rasm" imageUrl={getImg(data.additionImage.url)} status={getStatus(data.additionImage.status)} onImageClick={() => setShowImage(getImg(data.additionImage!.url))} />}

        {/* Contract */}
        {data.contractImage && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Shartnoma</h4>
            <img src={getImg(data.contractImage)} alt="Shartnoma" className="w-full rounded-xl cursor-pointer" onClick={() => setShowImage(getImg(data.contractImage!))} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}

        {/* Location */}
        {data.location && data.location.lat && data.location.lat !== "0" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Joylashuv</h4>
            <a href={"https://maps.google.com/?q=" + data.location.lat + "," + data.location.long} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-[#4776E6] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div><p className="text-sm font-medium text-[#4776E6]">Google Maps da ko'rish</p><p className="text-xs text-gray-400">{data.location.lat}, {data.location.long}</p></div>
            </a>
          </div>
        )}

        {/* Yellow status - rasmlarni yuklash */}
        {data.status === "yellow" && (
          <button onClick={() => router.push("/student/put-image?appartmentId=" + data._id)} className="w-full py-3.5 rounded-xl bg-yellow-500 text-white font-medium text-sm">
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

function ImageCard({ title, imageUrl, status, onImageClick }: { title: string; imageUrl: string; status: { label: string; bg: string; text: string }; onImageClick: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-bold " + status.bg + " " + status.text}>{status.label}</span>
      </div>
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-xl cursor-pointer active:opacity-80 transition-opacity" onClick={onImageClick} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    </div>
  );
}
