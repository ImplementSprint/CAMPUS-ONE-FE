'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, FileText, GraduationCap, LogIn, Search } from 'lucide-react';

export function UnifiedEntryPage() {
  const router = useRouter();

  return (
    <>
      <main className="portal-entry" aria-labelledby="portal-entry-title">
        <section className="portal-entry__brand" aria-label="Campus One">
          <div className="portal-entry__brand-lockup">
            <span className="portal-entry__logo-frame">
              <img src="/logo.png" alt="" className="portal-entry__logo" />
            </span>
            <div>
              <p className="portal-entry__brand-name">Campus One</p>
              <p className="portal-entry__brand-subtitle">School Portal</p>
            </div>
          </div>

          <div className="portal-entry__intro">
            <h1 id="portal-entry-title">Choose where you need to go.</h1>
            <p>
              Admissions, student access, and alumni services are grouped here so each user starts in the right workflow.
            </p>
          </div>

          <dl className="portal-entry__notes">
            <div>
              <dt>Admissions</dt>
              <dd>New applications and status tracking</dd>
            </div>
            <div>
              <dt>Current users</dt>
              <dd>Students, faculty, and school administrators</dd>
            </div>
            <div>
              <dt>Alumni</dt>
              <dd>Registration and document services</dd>
            </div>
          </dl>
        </section>

        <section className="portal-entry__panel" aria-label="Portal destinations">
          <div className="portal-entry__panel-header">
            <p>Campus portal</p>
            <span>Local</span>
          </div>

          <div className="portal-entry__actions">
            <button type="button" onClick={() => router.push('/admissions')} className="portal-entry__action portal-entry__action--primary">
              <span className="portal-entry__action-icon" aria-hidden="true">
                <FileText size={20} />
              </span>
              <span className="portal-entry__action-text">
                <strong>New applicant</strong>
                <span>Start or continue an admissions application.</span>
              </span>
              <ArrowRight className="portal-entry__arrow" size={18} aria-hidden="true" />
            </button>

            <button type="button" onClick={() => router.push('/login')} className="portal-entry__action">
              <span className="portal-entry__action-icon" aria-hidden="true">
                <LogIn size={20} />
              </span>
              <span className="portal-entry__action-text">
                <strong>Sign in</strong>
                <span>Access student, faculty, and admin portals.</span>
              </span>
              <ArrowRight className="portal-entry__arrow" size={18} aria-hidden="true" />
            </button>

            <button type="button" onClick={() => router.push('/alumni/register')} className="portal-entry__action">
              <span className="portal-entry__action-icon" aria-hidden="true">
                <GraduationCap size={20} />
              </span>
              <span className="portal-entry__action-text">
                <strong>Alumni registration</strong>
                <span>Create an alumni profile for records and services.</span>
              </span>
              <ArrowRight className="portal-entry__arrow" size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="portal-entry__secondary">
            <button type="button" onClick={() => router.push('/admissions/track')} className="portal-entry__track">
              <Search size={16} aria-hidden="true" />
              Track application status
            </button>
            <p>Need help? Contact the admissions office.</p>
          </div>
        </section>
      </main>
      <style>{portalEntryStyles}</style>
    </>
  );
}

const portalEntryStyles = `
.portal-entry {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 480px);
  gap: 48px;
  align-items: center;
  padding: 48px clamp(24px, 6vw, 88px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)), #171717;
  color: #f7f7f2;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
}

.portal-entry__brand { max-width: 720px; }

.portal-entry__brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: clamp(52px, 10vh, 104px);
}

.portal-entry__logo-frame {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.portal-entry__logo {
  width: 50px;
  height: 50px;
  display: block;
  object-fit: contain;
}

.portal-entry__brand-name {
  margin: 0;
  font-size: 20px;
  line-height: 1.1;
  font-weight: 750;
  color: #ffffff;
}

.portal-entry__brand-subtitle {
  margin: 4px 0 0;
  color: #d6a128;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 650;
}

.portal-entry__intro h1 {
  max-width: 780px;
  margin: 0;
  font-size: clamp(44px, 7vw, 84px);
  line-height: 0.95;
  font-weight: 780;
  color: #ffffff;
}

.portal-entry__intro p {
  max-width: 610px;
  margin: 24px 0 0;
  color: #d4d4d4;
  font-size: clamp(17px, 1.7vw, 21px);
  line-height: 1.6;
}

.portal-entry__notes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  max-width: 720px;
  margin: clamp(48px, 8vh, 76px) 0 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 10px;
  background: #303030;
}

.portal-entry__notes div {
  min-height: 116px;
  padding: 18px;
  background: #1f1f1f;
}

.portal-entry__notes dt {
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 750;
}

.portal-entry__notes dd {
  margin: 0;
  color: #b8b8b2;
  font-size: 13px;
  line-height: 1.45;
}

.portal-entry__panel {
  width: 100%;
  border: 1px solid #dedbd2;
  border-radius: 12px;
  background: #fbfaf6;
  color: #181818;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.portal-entry__panel-header {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-bottom: 1px solid #e7e2d8;
}

.portal-entry__panel-header p {
  margin: 0;
  font-size: 16px;
  font-weight: 760;
}

.portal-entry__panel-header span {
  color: #6b675f;
  font-size: 13px;
  font-weight: 650;
}

.portal-entry__actions { display: grid; }

.portal-entry__action {
  appearance: none;
  width: 100%;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border: 0;
  border-bottom: 1px solid #e7e2d8;
  background: transparent;
  color: #181818;
  text-align: left;
  cursor: pointer;
}

.portal-entry__action:hover { background: #f4f1e9; }
.portal-entry__action:focus-visible,
.portal-entry__track:focus-visible {
  outline: 3px solid rgba(214, 161, 40, 0.42);
  outline-offset: -3px;
}

.portal-entry__action--primary { background: #f6c453; }
.portal-entry__action--primary:hover { background: #edb531; }

.portal-entry__action-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #242424;
  color: #f6c453;
}

.portal-entry__action--primary .portal-entry__action-icon {
  background: rgba(24, 24, 24, 0.9);
  color: #ffffff;
}

.portal-entry__action-text {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.portal-entry__action-text strong {
  color: #181818;
  font-size: 16px;
  line-height: 1.2;
}

.portal-entry__action-text span {
  color: #5f5b54;
  font-size: 14px;
  line-height: 1.4;
}

.portal-entry__arrow { color: #625c52; }

.portal-entry__secondary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px 20px;
}

.portal-entry__track {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #d4cec1;
  border-radius: 8px;
  background: #ffffff;
  color: #181818;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.portal-entry__track:hover { background: #f4f1e9; }

.portal-entry__secondary p {
  margin: 0;
  color: #6b675f;
  font-size: 13px;
  line-height: 1.4;
  text-align: right;
}

@media (max-width: 900px) {
  .portal-entry {
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
    padding: 28px 18px;
  }

  .portal-entry__brand-lockup { margin-bottom: 44px; }
  .portal-entry__intro h1 { font-size: clamp(38px, 12vw, 58px); }
  .portal-entry__notes {
    grid-template-columns: 1fr;
    margin-top: 34px;
  }
  .portal-entry__notes div { min-height: auto; }
  .portal-entry__secondary {
    align-items: stretch;
    flex-direction: column;
  }
  .portal-entry__secondary p { text-align: left; }
}

@media (max-width: 520px) {
  .portal-entry {
    min-height: 100svh;
    padding: 22px 14px;
  }
  .portal-entry__brand-lockup {
    gap: 12px;
    margin-bottom: 36px;
  }
  .portal-entry__logo-frame {
    width: 48px;
    height: 48px;
  }
  .portal-entry__logo {
    width: 42px;
    height: 42px;
  }
  .portal-entry__intro p {
    margin-top: 18px;
    font-size: 16px;
  }
  .portal-entry__panel { border-radius: 10px; }
  .portal-entry__action {
    grid-template-columns: 38px minmax(0, 1fr) 18px;
    gap: 12px;
    padding: 18px 16px;
  }
  .portal-entry__action-icon {
    width: 38px;
    height: 38px;
  }
}
`;
