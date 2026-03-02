"use client";
import { useRouter } from "next/navigation";

export default function UserTypePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="w-[100px] h-[100px] bg-white/20 rounded-[20px] flex items-center justify-center mb-4 overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" className="hidden">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        
        <h1 className="text-[28px] font-bold text-white mb-2">TutorApp</h1>
        <p className="text-white/70 mb-12 text-[16px]">Kim sifatida kirmoqchisiz?</p>

        <div className="w-full space-y-4">
          {/* Student Card */}
          <button
            onClick={() => router.push("/auth?type=student")}
            className="w-full p-6 bg-white/15 rounded-[20px] border border-white/30 flex items-center gap-4 text-left transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-[20px]">Talaba</p>
              <p className="text-[14px] text-white/70">Student sifatida kirish</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.54)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>

          {/* Tutor Card */}
          <button
            onClick={() => router.push("/auth?type=tutor")}
            className="w-full p-6 bg-white/15 rounded-[20px] border border-white/30 flex items-center gap-4 text-left transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-[20px]">Tutor</p>
              <p className="text-[14px] text-white/70">Tutor sifatida kirish</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.54)">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
