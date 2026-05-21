'use client';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
