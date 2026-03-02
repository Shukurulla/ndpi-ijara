"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { TutorNotLoggedGroup } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function NotLoggedGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<TutorNotLoggedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getTutorNotLoggedGroups()
      .then((res) => {
        const d = res.data;
        if (Array.isArray(d)) setGroups(d);
        else if (d?.data && Array.isArray(d.data)) setGroups(d.data);
        else setGroups([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kirmagan talabalar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Barcha talabalar kirgan" />
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <button
                key={g._id}
                onClick={() => router.push(`/tutor/not-logged-students/${g._id}`)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.totalStudents} ta talaba</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {g.totalStudents}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
