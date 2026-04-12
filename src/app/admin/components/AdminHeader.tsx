'use client'
interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0">
      {/* Left: hamburger menu */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Center: branding */}
      <div className="flex items-center gap-0.5">
        <span className="text-[#F59E0B] font-bold text-base tracking-tight">CAMPUS</span>
        <span className="text-white font-light text-base tracking-tight">Admin</span>
      </div>

      {/* Right: admin avatar */}
      <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs font-bold text-white">
        AD
      </div>
    </header>
  );
}
