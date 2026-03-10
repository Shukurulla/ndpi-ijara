"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useAuthStore } from "@/store/auth.store";
import { BASE_URL } from "@/utils/constants";
import type { NotificationData } from "@/types";

export default function StudentHomePage() {
  const router = useRouter();
  const {
    studentFullName, studentFirstName, studentImage, studentId,
    studentGroupName, studentFacultyName, studentLevel, token, init, logout
  } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (token === null) {
      const stored = localStorage.getItem("accessToken");
      if (!stored) router.replace("/auth");
    }
  }, [token, router]);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    try {
      const res = await mainService.getStudentHome(studentId);
      const data = res.data || [];
      data.sort((a: any, b: any) => {
        const dateA = a.createdAt || a.date || "";
        const dateB = b.createdAt || b.date || "";
        return dateB.toString().localeCompare(dateA.toString());
      });
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchData();
      mainService.getStudentProfile().then((res) => {
        if (res?.data && !res.data.address) {
          setShowUpdateModal(true);
        }
      }).catch(() => {});
    }
  }, [studentId, fetchData]);

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return null;
    const str = image.trim();
    if (!str) return null;
    if (str.startsWith("http")) return str;
    if (str.startsWith("/")) return `${BASE_URL}${str}`;
    return `${BASE_URL}/${str}`;
  };

  const imgSrc = getImageUrl(studentImage);
  const firstName = studentFirstName || studentFullName?.split(" ")[0] || "Talaba";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "green":
        return {
          bgColor: "bg-[rgba(34,197,94,0.1)]",
          textColor: "text-[#22C55E]",
          borderColor: "border-l-[#22C55E]",
          label: "Tasdiqlangan",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
          ),
        };
      case "yellow":
        return {
          bgColor: "bg-[rgba(245,158,11,0.1)]",
          textColor: "text-[#F59E0B]",
          borderColor: "border-l-[#F59E0B]",
          label: "Sariq zona",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          ),
        };
      case "red":
        return {
          bgColor: "bg-[rgba(239,68,68,0.1)]",
          textColor: "text-[#EF4444]",
          borderColor: "border-l-[#EF4444]",
          label: "Qayta to'ldiring",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M12 9v4m0 4h.01M1 21h22L12 2 1 21z"/>
            </svg>
          ),
        };
      case "blue":
      default:
        return {
          bgColor: "bg-[rgba(59,130,246,0.1)]",
          textColor: "text-[#3B82F6]",
          borderColor: "border-l-[#3B82F6]",
          label: "Ko'rib chiqilmoqda",
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          ),
        };
    }
  };

  const handleNotificationClick = (item: NotificationData) => {
    const status = item.status || "green";
    if (status === "red") {
      const permissionId = item.permission || "";
      if (permissionId) {
        router.push(`/student/apartment-type/${permissionId}`);
      }
    } else if (status === "yellow") {
      const apartmentId = item.appartmentId || "";
      const needData = item.need_data || "";
      if (apartmentId) {
        router.push(`/student/put-image?apartmentId=${apartmentId}&needData=${encodeURIComponent(needData)}`);
      }
    } else if (status === "green" || status === "blue") {
      const permId = item.permission?.toString() || "";
      const aptId = item.appartmentId?.toString() || "";
      router.push(`/student/apartment/${permId}?appartmentId=${aptId}`);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
      if (diff < 1) return "Hozir";
      if (diff < 60) return `${diff} min oldin`;
      if (diff < 1440) return `${Math.floor(diff / 60)} soat oldin`;
      return d.toLocaleDateString("uz", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const openNdpiWebsite = () => {
    window.open("https://ndpi.uz/uz/", "_blank");
  };

  // Logo component with fallback
  const LogoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* ===== HEADER ===== */}
      <div className="header-gradient px-5 pt-4 pb-6">
        {/* Top Row: Logo + Notifications */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover rounded-xl"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <LogoIcon />
              )}
            </div>
            <span className="text-white font-bold text-lg tracking-wide">NDPI TutorApp</span>
          </div>
        </div>

        {/* Profile Row */}
        <div className="flex items-center gap-3.5">
          <button onClick={() => router.push("/student/profile")}>
            <div className="w-14 h-14 rounded-full border-[2.5px] border-white shadow-lg overflow-hidden bg-white/30 flex items-center justify-center">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
          </button>
          <div className="flex-1">
            <p className="text-white/80 text-sm font-normal">Assalomu alaykum!</p>
            <p className="text-white font-bold text-[22px] tracking-wide mt-0.5">{firstName}</p>
            {studentGroupName && (
              <div className="mt-1">
                <span className="group-badge">{studentGroupName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-4 py-5">
        {/* NDPI Banner */}
        <div
          onClick={openNdpiWebsite}
          className="relative h-[200px] rounded-[20px] overflow-hidden mb-6 cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
        >
          <img
            src="/ndpi_building.jpg"
            alt="NDPI"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.75) 100%)"
            }}
          />
          <div className="absolute inset-0 p-[18px] flex flex-col">
            <div className="flex justify-end">
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white/20 rounded-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="text-white/90 text-xs font-medium">ndpi.uz</span>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-end gap-3">
              <div className="w-11 h-11 bg-white rounded-[10px] flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0259EF">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-[11px] font-semibold tracking-[1.5px] leading-[1.3]">
                  AJINIYOZ NOMIDAGI
                </p>
                <p className="text-white text-[15px] font-bold tracking-[0.5px] leading-[1.3]">
                  NUKUS DAVLAT
                </p>
                <p className="text-white text-[15px] font-bold tracking-[0.5px] leading-[1.3]">
                  PEDAGOGIKA INSTITUTI
                </p>
              </div>
              <div className="w-9 h-9 bg-[#0259EF] rounded-[10px] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="card mb-6">
          <div className="flex items-center">
            <div className="info-item">
              <div className="info-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
              </div>
              <span className="info-item-label">Fakultet</span>
              <span className="info-item-value">{studentFacultyName || "-"}</span>
            </div>
            <div className="divider" />
            <div className="info-item">
              <div className="info-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
              </div>
              <span className="info-item-label">Kurs</span>
              <span className="info-item-value">{studentLevel || "-"}</span>
            </div>
            <div className="divider" />
            <div className="info-item">
              <div className="info-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <span className="info-item-label">Guruh</span>
              <span className="info-item-value">{studentGroupName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="section-header">
          <div className="section-title">
            <div className="icon-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <h2>Bildirishnomalar</h2>
          </div>
          {notifications.length > 0 && (
            <span className="section-count">{notifications.length}</span>
          )}
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#9E9E9E">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <p className="text-[#9E9E9E] text-[15px] font-medium">Bildirishnomalar mavjud emas</p>
              <p className="text-[#E0E0E0] text-[13px] mt-1.5">Yangi bildirishnomalar bu yerda ko'rsatiladi</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const status = item.status || "blue";
              const config = getStatusConfig(status);
              return (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`notification-card border-l-[3px] ${config.borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${config.bgColor} ${config.textColor}`}>
                          {config.label}
                        </span>
                        <span className="text-[11px] text-[#9E9E9E] ml-auto">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                      <p className={`text-[13px] line-clamp-1 font-medium ${config.textColor}`}>
                        {item.message || item.need_data || "Yangi bildirishnoma"}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#E0E0E0">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
