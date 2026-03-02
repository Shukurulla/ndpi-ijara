"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { StudentStatusData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import StudentCard from "@/components/StudentCard";

const colorLabels: Record<string, string> = {
  green: "Tasdiqlangan",
  yellow: "Kutilmoqda",
  red: "Rad etilgan",
  blue: "Yangi",
};

export default function StudentsStatusPage() {
  const router = useRouter();
  const params = useParams();
  const color = params.color as string;
  const groupId = params.groupId as string;
  const [students, setStudents] = useState<StudentStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getStudentsByStatus(color, groupId)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [color, groupId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={colorLabels[color] || color} />
      <div className="px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <div>
            {students.map((s) => (
              <StudentCard
                key={s.student._id}
                name={s.student.full_name}
                image={s.student.image}
                group={s.student.group?.name}
                status={s.appartment?.status}
                onClick={() => router.push(`/tutor/student-status/${s.student._id}?aptId=${s.appartment?._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
