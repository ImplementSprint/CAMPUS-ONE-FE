import { useState } from 'react'
import type { ReactNode } from 'react'

type IconType = 'lock' | 'bell' | 'mail' | 'shield' | 'download'

function SettingIcon({ type }: { type: IconType }) {
  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </svg>
    )
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" />
        <path d="M10 17a2 2 0 0 0 4 0" />
      </svg>
    )
  }

  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    )
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v9" />
      <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
      <path d="M5 18h14" />
    </svg>
  )
}

type SettingRowProps = {
  icon: IconType
  title: string
  description: string
  action?: ReactNode
  clickable?: boolean
  href?: string
}

function SettingRow({ icon, title, description, action, clickable = false, href }: SettingRowProps) {
  const content = (
    <>
      <span className="setting-icon-wrap" aria-hidden="true">
        <SettingIcon type={icon} />
      </span>

      <span className="setting-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      {action ?? <span className="setting-chevron" aria-hidden="true">&gt;</span>}
    </>
  )

  if (href) {
    return (
      <a className={`setting-row setting-row-link ${clickable ? 'clickable' : ''}`} href={href}>
        {content}
      </a>
    )
  }

  return <div className={`setting-row ${clickable ? 'clickable' : ''}`}>{content}</div>
}

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`setting-toggle ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    >
      <span />
    </button>
  )
}

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [dataSharing, setDataSharing] = useState(true)

  return (
    <section className="settings-card settings-card-web">
      <article className="section-card">
        <header>
          <h2>Settings</h2>
          <p>Manage your preferences and account security</p>
        </header>

        <div className="settings-group">
          <h3>Security</h3>
          <SettingRow
            icon="lock"
            title="Change Password"
            description="Update your login credentials"
            clickable
          />
        </div>

        <div className="settings-group">
          <h3>Notifications</h3>
          <div className="setting-row">
            <span className="setting-icon-wrap" aria-hidden="true">
              <SettingIcon type="mail" />
            </span>
            <span className="setting-copy">
              <strong>Email Notifications</strong>
              <small>Receive updates via email</small>
            </span>
            <Toggle
              checked={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
              label="Email notifications"
            />
          </div>

          <div className="setting-row">
            <span className="setting-icon-wrap" aria-hidden="true">
              <SettingIcon type="bell" />
            </span>
            <span className="setting-copy">
              <strong>SMS Alerts</strong>
              <small>Receive SMS for important updates</small>
            </span>
            <Toggle
              checked={smsNotifications}
              onToggle={() => setSmsNotifications(!smsNotifications)}
              label="SMS notifications"
            />
          </div>
        </div>

        <div className="settings-group">
          <h3>Privacy</h3>
          <div className="setting-row">
            <span className="setting-icon-wrap" aria-hidden="true">
              <SettingIcon type="shield" />
            </span>
            <span className="setting-copy">
              <strong>Data Sharing</strong>
              <small>Allow data sharing with partners</small>
            </span>
            <Toggle
              checked={dataSharing}
              onToggle={() => setDataSharing(!dataSharing)}
              label="Data sharing"
            />
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <button className="signout-btn">Sign Out</button>
        </div>
      </article>
    </section>
  )
}
