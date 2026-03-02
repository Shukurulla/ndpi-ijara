"use client";
import { useState, useEffect } from "react";
import { mainService } from "@/services/main.service";
import type { TutorNotificationItem } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function TutorNotificationsPage() {
  const [notifications, setNotifications] = useState<TutorNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getTutorNotifications()
      .then((res) => {
        const d = res.data || res.messages || res;
        if (Array.isArray(d)) setNotifications(d);
        else if (d?.messages) setNotifications(d.messages);
        else setNotifications([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Xabarnomalar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : notifications.length === 0 ? (
          <EmptyState message="Xabarnoma yo'q" />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className={`card ${!n.isRead ? "border-l-4 border-l-[#4776E6]" : ""}`}>
                <p className="font-medium text-sm text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleDateString("uz")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
