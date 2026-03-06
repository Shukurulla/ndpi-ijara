"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { mainService } from "@/services/main.service";
import type { StudentsData } from "@/types";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import StudentCard from "@/components/StudentCard";

export default function StudentsPage() {
  return (
    <Suspense fallback={<><Header title="Talabalar" /><Loading /></>}>
      <StudentsPageContent />
    </Suspense>
  );
}

function StudentsPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const groupId = params.groupId as string;
  const groupName = searchParams.get("name") || groupId;
  const [students, setStudents] = useState<StudentsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mainService.getStudentsByGroup(groupName)
      .then((res) => setStudents(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Talabalar" />
      <div className="px-4 py-4">
        {loading ? <Loading /> : students.length === 0 ? (
          <EmptyState message="Talaba topilmadi" />
        ) : (
          <div>
            {students.map((s) => (
              <StudentCard
                key={s._id || s.id}
                name={s.full_name}
                image={s.image}
                group={s.group?.name}
                faculty={s.department?.name}
                region={s.province?.name}
                status={s.appartmentStatus}
                onClick={() => router.push(`/tutor/student-profile/${s._id || s.id}`)}
                onStatusClick={() => s.appartmentStatus && router.push(`/tutor/student-status/${s._id || s.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
