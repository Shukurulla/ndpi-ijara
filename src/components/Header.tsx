"use client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBack = true, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between header-gradient text-white px-4 py-3.5">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-white/10 rounded-lg transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
