"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

export default function StudentsGroupsPage() {
  const router = useRouter();
  useAuthGuard();
  const { tutorGroups, init } = useAuthStore();

  useEffect(() => { init(); }, [init]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Guruhlar" />
      <div className="px-4 py-4">
        {tutorGroups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <div className="space-y-3">
            {tutorGroups.map((g) => (
              <button
                key={g._id}
                onClick={() => router.push(`/tutor/students/${g._id}?name=${encodeURIComponent(g.name)}`)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.faculty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs header-gradient/10 text-[#4776E6] px-2 py-1 rounded-full">
                    {g.student_count} ta
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#999">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
