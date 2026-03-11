"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { MyNoticeStudentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const [confirmTarget, setConfirmTarget] = useState<{ studentId: string; name: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = () => {
    mainService.getMyNoticeStudents(noticeId, groupName)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [noticeId, groupName]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Duplikat studentlarni olib tashlash (apartmenti bor student ustunlik oladi)
  const deduped = (() => {
    const map = new Map<string, MyNoticeStudentData>();
    for (const s of students) {
      const name = s.student?.full_name;
      if (!name) continue;
      const existing = map.get(name);
      if (!existing || (!existing.appartment && s.appartment)) {
        map.set(name, s);
      }
    }
    return Array.from(map.values());
  })();

  const submitted = deduped.filter((s) => !!s.appartment);
  const notSubmitted = deduped.filter((s) => !s.appartment);

  const handleResend = async () => {
    if (!confirmTarget) return;
    setSending(true);
    try {
      await mainService.sendNoticeSelectStudents({
        students: [{ studentId: confirmTarget.studentId, permissionId: noticeId }],
      });
      setToast({ message: "Qayta topshirish so'rovi yuborildi", type: "success" });
      setLoading(true);
      fetchData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setToast({ message: e.response?.data?.message || "Xatolik yuz berdi", type: "error" });
    } finally {
      setSending(false);
      setConfirmTarget(null);
    }
  };

  const renderStudentCard = (s: MyNoticeStudentData, showResend: boolean) => {
    const studentId = s.student?._id;
    const imgSrc = s.student?.image
      ? (s.student.image.startsWith("http") ? s.student.image : `${BASE_URL}${s.student.image}`)
      : "/default-avatar.svg";
    const apt = s.appartment;
    const aptType = apt?.typeAppartment || "";
    const aptStatus = apt?.status || "";
    const hasApartment = !!apt;

    return (
      <div
        key={studentId || Math.random().toString()}
        className="card flex items-center gap-3 transition"
      >
        <div
          className={`flex items-center gap-3 flex-1 min-w-0 ${hasApartment ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (!studentId || !hasApartment) return;
            router.push(`/tutor/student-status/${studentId}${apt?._id ? `?aptId=${apt._id}` : ""}`);
          }}
        >
          <img
            src={imgSrc}
            alt={s.student?.full_name}
            className="w-10 h-10 rounded-full object-cover bg-gray-200 shrink-0"
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
              <p className="text-xs text-red-400 mt-1">Ma&apos;lumot yuborilmagan</p>
            )}
          </div>
          {hasApartment && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#999" className="shrink-0"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          )}
        </div>
        {showResend && studentId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmTarget({ studentId, name: s.student?.full_name || "" });
            }}
            className="shrink-0 text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Qayta
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={groupName} />
      <div className="flex-1 px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <>
            {submitted.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Topshirganlar ({submitted.length})
                </p>
                <div className="space-y-3">
                  {submitted.map((s) => renderStudentCard(s, true))}
                </div>
              </div>
            ) : (
              <EmptyState message="Hali hech kim topshirmagan" />
            )}
          </>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-4 left-4 right-4 z-50 p-3 rounded-xl text-white text-sm text-center ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}

      {confirmTarget && (
        <ConfirmDialog
          title="Qayta topshirish"
          message={`${confirmTarget.name} uchun ijara ma'lumotlarini qayta topshirishni so'raysizmi?`}
          confirmText={sending ? "Yuborilmoqda..." : "Ha, yuborish"}
          onConfirm={handleResend}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
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
