"use client";
import { useRouter } from "next/navigation";

export default function FinishPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#4CAF50">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Muvaffaqiyatli!</h2>
      <p className="text-gray-500 text-center mb-8">
        So'rovnoma muvaffaqiyatli yuborildi. Natija tez orada keladi.
      </p>
      <button
        onClick={() => router.replace("/student/home")}
        className="btn-primary"
      >
        Bosh sahifaga qaytish
      </button>
    </div>
  );
}
