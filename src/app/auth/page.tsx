"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "student";
  const isStudent = userType === "student";

  const { setToken, setStudentData, setTutorData } = useAuthStore();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValid = login.length > 0 && password.length > 0;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");

    try {
      if (isStudent) {
        const res = await authService.studentLogin({
          login: Number(login),
          password,
        });
        setToken(res.token);
        const s = res.student;
        setStudentData({
          fullName: s.full_name,
          firstName: s.first_name,
          id: s._id,
          image: s.image,
          region: s.province?.name || "",
          district: s.district?.name || "",
          groupName: s.group?.name || "",
          groupId: s.group?.id?.toString() || "",
          facultyName: s.department?.name || "",
          gender: s.gender?.name || "",
          level: typeof s.level === "string" ? s.level : s.level?.name || "",
        });
        router.replace("/student/home");
      } else {
        const res = await authService.tutorLogin({ login, password });
        setToken(res.token);
        const t = res.data;
        setTutorData({
          name: t.name,
          phone: t.phone,
          image: t.image || null,
          groups: t.group,
          id: t._id,
        });
        router.replace("/tutor/home");
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 429) {
        setError("Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring");
      } else {
        setError(error.response?.data?.message || "Login yoki parol noto'g'ri");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-primary pt-4 pb-16">
        <div className="px-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <h1 className="text-[24px] font-bold text-white">
            {isStudent ? "Talaba kirish" : "Tutor kirish"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-[#F5F6FA] rounded-t-[30px] -mt-8 px-6 pt-8 pb-6">
        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-2xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Login input */}
          <div>
            <label className="text-[14px] font-semibold text-[#1A1A2E] mb-2 block">
              {isStudent ? "Hemis ID" : "Login"}
            </label>
            <input
              type={isStudent ? "number" : "text"}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder={isStudent ? "Hemis ID kiriting" : "Login kiriting"}
              className="input-field"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="text-[14px] font-semibold text-[#1A1A2E] mb-2 block">
              Parol
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
                className="input-field pr-12"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#4A4A5A] transition-colors"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="btn-primary mt-8"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div
                className="loading-spinner"
                style={{
                  width: 20,
                  height: 20,
                  borderColor: "rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                }}
              />
              Kirish...
            </span>
          ) : (
            "Kirish"
          )}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#F5F6FA]">
          <div className="loading-spinner" style={{ width: 40, height: 40 }} />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
