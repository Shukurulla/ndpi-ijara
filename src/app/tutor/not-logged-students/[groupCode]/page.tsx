"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { NotLoggedStudentData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import StudentCard from "@/components/StudentCard";

export default function NotLoggedStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const groupCode = params.groupCode as string;
  const [students, setStudents] = useState<NotLoggedStudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getNotLoggedStudents(groupCode)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupCode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kirmagan talabalar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Barcha talabalar kirgan" />
        ) : (
          <div>
            {students.map((s) => (
              <StudentCard
                key={s._id}
                name={s.full_name}
                image={s.image}
                region={s.province?.name}
                gender={s.gender?.name}
                onClick={() => router.push(`/tutor/student-profile/${s.id || s._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
