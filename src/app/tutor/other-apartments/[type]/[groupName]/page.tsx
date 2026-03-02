"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

const typeLabels: Record<string, string> = {
  littleHouse: "O'z uyi",
  relative: "Qarindosh uyi",
  bedroom: "Institut yotoqxonasi",
};

function OtherApartmentsStudentsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const groupName = decodeURIComponent(params.groupName as string);
  const permissionId = searchParams.get("pid") || "";

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permissionId) { setLoading(false); return; }
    mainService.getApartmentsByType(permissionId, type)
      .then((res) => {
        const items = res.data || [];
        const filtered = items.filter(
          (item: any) => (item.student?.group?.name || "Noma'lum") === groupName
        );
        setStudents(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [permissionId, type, groupName]);

  const getImg = (img: string | undefined) => {
    if (!img) return "/default-avatar.svg";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={groupName} />
      <div className="px-4 py-4">
        <p className="text-xs text-gray-500 mb-3">{typeLabels[type] || type} — {students.length} ta talaba</p>
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <div className="space-y-3">
            {students.map((item: any, i: number) => {
              const s = item.student;
              const apt = item.appartment;
              return (
                <div
                  key={apt?._id || i}
                  className="card flex items-center gap-3 cursor-pointer"
                  onClick={() => s?._id && router.push(`/tutor/student-status/${s._id}?aptId=${apt?._id}`)}
                >
                  <img
                    src={getImg(s?.image)}
                    alt={s?.full_name}
                    className="w-11 h-11 rounded-full object-cover bg-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s?.full_name}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OtherApartmentsStudentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loading /></div>}>
      <OtherApartmentsStudentsContent />
    </Suspense>
  );
}
