"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { STORAGE_KEYS } from "@/utils/constants";

export function useAuthGuard() {
  const router = useRouter();
  const { token, userType, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUserType = localStorage.getItem(STORAGE_KEYS.TUTOR_OR_STUDENT);
    
    if (!storedToken) {
      router.replace("/user-type");
      return;
    }

    // Redirect to correct login page if user type doesn't match current route
    const path = window.location.pathname;
    if (storedUserType === "1" && path.startsWith("/tutor")) {
      router.replace("/student/home");
    } else if (storedUserType === "2" && path.startsWith("/student")) {
      router.replace("/tutor/home");
    }
  }, [token, userType, router]);

  return { isAuthenticated: !!token };
}
