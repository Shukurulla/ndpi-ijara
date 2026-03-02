"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { MyNoticeData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function TutorNoticePage() {
  const router = useRouter();
  useAuthGuard();
  const [notices, setNotices] = useState<MyNoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchNotices = useCallback(async () => {
    try {
      const res = await mainService.getMyNotice();
      const sorted = (res.data || []).sort(
        (a: MyNoticeData, b: MyNoticeData) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotices(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleCreateNotice = async () => {
    setSending(true);
    try {
      await mainService.createPermission();
      setShowConfirm(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Ruxsatnomalar"
        rightElement={
          <button onClick={() => setShowConfirm(true)} className="text-white text-2xl leading-none">+</button>
        }
      />
      <div className="px-4 py-4">
        {loading ? <Loading /> : notices.length === 0 ? (
          <EmptyState message="Ruxsatnoma yo'q" />
        ) : (
          <div className="space-y-3">
            {notices.map((n) => (
              <button
                key={n._id}
                onClick={() => router.push(`/tutor/notice-group/${n._id}?status=${n.status}`)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{new Date(n.date).toLocaleDateString("uz")}</p>
                  <p className="text-xs text-gray-500">{n.countDocuments} ta talaba</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    n.status === "process" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {n.status === "process" ? "Jarayonda" : "Tugatilgan"}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Ruxsatnoma yaratish"
          message="Yangi ruxsatnoma yaratmoqchimisiz?"
          onConfirm={handleCreateNotice}
          onCancel={() => setShowConfirm(false)}
          confirmText={sending ? "Yaratilmoqda..." : "Ha"}
        />
      )}
    </div>
  );
}
