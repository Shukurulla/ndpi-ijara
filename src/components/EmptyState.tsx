interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Ma'lumot topilmadi" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B4B6BA" strokeWidth="1.5">
        <path d="M9 12h6M12 9v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="mt-4 text-gray-400 text-sm text-center">{message}</p>
    </div>
  );
}
