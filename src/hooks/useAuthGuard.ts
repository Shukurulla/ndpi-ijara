"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { STORAGE_KEYS } from "@/utils/constants";

export function useAuthGuard() {
  const router = useRouter();
  const { token, userType, init } = useAuthStore();
  const redirecting = useRef(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (redirecting.current) return;
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUserType = localStorage.getItem(STORAGE_KEYS.TUTOR_OR_STUDENT);

    if (!storedToken) {
      redirecting.current = true;
      setTimeout(() => router.replace("/user-type"), 0);
      return;
    }

    // Redirect to correct login page if user type doesn't match current route
    const path = window.location.pathname;
    if (storedUserType === "1" && path.startsWith("/tutor")) {
      redirecting.current = true;
      setTimeout(() => router.replace("/student/home"), 0);
    } else if (storedUserType === "2" && path.startsWith("/student")) {
      redirecting.current = true;
      setTimeout(() => router.replace("/tutor/home"), 0);
    }
  }, [token, userType, router]);

  return { isAuthenticated: !!token };
}
