"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { TutorChatGroup } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function TutorChatPage() {
  const router = useRouter();
  useAuthGuard();
  const [groups, setGroups] = useState<TutorChatGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getTutorChatGroups()
      .then((res) => {
        const d = res.data;
        // Backend may return array directly or nested
        if (Array.isArray(d)) setGroups(d);
        else if (d?.group) setGroups(d.group);
        else if (d?.data && Array.isArray(d.data)) setGroups(d.data);
        else setGroups([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Chat" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <button
                key={g._id}
                onClick={() => router.push(`/tutor/chat/${g._id}`)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 header-gradient/10 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4776E6">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{g.name}</p>
                    <p className="text-xs text-gray-500">{g.faculty}</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
