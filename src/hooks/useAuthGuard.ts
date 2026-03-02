"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { STORAGE_KEYS } from "@/utils/constants";

export function useAuthGuard() {
  const router = useRouter();
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  // Faqat sahifa birinchi ochilganda tekshirish (mount da)
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUserType = localStorage.getItem(STORAGE_KEYS.TUTOR_OR_STUDENT);

    if (!storedToken) {
      router.replace("/user-type");
      return;
    }

    const path = window.location.pathname;
    if (storedUserType === "1" && path.startsWith("/tutor")) {
      router.replace("/student/home");
    } else if (storedUserType === "2" && path.startsWith("/student")) {
      router.replace("/tutor/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
