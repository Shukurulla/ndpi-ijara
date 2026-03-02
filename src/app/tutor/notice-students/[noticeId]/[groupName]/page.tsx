"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { MyNoticeStudentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

const apartmentTypeLabels: Record<string, string> = {
  tenant: "Ijara",
  relative: "Qarindosh uyi",
  littleHouse: "O'z uyi",
  bedroom: "Yotoqxona",
};

const statusLabels: Record<string, string> = {
  green: "Yashil",
  yellow: "Sariq",
  red: "Qizil",
  "Being checked": "Tekshirilmoqda",
};

const statusColors: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  "Being checked": "bg-blue-100 text-blue-700",
};

function NoticeStudentsContent() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  const groupName = decodeURIComponent(params.groupName as string);
  const [students, setStudents] = useState<MyNoticeStudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getMyNoticeStudents(noticeId, groupName)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [noticeId, groupName]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={groupName} />
      <div className="flex-1 px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <div className="space-y-3">
            {students.map((s) => {
              const studentId = s.student?._id;
              const imgSrc = s.student?.image
                ? (s.student.image.startsWith("http") ? s.student.image : `${BASE_URL}${s.student.image}`)
                : "/default-avatar.svg";
              const apt = s.appartment;
              const aptType = (apt as any)?.typeAppartment || "";
              const aptStatus = apt?.status || "";
              const hasApartment = !!apt;

              return (
                <div
                  key={studentId || apt?._id}
                  onClick={() => {
                    if (!studentId) return;
                    if (hasApartment) {
                      router.push(`/tutor/student-status/${studentId}${apt?._id ? `?aptId=${apt._id}` : ""}`);
                    }
                  }}
                  className={`card flex items-center gap-3 ${hasApartment ? "cursor-pointer" : ""} transition`}
                >
                  <img
                    src={imgSrc}
                    alt={s.student?.full_name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.student?.full_name}</p>
                    <p className="text-xs text-gray-500">{s.student?.group?.name}</p>
                    {hasApartment ? (
                      <div className="flex items-center gap-2 mt-1">
                        {aptType && <span className="text-xs text-gray-600">{apartmentTypeLabels[aptType] || aptType}</span>}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[aptStatus] || "bg-gray-100 text-gray-600"}`}>
                          {statusLabels[aptStatus] || aptStatus || "Noma'lum"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-red-400 mt-1">Ma'lumot yuborilmagan</p>
                    )}
                  </div>
                  {hasApartment && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NoticeStudentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loading /></div>}>
      <NoticeStudentsContent />
    </Suspense>
  );
}
