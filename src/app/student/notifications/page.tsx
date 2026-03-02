"use client";
import { useState, useEffect, useCallback } from "react";
import { mainService } from "@/services/main.service";
import type { NotificationData } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function StudentNotificationsPage() {
  const { studentId } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!studentId) return;
    try {
      const res = await mainService.getStudentNotifications(studentId);
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { useAuthStore.getState().init(); }, []);
  useEffect(() => { if (studentId) fetch(); }, [studentId, fetch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Xabarnomalar" />
      <div className="px-4 py-4">
        {loading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <EmptyState message="Xabarnoma yo'q" />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className={`card ${!n.isRead ? "border-l-4 border-l-[#4776E6]" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                    n.status === "green" ? "bg-green-500" :
                    n.status === "yellow" ? "bg-yellow-500" :
                    n.status === "red" ? "bg-red-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{n.need_data}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleDateString("uz")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
