'use client'
import { useRouter } from "next/navigation";
import type { AppSession } from "../types/admissions.types";

interface MobileHeaderProps {
  session: AppSession;
  onMenuClick?: () => void;
}

function getInitials(first: string, last: string): string {
  const f = first.trim()[0] ?? "";
  const l = last.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

export function MobileHeader({ session, onMenuClick }: MobileHeaderProps) {
  const router = useRouter();
  const hasProfile = !!session.firstName;
  const initials = hasProfile
    ? getInitials(session.firstName, session.lastName)
    : null;
  
  // Show hamburger if applicant session exists
  const showHamburger = !!session.applicantId;
  // Show back button if no applicant session (on initial screens)
  const showBackButton = !session.applicantId;

  return (
    <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 sticky top-0 z-30 flex-shrink-0">
      {/* Left: hamburger menu or back button */}
      {showHamburger && (
        <button
          onClick={onMenuClick}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {showBackButton && (
        <button
          onClick={() => router.push("/")}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Center: branding */}
      <div className="flex flex-col items-center leading-tight">
        <span className="text-sm font-semibold tracking-tight text-white">Campus One</span>
        <span className="text-[11px] font-medium text-[#F59E0B]">School Portal</span>
      </div>

      {/* Right: avatar or notifications */}
      {hasProfile ? (
        <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
      ) : (
        <button aria-label="Notifications" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      )}
    </header>
  );
}
