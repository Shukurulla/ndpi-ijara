"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { mainService } from "@/services/main.service";
import Header from "@/components/Header";

const apartmentTypes = [
  { 
    value: "tenant", 
    label: "Ijara uy", 
    description: "Ijarada yashayapman",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z"/>
      </svg>
    )
  },
  { 
    value: "relative", 
    label: "Qarindoshning uyi", 
    description: "Qarindoshimnikida yashayapman",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0018.06 7h-.12c-.83 0-1.59.5-1.9 1.27L13.5 15H15v7h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4zm6.5 0v-4h1v-4c0-.82-.68-1.5-1.5-1.5h-2c-.82 0-1.5.68-1.5 1.5v4h1v4h3z"/>
      </svg>
    )
  },
  { 
    value: "littleHouse", 
    label: "O'z uyim", 
    description: "O'z uyimda yashayapman",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z"/>
      </svg>
    )
  },
  { 
    value: "bedroom", 
    label: "Yotoqxona", 
    description: "Institut yotoqxonasida yashayapman",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
      </svg>
    )
  },
];

export default function ApartmentTypePage() {
  useAuthGuard();
  const router = useRouter();
  const params = useParams();
  const permissionId = params.permissionId as string;
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (!permissionId) return;
    mainService.getExistApartment({ permissionId }).then((res) => {
      const apt = res?.data;
      if (apt?.typeAppartment) setSelectedType(apt.typeAppartment);
    }).catch(() => {});
  }, [permissionId]);

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/student/question?permission=${permissionId}&type=${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
      <Header title="Yashash joyingiz" />
      
      <div className="flex-1 px-4 py-6">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Yashash joyingizni belgilang</h2>
        <p className="text-sm text-[#9E9E9E] mb-6">Quyidagilardan birini tanlang</p>
        
        <div className="space-y-3">
          {apartmentTypes.map((type) => {
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  isSelected 
                    ? "border-[#0259EF] bg-[rgba(2,89,239,0.05)]" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Radio circle */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "border-[#0259EF]" : "border-gray-300"
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0259EF]" />
                  )}
                </div>
                
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-[#0259EF] text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {type.icon}
                </div>
                
                {/* Text */}
                <div className="flex-1 text-left">
                  <p className={`font-semibold ${isSelected ? "text-[#0259EF]" : "text-[#1A1A2E]"}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-[#9E9E9E]">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="px-4 pb-6">
        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
            selectedType 
              ? "bg-[#0259EF] text-white" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Davom etish
        </button>
      </div>
    </div>
  );
}
