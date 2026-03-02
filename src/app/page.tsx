"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function SplashPage() {
  const router = useRouter();
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
    const userType = localStorage.getItem("tutorOrStudent");
    const token = localStorage.getItem("accessToken");

    const timer = setTimeout(() => {
      if (token && userType === "1") {
        router.replace("/student/home");
      } else if (token && userType === "2") {
        router.replace("/tutor/home");
      } else {
        router.replace("/user-type");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, init]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-primary">
      <div className="text-white text-center">
        {/* Logo */}
        <div className="w-[100px] h-[100px] bg-white/20 rounded-[20px] flex items-center justify-center mb-6 mx-auto overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        
        <h1 className="text-[28px] font-bold mb-2 tracking-tight">TutorApp</h1>
        <p className="text-white/60 text-[16px]">NDPI Tutor boshqaruv tizimi</p>
        
        {/* Loading indicator */}
        <div className="mt-8">
          <div 
            className="loading-spinner mx-auto" 
            style={{ 
              borderColor: "rgba(255,255,255,0.2)", 
              borderTopColor: "white" 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
