"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

const typeLabels: Record<string, string> = {
  littleHouse: "O'z uyi",
  relative: "Qarindosh uyi",
  bedroom: "Institut yotoqxonasi",
};

function OtherApartmentsGroupsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const permissionId = searchParams.get("pid") || "";
  const label = typeLabels[type] || type;

  const [groups, setGroups] = useState<{ name: string; code: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permissionId) { setLoading(false); return; }
    mainService.getApartmentsByType(permissionId, type)
      .then((res) => {
        const items = res.data || [];
        const groupMap: Record<string, { name: string; code: string; count: number }> = {};
        for (const item of items) {
          const gName = item.student?.group?.name || "Noma'lum";
          const gCode = item.student?.group?.id || item.student?.group?.code || gName;
          if (!groupMap[gName]) {
            groupMap[gName] = { name: gName, code: gCode, count: 0 };
          }
          groupMap[gName].count++;
        }
        setGroups(Object.values(groupMap));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [permissionId, type]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={label} />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <button
                key={g.code}
                onClick={() => router.push(`/tutor/other-apartments/${type}/${encodeURIComponent(g.name)}?pid=${permissionId}`)}
                className="card w-full text-left flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(2,89,239,0.1)] flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0259EF">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1A1A2E] truncate">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.count} ta talaba</p>
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

export default function OtherApartmentsGroupsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loading /></div>}>
      <OtherApartmentsGroupsContent />
    </Suspense>
  );
}
