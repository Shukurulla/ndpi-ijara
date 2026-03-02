"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useAuthStore } from "@/store/auth.store";
import { BASE_URL } from "@/utils/constants";
import Header from "@/components/Header";

export default function StudentProfilePage() {
  const router = useRouter();
  const { 
    logout, 
    studentFullName, 
    studentFirstName, 
    studentImage,
    studentGroupName,
    studentFacultyName,
    studentRegion,
    studentGender,
    studentLevel,
    token,
    init 
  } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    init();
    // Load fresh profile from API
    mainService.getStudentProfile()
      .then((res) => {
        setProfileData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [init]);

  useEffect(() => {
    if (token === null) {
      const stored = localStorage.getItem("accessToken");
      if (!stored) router.replace("/auth");
    }
  }, [token, router]);

  const handleLogout = () => {
    router.replace("/user-type");
    setTimeout(() => logout(), 100);
  };

  // Use API data if available, fallback to store data
  const fullName = profileData?.fullName || studentFullName || studentFirstName || "-";
  const groupName = profileData?.group || studentGroupName || "-";
  const facultyName = profileData?.department || studentFacultyName || "-";
  const provinceName = profileData?.province || studentRegion || "-";
  const genderName = profileData?.gender?.name || studentGender || "-";
  const levelName = profileData?.level || studentLevel || "-";
  
  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return null;
    const str = image.trim();
    if (!str) return null;
    if (str.startsWith("http")) return str;
    if (str.startsWith("/")) return `${BASE_URL}${str}`;
    return `${BASE_URL}/${str}`;
  };

  const imgSrc = getImageUrl(profileData?.image || studentImage);

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Header */}
      <div className="header-gradient px-4 pt-4 pb-8 rounded-b-[28px]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white">Profil</h1>
          <button onClick={() => setShowLogout(true)} className="text-white/80 text-sm font-medium">
            Chiqish
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-white/20 mb-3">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-white text-center">{fullName}</h2>
          <p className="text-white/70 text-sm mt-1">{groupName}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : (
          <div className="space-y-3">
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              }
              label="To'liq ism"
              value={fullName}
            />
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              }
              label="Guruh"
              value={groupName}
            />
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
              }
              label="Fakultet"
              value={facultyName}
            />
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              }
              label="Viloyat"
              value={provinceName}
            />
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
              }
              label="Kurs"
              value={levelName}
            />
            <InfoCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0259EF">
                  <path d="M12 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1.5-9.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zm-4.25 5.5c.16-.52.45-.98.83-1.34.43-.41.97-.72 1.58-.9.24-.07.51-.11.78-.11h1.13c.27 0 .54.04.78.11.61.18 1.15.49 1.58.9.38.36.67.82.83 1.34H9.25z"/>
                </svg>
              }
              label="Jinsi"
              value={genderName}
            />
          </div>
        )}
      </div>

      {/* Logout Dialog */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm bg-white rounded-[20px] p-6">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Chiqish</h3>
            <p className="text-[#9E9E9E] mb-6">Haqiqatan ham tizimdan chiqmoqchimisiz?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogout(false)} 
                className="flex-1 py-3 rounded-xl border border-[#E0E0E0] text-[#4A4A5A] font-semibold"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white font-semibold"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-xl bg-[rgba(2,89,239,0.08)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[12px] text-[#9E9E9E]">{label}</p>
        <p className="text-[15px] font-medium text-[#1A1A2E] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
