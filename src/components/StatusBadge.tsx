interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  green: { bg: "bg-green-100", text: "text-green-800", label: "Tasdiqlangan" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Kutilmoqda" },
  red: { bg: "bg-red-100", text: "text-red-800", label: "Rad etilgan" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", label: "Yangi" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusMap[status] || statusMap.blue;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}
