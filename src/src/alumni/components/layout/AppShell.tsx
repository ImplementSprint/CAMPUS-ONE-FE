import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  children: ReactNode
}

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 10a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V10" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  )
}

const notifications = [
  {
    title: 'Profile update reminder',
    message: 'Review your contact details before the next verification cycle.',
    time: '2 min ago',
  },
  {
    title: 'Document request received',
    message: 'Your latest document request is now being processed.',
    time: '1 hour ago',
  },
  {
    title: 'Clearance tracker moved',
    message: 'Your clearance status changed to In Review.',
    time: 'Yesterday',
  },
]

export function AppShell({ children }: AppShellProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(notifications.length)
  const notificationPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!notificationPanelRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-content">
        <header className="top-bar">
          <div className="notification-wrap" ref={notificationPanelRef}>
            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
              aria-controls="top-bar-notifications"
              onClick={() => {
                setIsNotificationOpen((current) => {
                  const nextOpen = !current

                  if (nextOpen) {
                    setUnreadNotificationCount(0)
                  }

                  return nextOpen
                })
              }}
            >
              <NotificationIcon />
              {unreadNotificationCount > 0 ? (
                <span className="notification-badge" aria-hidden="true">{unreadNotificationCount}</span>
              ) : null}
            </button>

            {isNotificationOpen ? (
              <div className="notification-panel" id="top-bar-notifications" role="dialog" aria-label="Notifications">
                <div className="notification-panel-header">
                  <div>
                    <h2>Notifications</h2>
                    <p>Recent updates from your portal.</p>
                  </div>
                </div>

                <div className="notification-list">
                  {notifications.map((notification) => (
                    <article className="notification-item" key={notification.title}>
                      <div className="notification-item-dot" aria-hidden="true" />
                      <div>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <small>{notification.time}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
