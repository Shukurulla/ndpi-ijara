"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { GroupStatusData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

const colorLabels: Record<string, string> = {
  green: "Tasdiqlangan",
  yellow: "Kutilmoqda",
  red: "Rad etilgan",
  blue: "Yangi",
};

export default function GroupsStatusPage() {
  const router = useRouter();
  const params = useParams();
  const color = params.color as string;
  const [groups, setGroups] = useState<GroupStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getGroupsByStatus(color)
      .then((res) => setGroups(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [color]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={colorLabels[color] || color} />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <div className="space-y-3">
            {groups.map((g) => {
              const groupId = g._id || g.code;
              const groupName = g.groupName || g.name || "";
              const studentCount = g.countStudents ?? g.student_count ?? 0;
              return (
                <button
                  key={String(groupId)}
                  onClick={() => router.push(`/tutor/students-status/${color}/${groupId}`)}
                  className="card w-full text-left flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">{groupName}</p>
                    {g.faculty && <p className="text-xs text-gray-500">{g.faculty}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      color === "green" ? "bg-green-100 text-green-700" :
                      color === "yellow" ? "bg-yellow-100 text-yellow-700" :
                      color === "red" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {studentCount} ta
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
