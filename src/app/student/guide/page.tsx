"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "overview",
    title: "Kirish va umumiy tushuncha",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">
          <strong>TutorApp NDPI</strong> — Namangan davlat pedagogika instituti talabalarining turar joy ma&apos;lumotlarini yig&apos;ish, tekshirish va boshqarish uchun mo&apos;ljallangan platforma.
        </p>
        <div className="bg-[#F5F6FA] rounded-2xl p-4 mb-4">
          <p className="font-semibold text-[#1A1A2E] text-[13px] mb-3">Umumiy jarayon:</p>
          {[
            { step: "1", title: "Tizimga kirish", desc: "HEMIS login va parol bilan" },
            { step: "2", title: "Uy turini tanlash", desc: "Ijara, Qarindosh uyi, O'z uy yoki Yotoqxona" },
            { step: "3", title: "So'rovnomani to'ldirish", desc: "Manzil, rasm va boshqa ma'lumotlar" },
            { step: "4", title: "Tutor tekshiradi", desc: "Ma'lumotlarni ko'rib chiqadi va status belgilaydi" },
            { step: "5", title: "Status belgilanadi", desc: "Yashil, Sariq, Qizil yoki Ko'k rang bilan" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0259EF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A2E] text-[13px]">{item.title}</p>
                <p className="text-[11px] text-[#9E9E9E]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[rgba(59,130,246,0.1)] border-l-[3px] border-[#3B82F6] p-3 rounded-r-xl">
          <p className="text-[#3B82F6] text-[12px]">
            <strong>Eslatma:</strong> Har bir talaba faqat bir marta ma&apos;lumot to&apos;ldiradi. Qayta to&apos;ldirish uchun tutor qizil bildirishnoma yuboradi.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "statuses",
    title: "Status ranglar tizimi",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">
          Har bir talabaning ma&apos;lumotlari 4 xil statusda bo&apos;lishi mumkin:
        </p>
        <div className="space-y-2.5 mb-4">
          <div className="flex items-start gap-3 p-3 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="font-semibold text-[#166534] text-[13px]">Yashil — Tasdiqlangan</p>
              <p className="text-[#15803d] text-[11px]">Tutor tekshirdi, hammasi to&apos;g&apos;ri. Hech narsa qilmaysiz.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">📷</span>
            </div>
            <div>
              <p className="font-semibold text-[#92400e] text-[13px]">Sariq — Qo&apos;shimcha rasm kerak</p>
              <p className="text-[#a16207] text-[11px]">Tutor qo&apos;shimcha rasm so&apos;ragan. Izohni o&apos;qib, rasmni yuklang.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">↺</span>
            </div>
            <div>
              <p className="font-semibold text-[#991b1b] text-[13px]">Qizil — Qayta to&apos;ldirish kerak</p>
              <p className="text-[#b91c1c] text-[11px]">Bu &quot;rad etilgan&quot; degani <strong>EMAS</strong>. So&apos;rovnomani qayta to&apos;ldiring.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">⏳</span>
            </div>
            <div>
              <p className="font-semibold text-[#1e3a8a] text-[13px]">Ko&apos;k — Yangi / Tekshirilmoqda</p>
              <p className="text-[#1d4ed8] text-[11px]">Hali tutor tekshirmagan. Kutasiz.</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "login",
    title: "Tizimga kirish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">
          Student HEMIS tizimidagi login va parol bilan kiradi.
        </p>
        <div className="bg-[#F5F6FA] rounded-2xl p-4 mb-3">
          <div className="flex justify-between py-2 border-b border-[#E0E0E0]">
            <span className="font-semibold text-[#1A1A2E] text-[13px]">Login</span>
            <span className="text-[#4A4A5A] text-[13px]">Talaba ID (HEMIS)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-[#1A1A2E] text-[13px]">Parol</span>
            <span className="text-[#4A4A5A] text-[13px]">HEMIS parol</span>
          </div>
        </div>
        <div className="bg-[rgba(34,197,94,0.1)] border-l-[3px] border-[#22C55E] p-3 rounded-r-xl">
          <p className="text-[#15803d] text-[12px]">
            <strong>Maslahat:</strong> Parolni HEMIS tizimidan tiklash kerak. TutorApp-da parol tiklash yo&apos;q.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "home",
    title: "Bosh sahifa",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Bosh sahifada 3 ta asosiy qism mavjud:</p>
        <div className="space-y-2 mb-3">
          {[
            { t: "1. Profil qismi", d: "Ismingiz va profil rasmingiz. Bosib profilga o'tish mumkin." },
            { t: "2. Institut ma'lumotlari", d: "NDPI banneri, fakultet, kurs va guruh raqami." },
            { t: "3. Bildirishnomalar", d: "Har bir bildirishnoma o'z rangiga ega." },
          ].map((item) => (
            <div key={item.t} className="bg-[#F5F6FA] rounded-xl p-3">
              <p className="font-semibold text-[#1A1A2E] text-[13px]">{item.t}</p>
              <p className="text-[#9E9E9E] text-[11px]">{item.d}</p>
            </div>
          ))}
        </div>
        <div className="bg-[rgba(239,68,68,0.1)] border-l-[3px] border-[#EF4444] p-3 rounded-r-xl">
          <p className="text-[#b91c1c] text-[12px]">
            <strong>Muhim!</strong> Qizil bildirishnoma kelsa — albatta bosib, qayta to&apos;ldiring.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "fill",
    title: "Ma'lumot to'ldirish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">3 bosqichda ma&apos;lumot to&apos;ldirasiz:</p>
        <div className="mb-3">
          <p className="font-semibold text-[#1A1A2E] text-[13px] mb-2">1-bosqich: Uy turini tanlash</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "🏠", title: "Ijara uy" },
              { icon: "👨‍👩‍👧", title: "Qarindosh uyi" },
              { icon: "🏡", title: "O'z uyim" },
              { icon: "🏢", title: "Yotoqxona" },
            ].map((item) => (
              <div key={item.title} className="p-2.5 bg-[#F5F6FA] rounded-xl text-center">
                <div className="text-xl">{item.icon}</div>
                <p className="font-medium text-[#1A1A2E] text-[12px] mt-1">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <p className="font-semibold text-[#1A1A2E] text-[13px] mb-1">2-bosqich: So&apos;rovnoma</p>
          <p className="text-[#4A4A5A] text-[12px]">Uy turiga qarab manzil, rasmlar va boshqa ma&apos;lumotlarni kiriting.</p>
        </div>
        <div className="mb-3">
          <p className="font-semibold text-[#1A1A2E] text-[13px] mb-1">3-bosqich: Yuborish</p>
          <p className="text-[#4A4A5A] text-[12px]">&quot;Saqlash&quot; tugmasini bosing. Ma&apos;lumot ko&apos;k statusga o&apos;tadi.</p>
        </div>
        <div className="bg-[rgba(245,158,11,0.1)] border-l-[3px] border-[#F59E0B] p-3 rounded-r-xl">
          <p className="text-[#a16207] text-[12px]">
            <strong>Diqqat:</strong> To&apos;g&apos;ri uy turini tanlash muhim. Rasmlarni aniq va sifatli qiling.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "put-image",
    title: "Qo'shimcha rasm yuklash",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Sariq bildirishnoma kelganda qo&apos;shimcha rasm yuklang:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>Sariq bildirishnomani bosing</li>
          <li>Tutor izohini o&apos;qing</li>
          <li>Kamera yoki Galereyadan rasm tanlang</li>
          <li>&quot;Yuborish&quot; tugmasini bosing</li>
        </ol>
        <div className="bg-[rgba(34,197,94,0.1)] border-l-[3px] border-[#22C55E] p-3 rounded-r-xl">
          <p className="text-[#15803d] text-[12px]">
            <strong>Maslahat:</strong> Rasmni aniq va yorug&apos; joyda oling.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "resubmit",
    title: "Qayta to'ldirish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Qizil bildirishnoma kelganda qayta to&apos;ldiring:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>Qizil bildirishnomani bosing</li>
          <li>Tutor izohini o&apos;qing</li>
          <li>Uy turini qayta tanlang</li>
          <li>So&apos;rovnomani boshidan to&apos;ldiring</li>
          <li>&quot;Saqlash&quot; tugmasini bosing</li>
        </ol>
        <div className="bg-[rgba(239,68,68,0.1)] border-l-[3px] border-[#EF4444] p-3 rounded-r-xl">
          <p className="text-[#b91c1c] text-[12px]">
            <strong>Muhim!</strong> Qizil bildirishnomani e&apos;tiborsiz qoldirmang! Ma&apos;lumotlaringiz qabul qilinmaydi.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "notifications",
    title: "Bildirishnomalar",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Barcha bildirishnomalar rangi va vaqti bilan ko&apos;rsatiladi:</p>
        <div className="bg-[#F5F6FA] rounded-xl p-3 space-y-2">
          {[
            { color: "#22C55E", label: "Yashil", desc: "Tasdiqlangan. Hech narsa qilmaysiz." },
            { color: "#F59E0B", label: "Sariq", desc: "Qo'shimcha rasm kerak. Bosib yuklang." },
            { color: "#EF4444", label: "Qizil", desc: "Qayta to'ldiring. Albatta bosing!" },
            { color: "#3B82F6", label: "Ko'k", desc: "Tekshirilmoqda. Kutasiz." },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[#1A1A2E] text-[12px]"><strong>{item.label}</strong> — {item.desc}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function StudentGuidePage() {
  useAuthGuard();
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header title="Qo'llanma" />

      <div className="px-4 py-5">
        <div className="card mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(2,89,239,0.1)] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0259EF">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#1A1A2E] text-[15px]">Student qo&apos;llanmasi</p>
              <p className="text-[#9E9E9E] text-[12px]">Ilovadan foydalanish bo&apos;yicha ko&apos;rsatmalar</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4"
              >
                <span className="font-semibold text-[#1A1A2E] text-[14px]">{section.title}</span>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E"
                  className={`transition-transform ${openSection === section.id ? "rotate-180" : ""}`}
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                </svg>
              </button>
              {openSection === section.id && (
                <div className="px-4 pb-4 border-t border-[#F0F0F5] pt-3">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
