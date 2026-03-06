"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import { BASE_URL } from "@/utils/constants";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

export default function TutorStudentProfilePage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getStudentByStudentId(studentId)
      .then((res) => {
        const d = Array.isArray(res.data) ? res.data[0] : res.data;
        setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <><Header title="Talaba profili" /><Loading /></>;
  if (!data) return <><Header title="Talaba profili" /><div className="p-4 text-gray-500">Ma&apos;lumot topilmadi</div></>;

  const imgSrc = data.image
    ? (data.image.startsWith("http") ? data.image : `${BASE_URL}${data.image}`)
    : "/default-avatar.svg";

  const infoRows: { label: string; value: string | undefined }[] = [
    { label: "Guruh", value: data.group?.name },
    { label: "Fakultet", value: data.department?.name },
    { label: "Mutaxassislik", value: data.specialty?.name },
    { label: "Kurs", value: data.level?.name },
    { label: "Semestr", value: data.semester?.name },
    { label: "Ta'lim shakli", value: data.educationForm?.name },
    { label: "Jinsi", value: data.gender?.name },
    { label: "Viloyat", value: data.province?.name },
    { label: "Tuman", value: data.district?.name },
    { label: "Universitet", value: typeof data.university === "object" ? data.university?.name : data.university },
    { label: "Turar joy", value: data.accommodation?.name },
    { label: "Tug'ilgan sana", value: data.birth_date ? new Date(data.birth_date * 1000).toLocaleDateString("uz") : undefined },
    { label: "Hemis ID", value: data.student_id_number?.toString() },
  ];

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
          {data.group?.name && <p className="text-sm text-gray-500">{data.group.name}</p>}
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold mb-3">Ma&apos;lumotlar</h4>
          <div className="space-y-2.5 text-sm">
            {infoRows.map((row) => row.value && (
              <div key={row.label} className="flex justify-between">
                <span className="text-gray-500">{row.label}:</span>
                <span className="font-medium text-right max-w-[200px]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
