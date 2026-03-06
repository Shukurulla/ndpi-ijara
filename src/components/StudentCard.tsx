"use client";
import { BASE_URL } from "@/utils/constants";
import StatusBadge from "./StatusBadge";

interface StudentCardProps {
  name: string;
  image?: string | null;
  group?: string;
  faculty?: string;
  region?: string;
  gender?: string;
  status?: string;
  onClick?: () => void;
  onStatusClick?: () => void;
}

export default function StudentCard({
  name,
  image,
  group,
  faculty,
  region,
  gender,
  status,
  onClick,
  onStatusClick,
}: StudentCardProps) {
  const imgSrc = image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : "/default-avatar.svg";

  return (
    <div className="card flex items-center gap-3 mb-3 cursor-pointer active:scale-[0.98] transition-transform" onClick={onClick}>
      <img
        src={imgSrc}
        alt={name}
        className="w-12 h-12 rounded-full object-cover bg-gray-200"
        onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.svg"; }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        {group && <p className="text-xs text-gray-500">{group}</p>}
        {faculty && <p className="text-xs text-gray-400 truncate">{faculty}</p>}
        {region && <p className="text-xs text-gray-400">{region}</p>}
        {gender && <p className="text-xs text-gray-400">{gender}</p>}
      </div>
      {status && (
        <div onClick={(e) => { e.stopPropagation(); onStatusClick?.(); }}>
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  );
}
