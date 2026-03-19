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
          <strong>TutorApp NDPI</strong> — Namangan davlat pedagogika instituti talabalarining turar joy ma&apos;lumotlarini yig&apos;ish, tekshirish va boshqarish uchun platforma. Tutor sifatida sizning asosiy vazifangiz — talabalar ma&apos;lumotlarini tekshirish va status belgilash.
        </p>
        <div className="bg-[#F5F6FA] rounded-2xl p-4 mb-4">
          <p className="font-semibold text-[#1A1A2E] text-[13px] mb-3">Umumiy jarayon:</p>
          {[
            { step: "1", title: "Student tizimga kiradi", desc: "HEMIS login va parol bilan" },
            { step: "2", title: "Uy turini tanlaydi", desc: "Ijara, Qarindosh uyi, O'z uy yoki Yotoqxona" },
            { step: "3", title: "So'rovnomani to'ldiradi", desc: "Manzil, rasm va boshqa ma'lumotlar" },
            { step: "4", title: "Tutor tekshiradi", desc: "Siz tekshirasiz va status belgilaysiz" },
            { step: "5", title: "Status belgilanadi", desc: "Yashil, Sariq, Qizil yoki Ko'k" },
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
      </>
    ),
  },
  {
    id: "statuses",
    title: "Status ranglar tizimi",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">4 xil status mavjud:</p>
        <div className="space-y-2.5 mb-4">
          <div className="flex items-start gap-3 p-3 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="font-semibold text-[#166534] text-[13px]">Yashil — Tasdiqlangan</p>
              <p className="text-[#15803d] text-[11px]">Ma&apos;lumotlar to&apos;liq va to&apos;g&apos;ri. Siz tasdiqlaysiz.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">📷</span>
            </div>
            <div>
              <p className="font-semibold text-[#92400e] text-[13px]">Sariq — Qo&apos;shimcha rasm kerak</p>
              <p className="text-[#a16207] text-[11px]">Izoh yozing — qanday rasm kerakligini tushuntiring.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">↺</span>
            </div>
            <div>
              <p className="font-semibold text-[#991b1b] text-[13px]">Qizil — Noto&apos;g&apos;ri ma&apos;lumot</p>
              <p className="text-[#b91c1c] text-[11px]">Talabaga qayta to&apos;ldirish so&apos;rovi yuboriladi.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">⏳</span>
            </div>
            <div>
              <p className="font-semibold text-[#1e3a8a] text-[13px]">Ko&apos;k — Yangi / Tekshirilmagan</p>
              <p className="text-[#1d4ed8] text-[11px]">Hali tekshirmagan. Tekshirishingiz kerak.</p>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(245,158,11,0.1)] border-l-[3px] border-[#F59E0B] p-3 rounded-r-xl">
          <p className="text-[#a16207] text-[12px]">
            <strong>Diqqat:</strong> Status belgilaganda izoh yozishni unutmang. Ayniqsa sariq va qizil uchun.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "login",
    title: "Tizimga kirish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Admin bergan login va parol bilan kirasiz.</p>
        <div className="bg-[#F5F6FA] rounded-2xl p-4 mb-3">
          <div className="flex justify-between py-2 border-b border-[#E0E0E0]">
            <span className="font-semibold text-[#1A1A2E] text-[13px]">Login</span>
            <span className="text-[#4A4A5A] text-[13px]">Admin bergan login</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-[#1A1A2E] text-[13px]">Parol</span>
            <span className="text-[#4A4A5A] text-[13px]">Admin bergan parol</span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "home",
    title: "Bosh sahifa va statistika",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Bosh sahifada umumiy statistika va boshqaruv tugmalari joylashgan:</p>
        <div className="space-y-2 mb-3">
          <div className="bg-[#F5F6FA] rounded-xl p-3">
            <p className="font-semibold text-[#1A1A2E] text-[13px]">Doiraviy diagramma</p>
            <p className="text-[#9E9E9E] text-[11px]">Yashil, Sariq, Qizil, Ko&apos;k statuslar foizi ko&apos;rsatiladi.</p>
          </div>
          <div className="bg-[#F5F6FA] rounded-xl p-3">
            <p className="font-semibold text-[#1A1A2E] text-[13px]">Guruhlar ro&apos;yxati</p>
            <p className="text-[#9E9E9E] text-[11px]">Biriktirilgan guruhlar. Bosib talabalar ro&apos;yxatiga o&apos;tasiz.</p>
          </div>
          <div className="bg-[#F5F6FA] rounded-xl p-3">
            <p className="font-semibold text-[#1A1A2E] text-[13px]">Qo&apos;shimcha tugmalar</p>
            <p className="text-[#9E9E9E] text-[11px]">E&apos;lonlar, Boshqa turdagi uylar, Ro&apos;yxatdan o&apos;tmagan talabalar.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "profile",
    title: "Profil va sozlamalar",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Profilda shaxsiy ma&apos;lumotlar va parol o&apos;zgartirish mavjud.</p>
        <p className="font-semibold text-[#1A1A2E] text-[13px] mb-2">Parol o&apos;zgartirish:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>Profil sahifasiga kiring</li>
          <li>&quot;Parol o&apos;zgartirish&quot; tugmasini bosing</li>
          <li>Joriy parolni kiriting</li>
          <li>Yangi parolni 2 marta kiriting</li>
          <li>&quot;Saqlash&quot; tugmasini bosing</li>
        </ol>
      </>
    ),
  },
  {
    id: "groups",
    title: "Guruhlar va talabalar",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">O&apos;zingizga biriktirilgan guruhlar va talabalarni ko&apos;rasiz.</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li><strong>Guruhlar ro&apos;yxati</strong> — barcha biriktirilgan guruhlar</li>
          <li><strong>Guruhni bosing</strong> → talabalar ro&apos;yxati ochiladi</li>
          <li><strong>Talabani bosing</strong> → to&apos;liq profil (HEMIS ma&apos;lumotlari) ochiladi</li>
        </ol>
        <div className="bg-[rgba(59,130,246,0.1)] border-l-[3px] border-[#3B82F6] p-3 rounded-r-xl">
          <p className="text-[#1d4ed8] text-[12px]">
            <strong>Eslatma:</strong> Faqat admin tomonidan biriktirilgan guruhlar ko&apos;rinadi.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "check",
    title: "Talaba tekshirish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Talaba ma&apos;lumotlarini tekshirish — asosiy vazifangiz.</p>
        <p className="font-semibold text-[#1A1A2E] text-[13px] mb-2">Talaba sahifasida ko&apos;rinadiganlar:</p>
        <ul className="text-[#4A4A5A] text-[12px] space-y-1 mb-3 list-disc list-inside">
          <li>Asosiy ma&apos;lumotlar (ism, guruh, fakultet)</li>
          <li>Ijara tarixi va statuslar</li>
          <li>Qurilma joylashuvi (GPS)</li>
          <li>Yuklangan rasmlar</li>
        </ul>
        <p className="font-semibold text-[#1A1A2E] text-[13px] mb-2">Status belgilash:</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 p-2 bg-[rgba(34,197,94,0.1)] rounded-lg">
            <div className="w-4 h-4 rounded-full bg-[#22C55E]" />
            <span className="text-[12px] text-[#166534]"><strong>Yashil</strong> — Hammasi to&apos;g&apos;ri. Tasdiqlang.</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[rgba(245,158,11,0.1)] rounded-lg">
            <div className="w-4 h-4 rounded-full bg-[#F59E0B]" />
            <span className="text-[12px] text-[#92400e]"><strong>Sariq</strong> — Qo&apos;shimcha rasm so&apos;rang.</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[rgba(239,68,68,0.1)] rounded-lg">
            <div className="w-4 h-4 rounded-full bg-[#EF4444]" />
            <span className="text-[12px] text-[#991b1b]"><strong>Qizil</strong> — Qayta to&apos;ldirish so&apos;rang.</span>
          </div>
        </div>
        <div className="bg-[rgba(245,158,11,0.1)] border-l-[3px] border-[#F59E0B] p-3 rounded-r-xl">
          <p className="text-[#a16207] text-[12px]">
            <strong>Diqqat:</strong> Google Maps&apos;da joylashuvni tekshiring va izoh yozishni unutmang.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "notice",
    title: "Ruxsatnoma yaratish",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Ruxsatnoma (e&apos;lon) yaratib guruhlarga yuboring:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>&quot;Yangi ruxsatnoma&quot; tugmasini bosing</li>
          <li><strong>Nom</strong> kiriting — sarlavha</li>
          <li><strong>Tavsif</strong> kiriting — batafsil ma&apos;lumot</li>
          <li><strong>Guruhlarni tanlang</strong></li>
          <li>&quot;Yaratish&quot; tugmasini bosing</li>
        </ol>
        <div className="bg-[rgba(34,197,94,0.1)] border-l-[3px] border-[#22C55E] p-3 rounded-r-xl">
          <p className="text-[#15803d] text-[12px]">
            <strong>Maslahat:</strong> Ruxsatnoma nomini aniq qilib yozing.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "submitted",
    title: "Topshirganlar ro'yxati",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Ruxsatnoma bo&apos;yicha ma&apos;lumot topshirgan talabalar:</p>
        <ul className="text-[#4A4A5A] text-[12px] space-y-1 mb-3 list-disc list-inside">
          <li>Talaba ismi va familiyasi</li>
          <li>Guruh nomi</li>
          <li>Status rangi</li>
          <li><strong>&quot;Qayta&quot;</strong> tugmasi — qayta topshirishni so&apos;rash</li>
        </ul>
        <p className="text-[#4A4A5A] text-[12px]">Talabani bosib tekshirish sahifasiga o&apos;ting. &quot;Qayta&quot; tugmasi qizil bildirishnoma yuboradi.</p>
      </>
    ),
  },
  {
    id: "resubmit",
    title: "Qayta topshirishni so'rash",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Ma&apos;lumot noto&apos;g&apos;ri yoki to&apos;liq bo&apos;lmasa qayta topshirish so&apos;rang:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>Talaba holati sahifasiga kiring</li>
          <li>&quot;Qayta topshirishni so&apos;rash&quot; tugmasini bosing</li>
          <li>Izoh yozing — sabab tushuntiring</li>
          <li>Tasdiqlang</li>
        </ol>
        <div className="bg-[rgba(245,158,11,0.1)] border-l-[3px] border-[#F59E0B] p-3 rounded-r-xl">
          <p className="text-[#a16207] text-[12px]">
            <strong>Eslatma:</strong> Aniq izoh yozing. Talaba nima qilish kerakligini tushunishi kerak.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "other",
    title: "Boshqa turdagi uylar",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Ijara, qarindosh uyi va o&apos;z uy turlarida yashayotgan talabalar:</p>
        <ul className="text-[#4A4A5A] text-[12px] space-y-1 mb-3 list-disc list-inside">
          <li><strong>Ijara uy</strong> — ijarada yashayotganlar</li>
          <li><strong>Qarindosh uyi</strong> — qarindoshlar uyida</li>
          <li><strong>O&apos;z uy</strong> — o&apos;z uyida yashayotganlar</li>
        </ul>
        <div className="bg-[rgba(59,130,246,0.1)] border-l-[3px] border-[#3B82F6] p-3 rounded-r-xl">
          <p className="text-[#1d4ed8] text-[12px]">
            <strong>Eslatma:</strong> Yotoqxona talabalar bu ro&apos;yxatga kirmaydi.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "notlogged",
    title: "Kirmagan talabalar",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Hali tizimga login qilmagan talabalar ko&apos;rsatiladi.</p>
        <div className="bg-[rgba(34,197,94,0.1)] border-l-[3px] border-[#22C55E] p-3 rounded-r-xl">
          <p className="text-[#15803d] text-[12px]">
            <strong>Maslahat:</strong> Ular bilan bog&apos;lanib, tizimga kirishlarini so&apos;rang. HEMIS login va parol bilan kiradi.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "filter",
    title: "Status bo'yicha filtr",
    content: (
      <>
        <p className="text-[#4A4A5A] text-[13px] mb-3">Statistika diagrammasida ranglarni bosib filtr qiling:</p>
        <ol className="text-[#4A4A5A] text-[12px] space-y-1.5 mb-3 list-decimal list-inside">
          <li>Bosh sahifadagi doiraviy diagrammaga boring</li>
          <li>Kerakli rangni bosing (yashil, sariq, qizil, ko&apos;k)</li>
          <li>Shu statusdagi talabalar guruhlar bo&apos;yicha ko&apos;rsatiladi</li>
        </ol>
        <div className="bg-[rgba(34,197,94,0.1)] border-l-[3px] border-[#22C55E] p-3 rounded-r-xl">
          <p className="text-[#15803d] text-[12px]">
            <strong>Maslahat:</strong> Bu orqali qaysi guruhlarda ko&apos;p tekshirilmagan talabalar borligini tezda aniqlang.
          </p>
        </div>
      </>
    ),
  },
];

export default function TutorGuidePage() {
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
              <p className="font-bold text-[#1A1A2E] text-[15px]">Tutor qo&apos;llanmasi</p>
              <p className="text-[#9E9E9E] text-[12px]">Tizimdan foydalanish bo&apos;yicha ko&apos;rsatmalar</p>
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
