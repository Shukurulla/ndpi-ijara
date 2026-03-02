"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { MyNoticeStudentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function NoticeStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  const groupName = decodeURIComponent(params.groupName as string);
  const [students, setStudents] = useState<MyNoticeStudentData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    mainService.getMyNoticeStudents(noticeId, groupName)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [noticeId, groupName]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) return;
    setSending(true);
    try {
      await mainService.sendNoticeSelectStudents({
        students: selectedIds.map(id => ({ studentId: id, permissionId: noticeId })),
      } as any);
      alert("Muvaffaqiyatli yuborildi!");
      router.back();
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={groupName} />
      <div className="flex-1 px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <div className="space-y-3">
            {students.map((s) => {
              const isSelected = selectedIds.includes(s._id);
              const imgSrc = s.student?.image
                ? (s.student.image.startsWith("http") ? s.student.image : `${BASE_URL}${s.student.image}`)
                : "/default-avatar.svg";

              return (
                <div
                  key={s._id}
                  onClick={() => toggleSelect(s._id)}
                  className={`card flex items-center gap-3 cursor-pointer transition ${
                    isSelected ? "border-2 border-[#4776E6] bg-gradient-primary/5" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(s._id)}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <img
                    src={imgSrc}
                    alt={s.student?.full_name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.student?.full_name}</p>
                    <p className="text-xs text-gray-500">{s.student?.group?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="px-4 pb-6">
          <button onClick={handleSend} disabled={sending} className="btn-primary">
            {sending ? "Yuborilmoqda..." : `Yuborish (${selectedIds.length} ta)`}
          </button>
        </div>
      )}
    </div>
  );
}
