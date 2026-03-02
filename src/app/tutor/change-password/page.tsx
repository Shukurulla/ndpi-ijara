"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mainService } from "@/services/main.service";
import Header from "@/components/Header";

export default function TutorChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = oldPassword.length >= 4 && newPassword.length >= 4;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      await mainService.changeTutorPassword({ currentPassword: oldPassword, newPassword });
      alert("Parol muvaffaqiyatli o'zgartirildi!");
      router.back();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Parolni o'zgartirish" />
      <div className="flex-1 px-4 py-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">Joriy parol</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Joriy parolni kiriting"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1.5 block">Yangi parol</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yangi parolni kiriting"
            className="input-field"
          />
        </div>
      </div>

      <div className="px-4 pb-6">
        <button onClick={handleSubmit} disabled={!isValid || loading} className="btn-primary">
          {loading ? "O'zgartirilmoqda..." : "O'zgartirish"}
        </button>
      </div>
    </div>
  );
}
