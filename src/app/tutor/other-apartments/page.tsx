"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

const otherTypes = [
  { value: "littleHouse", label: "O'z uyi", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { value: "relative", label: "Qarindosh uyi", icon: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M20 8v6M23 11h-6M12.5 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { value: "bedroom", label: "Institut yotoqxonasi", icon: "M2 4v16h20V4H2zm18 14H4V6h16v12zM6 10h2v2H6zm0 4h2v2H6zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm4 0h2v2h-2z" },
];

export default function OtherApartmentsPage() {
  const router = useRouter();
  const [permissionId, setPermissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getMyNotice()
      .then((res) => {
        const notices = res.data || [];
        const active = notices.find((n: any) => n.status === "process");
        if (active) setPermissionId(active._id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Boshqa ijara turlari" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : !permissionId ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Faol e'lon topilmadi</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Ijara turini tanlang</p>
            {otherTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => router.push(`/tutor/other-apartments/${t.value}?pid=${permissionId}`)}
                className="card w-full text-left flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(91,108,248,0.1)] flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B6CF8" strokeWidth="1.5">
                    <path d={t.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[15px] text-[#1A1A2E]">{t.label}</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
