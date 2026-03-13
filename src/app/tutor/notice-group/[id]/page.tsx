"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { MyNoticeGroupData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";

const otherTypes = [
  { value: "littleHouse", label: "O'z uyi" },
  { value: "relative", label: "Qarindosh uyi" },
  { value: "bedroom", label: "Yotoqxona" },
];

function NoticeGroupContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const noticeId = params.id as string;
  const noticeStatus = searchParams.get("status") || "process";
  const [groups, setGroups] = useState<MyNoticeGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [typeStudents, setTypeStudents] = useState<any[]>([]);
  const [typeLoading, setTypeLoading] = useState(false);

  useEffect(() => {
    mainService.getMyNoticeGroup(noticeId)
      .then((res) => setGroups(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [noticeId]);

  const handleSelectType = async (type: string) => {
    setSelectedType(type);
    setShowTypeModal(false);
    setTypeLoading(true);
    try {
      const res = await mainService.getApartmentsByType(noticeId, type);
      setTypeStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setTypeStudents([]);
    } finally {
      setTypeLoading(false);
    }
  };

  const closeTypeView = () => {
    setSelectedType("");
    setTypeStudents([]);
  };

  const selectedTypeLabel = otherTypes.find(t => t.value === selectedType)?.label || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Guruhlar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : groups.length === 0 ? (
          <EmptyState message="Guruh topilmadi" />
        ) : (
          <>
            {!selectedType ? (
              <div className="space-y-3">
                {groups.map((g) => (
                  <button
                    key={g._id}
                    onClick={() => router.push(`/tutor/notice-students/${noticeId}/${g.groupName}?status=${noticeStatus}`)}
                    className="card w-full text-left flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{g.groupName}</p>
                      <p className="text-xs text-gray-500">{g.countDocuments} ta talaba</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#999"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                  </button>
                ))}

                <button
                  onClick={() => setShowTypeModal(true)}
                  className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium hover:border-[#5B6CF8] hover:text-[#5B6CF8] transition"
                >
                  Boshqa ijara turidagilar
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">{selectedTypeLabel}</h3>
                  <button onClick={closeTypeView} className="text-sm text-[#5B6CF8] font-medium">Orqaga</button>
                </div>
                {typeLoading ? <Loading /> : typeStudents.length === 0 ? (
                  <EmptyState message="Talaba topilmadi" />
                ) : (
                  <div className="space-y-3">
                    {typeStudents.map((item: any, i: number) => {
                      const s = item.student;
                      const apt = item.appartment;
                      const imgSrc = s?.image
                        ? (s.image.startsWith("http") ? s.image : `${BASE_URL}${s.image}`)
                        : "/default-avatar.svg";
                      return (
                        <div key={apt?._id || i} className="card flex items-center gap-3 cursor-pointer" onClick={() => s?._id && router.push(`/tutor/student-status/${s._id}?aptId=${apt?._id}`)}>
                          <img src={imgSrc} alt={s?.full_name}
                            className="w-10 h-10 rounded-full object-cover bg-gray-200"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{s?.full_name}</p>
                            <p className="text-xs text-gray-500">{s?.group?.name}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Yashil</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowTypeModal(false)}>
          <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-center mb-2">Ijara turini tanlang</h3>
            {otherTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => handleSelectType(t.value)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-[#5B6CF8] transition"
              >
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
            <button onClick={() => setShowTypeModal(false)} className="w-full py-3 text-center text-sm text-gray-500">
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NoticeGroupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loading /></div>}>
      <NoticeGroupContent />
    </Suspense>
  );
}
