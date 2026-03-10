"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useAuthStore } from "@/store/auth.store";
import { usePushNotification } from "@/hooks/usePushNotification";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { BASE_URL } from "@/utils/constants";
import type { TutorStatistics } from "@/types";
import PieChart from "@/components/PieChart";

export default function TutorHomePage() {
  const router = useRouter();
  usePushNotification();
  useAuthGuard();
  const { tutorName, tutorImage, init } = useAuthStore();
  const [statistics, setStatistics] = useState<TutorStatistics | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasActivePermission, setHasActivePermission] = useState(false);

  useEffect(() => { init(); }, [init]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, groupsRes, noticeRes] = await Promise.all([
        mainService.getTutorStatistics(),
        mainService.getTutorChatGroups(),
        mainService.getMyNotice(),
      ]);
      const stats = statsRes.statistics || statsRes.data || statsRes;
      setStatistics(stats as any);
      setGroups(groupsRes.data || groupsRes || []);
      // Active permission ni topish
      const notices = noticeRes.data || [];
      const active = notices.find((n: any) => n.status === "process");
      if (active) setHasActivePermission(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return null;
    const str = image.trim();
    if (!str) return null;
    if (str.startsWith("http")) return str;
    if (str.startsWith("/")) return `${BASE_URL}${str}`;
    return `${BASE_URL}/${str}`;
  };

  const imgSrc = getImageUrl(tutorImage);

  // Parse statistics
  const getCount = (s: any) => s?.total ?? s?.count ?? s ?? 0;
  const red = getCount(statistics?.red);
  const green = getCount(statistics?.green);
  const yellow = getCount(statistics?.yellow);
  const blue = getCount(statistics?.blue);
  const total = red + green + yellow + blue;

  const getPct = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-[14px] text-[#9E9E9E]">Salom,</p>
            <p className="text-[22px] font-bold text-[#1A1A2E] truncate">{tutorName || "Tutor"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/tutor/notifications")}
              className="w-12 h-12 flex items-center justify-center"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="1.5">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </button>
            <button
              onClick={() => router.push("/tutor/profile")}
              className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: imgSrc ? "transparent" : "linear-gradient(135deg, #0259EF 0%, #6C5CE7 100%)",
              }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {tutorName ? tutorName[0].toUpperCase() : "T"}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* E'lonlar Button */}
        <button
          onClick={() => router.push("/tutor/notice")}
          className="w-full bg-[#0259EF] text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
          </svg>
          E'lonlar
        </button>

        {/* Statistics Card */}
        <div className="card mb-6">
          <p className="text-center text-[16px] font-semibold text-[#9E9E9E] mb-2">Statistika</p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner" style={{ width: 32, height: 32 }} />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <PieChart statistics={statistics} size={200} />
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-2">
                <StatusCard
                  label="Yashil"
                  pct={getPct(green)}
                  color="#22C55E"
                  onClick={() => router.push("/tutor/groups-status/green")}
                />
                <StatusCard
                  label="Sariq"
                  pct={getPct(yellow)}
                  color="#F59E0B"
                  onClick={() => router.push("/tutor/groups-status/yellow")}
                />
                <StatusCard
                  label="Qizil"
                  pct={getPct(red)}
                  color="#EF4444"
                  onClick={() => router.push("/tutor/groups-status/red")}
                />
                <StatusCard
                  label="Yangilar"
                  pct={getPct(blue)}
                  color="#3B82F6"
                  onClick={() => router.push("/tutor/groups-status/blue")}
                />
              </div>
            </>
          )}
        </div>

        {/* Groups Section */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-[#1A1A2E] mb-2">Guruhlarim</h2>
          
          {groups.length === 0 ? (
            <p className="text-center text-[#9E9E9E] py-6">Guruhlar mavjud emas</p>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => {
                const name = group.name || "";
                const code = group.code || group._id || "";
                const faculty = group.faculty || group.facultyName || "";
                return (
                  <div
                    key={code}
                    className="card flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push(`/tutor/students/${code}`)}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[rgba(2,89,239,0.1)] flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0259EF">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A1A2E] truncate">{name}</p>
                      <p className="text-[12px] text-[#9E9E9E] truncate">{faculty}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Boshqa turdagi ijara */}
        {hasActivePermission && (
          <button
            onClick={() => router.push("/tutor/other-apartments")}
            className="w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 border-[1.5px] border-[#6C5CE7] text-[#6C5CE7] bg-white mb-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Boshqa turdagi ijara ma&apos;lumotlari
          </button>
        )}

        {/* Not Logged Students Button */}
        {groups.length > 0 && (
          <button
            onClick={() => router.push(`/tutor/not-logged-groups`)}
            className="w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 border-[1.5px] border-[#EF4444] text-[#EF4444] bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="18" y1="8" x2="23" y2="13"/>
              <line x1="23" y1="8" x2="18" y2="13"/>
            </svg>
            Ro'yxatdan o'tmagan talabalar
          </button>
        )}
      </div>

    </div>
  );
}

function StatusCard({ label, pct, color, onClick }: { label: string; pct: number; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-3.5 rounded-xl border transition-all"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[13px] font-medium flex-1 text-left" style={{ color }}>
        {label}
      </span>
      <span className="text-[16px] font-bold" style={{ color }}>
        {pct}%
      </span>
    </button>
  );
}
