"use client";
import { useState, useEffect, useCallback } from "react";

type ToastType = "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

let showToastFn: ((message: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "success") {
  showToastFn?.(message, type);
}

export default function ToastProvider() {
  const [state, setState] = useState<ToastState>({ message: "", type: "success", visible: false });

  const show = useCallback((message: string, type: ToastType = "success") => {
    setState({ message, type, visible: true });
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  useEffect(() => {
    if (!state.visible) return;
    const t = setTimeout(() => setState((s) => ({ ...s, visible: false })), 2500);
    return () => clearTimeout(t);
  }, [state.visible, state.message]);

  if (!state.visible) return null;

  const isSuccess = state.type === "success";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-sm animate-slide-down">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-lg border ${
        isSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSuccess ? "bg-green-500" : "bg-red-500"
        }`}>
          {isSuccess ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          )}
        </div>
        <p className={`text-sm font-medium flex-1 ${isSuccess ? "text-green-800" : "text-red-800"}`}>
          {state.message}
        </p>
        <button onClick={() => setState((s) => ({ ...s, visible: false }))} className="text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </div>
  );
}
