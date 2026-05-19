import { useState } from 'react'
import type { FormEvent } from 'react'

export function RegistrationPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [academicUnit, setAcademicUnit] = useState('')
  const [consentAccepted, setConsentAccepted] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (consentAccepted) {
      // Submit registration
      console.log('Registration submitted', {
        email,
        password,
        firstName,
        lastName,
        academicUnit,
      })
    }
  }

  return (
    <section className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header>
            <h1>Alumni Registration</h1>
            <p>Step {step} of 3</p>
          </header>

          <form onSubmit={onSubmit} className="registration-form">
            {step === 1 && (
              <>
                <h2>Create Account</h2>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                </label>

                <label>
                  Confirm Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Personal Information</h2>
                <label>
                  First Name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </label>

                <label>
                  Last Name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </label>

                <label>
                  Academic Unit
                  <div className="select-shell">
                    <select
                      value={academicUnit}
                      onChange={(e) => setAcademicUnit(e.target.value)}
                      required
                    >
                      <option value="">Select your academic unit</option>
                      <option>School of Engineering</option>
                      <option>School of Business</option>
                      <option>School of Education</option>
                      <option>School of Arts and Sciences</option>
                    </select>
                    <span className="select-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Consent & Verification</h2>
                <div className="consent-section">
                  <h3>Data Privacy Notice</h3>
                  <p>
                    Campus One is committed to protecting your personal information. By registering, you consent to:
                  </p>
                  <ul>
                    <li>Collection and processing of personal data for alumni services</li>
                    <li>Communication via email and other contact methods</li>
                    <li>Sharing of information with approved university departments</li>
                  </ul>

                  <label className="checkbox-row consent-row">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      required
                    />
                    <span>
                      I accept the
                      {' '}
                      <strong>Data Privacy Notice</strong>
                      {' '}
                      and agree to the
                      {' '}
                      <strong>Terms of Service</strong>
                    </span>
                  </label>
                </div>
              </>
            )}

            <div className="registration-buttons">
              {step > 1 && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              <button type="submit" className="primary-btn">
                {step === 3 ? 'Complete Registration' : 'Next'}
              </button>
            </div>
          </form>

          <p className="registration-footer">
            Already have an account?
            {' '}
            <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </section>
  )
}
