"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { BASE_URL } from "@/utils/constants";



function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function usePushNotification() {
  const { token, studentId, tutorId, userType } = useAuthStore();
  const subscribed = useRef(false);

  useEffect(() => {
    if (subscribed.current || !token) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const userId = userType === 1 ? studentId : tutorId;
    if (!userId) return;

    subscribed.current = true;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Get VAPID key
        const keyRes = await fetch(BASE_URL + "/push/vapid-key");
        const { key } = await keyRes.json();
        if (!key) return;

        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          const subOptions: any = {
            userVisuallyShown: true,
            applicationServerKey: urlBase64ToUint8Array(key),
          };
          sub = await reg.pushManager.subscribe(subOptions);
        }

        // Send subscription to backend
        await fetch(BASE_URL + "/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            userType: userType === 1 ? "student" : "tutor",
          }),
        });
      } catch (err) {
        console.error("Push subscription error:", err);
      }
    })();
  }, [token, studentId, tutorId, userType]);
}
