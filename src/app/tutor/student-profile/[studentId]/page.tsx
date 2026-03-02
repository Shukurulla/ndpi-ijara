"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import type { StudentByStudentIdData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

export default function TutorStudentProfilePage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<StudentByStudentIdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getStudentByStudentId(studentId)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <><Header title="Talaba profili" /><Loading /></>;
  if (!data) return <><Header title="Talaba profili" /><div className="p-4 text-gray-500">Ma'lumot topilmadi</div></>;

  const imgSrc = data.image
    ? (data.image.startsWith("http") ? data.image : `${BASE_URL}${data.image}`)
    : "/default-avatar.svg";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Talaba profili" />
      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={imgSrc}
            alt={data.full_name}
            className="w-24 h-24 rounded-full object-cover bg-gray-200 mb-3"
            onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
          />
          <h2 className="text-lg font-bold text-gray-800">{data.full_name}</h2>
          <p className="text-sm text-gray-500">{data.group?.name}</p>
        </div>

        {data.location && data.location.lat !== 0 && (
          <div className="card mb-3">
            <h4 className="text-sm font-medium mb-2">Joylashuv</h4>
            <a
              href={`https://maps.google.com/?q=${data.location.lat},${data.location.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4776E6] text-sm underline"
            >
              Google Maps da ko'rish
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
