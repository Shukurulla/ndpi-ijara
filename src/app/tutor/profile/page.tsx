"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import { useAuthStore } from "@/store/auth.store";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { BASE_URL } from "@/utils/constants";
import type { TutorProfileData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

export default function TutorProfilePage() {
  const router = useRouter();
  useAuthGuard();
  const { logout, setTutorImage } = useAuthStore();
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    mainService.getTutorProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    router.replace("/user-type");
    setTimeout(() => logout(), 100);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await mainService.updateTutorProfileImage(formData);
      if (res.data?.image) {
        setTutorImage(res.data.image);
        setProfile((prev) => prev ? { ...prev, image: res.data.image } : prev);
      }
    } catch (err) {
      console.error(err);
      alert("Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <><Header title="Profil" /><Loading /></>;

  const imgSrc = profile?.image
    ? (profile.image.startsWith("http") ? profile.image : `${BASE_URL}${profile.image}`)
    : "/default-avatar.svg";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profil" />

      <div className="px-4 py-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={imgSrc}
              alt={profile?.name}
              className="w-24 h-24 rounded-full object-cover bg-gray-200"
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
            />
            <label className="absolute bottom-0 right-0 w-8 h-8 header-gradient rounded-full flex items-center justify-center cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 12m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
              </svg>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {uploading && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                <div className="loading-spinner" style={{width: 20, height: 20}} />
              </div>
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-800 mt-3">{profile?.name}</h2>
          <p className="text-sm text-gray-500">{profile?.phone}</p>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-6">
          <InfoRow label="Login" value={profile?.login || "-"} />
          <InfoRow label="Telefon" value={profile?.phone || "-"} />
          <InfoRow label="Lavozim" value={profile?.role || "-"} />
        </div>

        {/* Groups */}
        {profile?.group && profile.group.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Guruhlar</h3>
            <div className="space-y-2">
              {profile.group.map((g, idx) => (
                <div key={g._id || idx} className="card">
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.faculty}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/tutor/change-password")}
            className="w-full card flex items-center gap-3 text-left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4776E6">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span className="text-sm font-medium">Parolni o'zgartirish</span>
          </button>

          <button
            onClick={() => router.push("/tutor/students-groups")}
            className="w-full card flex items-center gap-3 text-left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4776E6">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <span className="text-sm font-medium">Guruhlar va talabalar</span>
          </button>

          <button
            onClick={() => setShowLogout(true)}
            className="w-full card flex items-center gap-3 text-left text-red-500"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span className="text-sm font-medium">Tizimdan chiqish</span>
          </button>
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Chiqish</h3>
            <p className="text-gray-600 mb-6">Tizimdan chiqmoqchimisiz?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium">
                Bekor qilish
              </button>
              <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium">
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="card flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
