import React from 'react'

export type NavIconType = 'dashboard' | 'graduate' | 'membership' | 'documents' | 'engagement' | 'privacy'

export function NavIcon({ type }: { type: NavIconType }) {
  if (type === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12h6V4H4z" />
        <path d="M14 20h6V10h-6z" />
        <path d="M14 4h6v4h-6z" />
        <path d="M4 16h6v4H4z" />
      </svg>
    )
  }

  if (type === 'graduate') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 8.5 12 4l9 4.5-9 4.5Z" />
        <path d="M7 10.5V15c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" />
        <path d="M21 9v6" />
      </svg>
    )
  }

  if (type === 'membership') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 15h5" />
        <circle cx="18" cy="15" r="1.2" />
      </svg>
    )
  }

  if (type === 'documents') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4z" />
        <path d="M7 9h10" />
        <path d="M7 13h6" />
      </svg>
    )
  }

  if (type === 'engagement') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M6.5 6.5l11 11" />
      <path d="m17.5 6.5-11 11" />
    </svg>
  )
}

export default NavIcon
