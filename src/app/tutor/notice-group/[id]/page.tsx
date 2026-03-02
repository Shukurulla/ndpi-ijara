"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { MyNoticeGroupData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

export default function NoticeGroupPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.id as string;
  const [groups, setGroups] = useState<MyNoticeGroupData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getMyNoticeGroup(noticeId)
      .then((res) => setGroups(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [noticeId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Guruhlar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <button
                key={g._id}
                onClick={() => router.push(`/tutor/notice-students/${noticeId}/${g.groupName}`)}
                className="card w-full text-left flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{g.groupName}</p>
                  <p className="text-xs text-gray-500">{g.countDocuments} ta talaba</p>
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
