

import { useState } from 'react'

type ContactInfo = {
  email: string
  contactNumber: string
  mailingAddress: string
}

const initialContactInfo: ContactInfo = {
  email: 'jertznaval57@gmail.com',
  contactNumber: '09171234567',
  mailingAddress: 'Street, Barangay, City, Province',
}

export function ProfilePage() {
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [contactDraft, setContactDraft] = useState<ContactInfo>(initialContactInfo)

  const handleContactAction = () => {
    if (!isEditingContact) {
      setIsEditingContact(true)
      return
    }

    setIsEditingContact(false)
    setShowSuccessModal(true)
  }

  const handleCancelEdit = () => {
    setContactDraft(initialContactInfo)
    setIsEditingContact(false)
  }

  return (
    <section className="profile-main-layout" aria-label="Profile">
      <article className="section-card profile-form-card" aria-label="User information">
        <header>
          <h2>Personal Info</h2>
          <p>Review your profile details and update your contact information when needed.</p>
        </header>

        <div className="form-grid profile-info-grid">
          <div className="profile-name-row">
            <div>
              <span className="required-inline">Last Name</span>
              <p>Doe</p>
            </div>

            <div>
              <span className="required-inline">First Name</span>
              <p>John</p>
            </div>

            <div>
              <span className="required-inline">Middle Initial</span>
              <p>M</p>
            </div>

            <div>
              <span className="required-inline">Suffix</span>
              <p>Jr.</p>
            </div>
          </div>

          <div>
            <span className="required-inline">Birthdate</span>
            <p>January 15, 1998</p>
          </div>

          <div className="profile-academic-row">
            <div>
              <span className="required-inline">Academic Unit</span>
              <p>School of Engineering</p>
            </div>

            <div>
              <span className="required-inline">College Department</span>
              <p>Computer Science</p>
            </div>

            <div>
              <span className="required-inline">Year Graduated</span>
              <p>2020</p>
            </div>
          </div>
        </div>
      </article>

      <article className="section-card profile-form-card" aria-label="Editable contact information">
        <header>
          <h2>Contact Details</h2>
          <p>Only these fields can be edited.</p>
        </header>

        <div className="form-grid">
          <label>
            Email Address
            <input
              type="email"
              value={contactDraft.email}
              onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })}
              disabled={!isEditingContact}
            />
          </label>

          <label>
            Contact Number
            <input
              type="tel"
              value={contactDraft.contactNumber}
              onChange={(e) => setContactDraft({ ...contactDraft, contactNumber: e.target.value })}
              disabled={!isEditingContact}
            />
          </label>

          <label>
            Mailing Address
            <textarea
              value={contactDraft.mailingAddress}
              onChange={(e) => setContactDraft({ ...contactDraft, mailingAddress: e.target.value })}
              disabled={!isEditingContact}
            />
          </label>
        </div>

        <div className="profile-actions">
          {isEditingContact ? (
            <>
              <button className="primary-btn" onClick={handleContactAction}>
                Save Changes
              </button>
              <button type="button" className="secondary-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button className="primary-btn" onClick={handleContactAction}>
              Edit Contact Info
            </button>
          )}
        </div>
      </article>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content">
            <h3>Changes Saved</h3>
            <p>Your contact information has been updated successfully.</p>
            <button onClick={() => setShowSuccessModal(false)}>Done</button>
          </div>
        </div>
      )}
    </section>
  )
}
