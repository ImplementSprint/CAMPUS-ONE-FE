import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { apiRequest } from '../services/api'

type AlumniProfile = {
  fullName: string
  email: string
  course: string
  graduationYear: string
}

type AlumniStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

type CardApplicationPayload = {
  reason: string
  applicationType?: 'new' | 'replacement'
  deliveryMethod?: 'pickup' | 'delivery'
  idPhotoFileName?: string
  consentAccepted?: boolean
}

type DocumentRequestPayload = {
  documentType: string
  notes: string
  numberOfCopies?: number
  purpose?: string
  deliveryMethod?: 'pickup' | 'courier'
  consentAccepted?: boolean
}

type AlumniContextValue = {
  profile: AlumniProfile
  status: AlumniStatus
  error: string | null
  submitCardApplication: (payload: CardApplicationPayload) => Promise<void>
  submitDocumentRequest: (payload: DocumentRequestPayload) => Promise<void>
  updateProfile: (profile: AlumniProfile) => Promise<void>
}

const initialProfile: AlumniProfile = {
  fullName: 'John M Doe Jr.',
  email: '',
  course: '',
  graduationYear: '',
}

const AlumniContext = createContext<AlumniContextValue | undefined>(undefined)

export function AlumniProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AlumniProfile>(initialProfile)
  const [status, setStatus] = useState<AlumniStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useCallback(async (nextProfile: AlumniProfile) => {
    setStatus('loading')
    setError(null)

    try {
      await apiRequest('/api/alumni/profile/update', {
        method: 'POST',
        body: JSON.stringify(nextProfile),
      })
      setProfile(nextProfile)
      setStatus('succeeded')
    } catch (updateError) {
      setStatus('failed')
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update profile',
      )
    }
  }, [])

  const submitCardApplication = useCallback(async (payload: CardApplicationPayload) => {
    setStatus('loading')
    setError(null)

    try {
      await apiRequest('/api/alumni/card-application', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setStatus('succeeded')
    } catch (applicationError) {
      setStatus('failed')
      setError(
        applicationError instanceof Error
          ? applicationError.message
          : 'Unable to submit card application',
      )
    }
  }, [])

  const submitDocumentRequest = useCallback(async (payload: DocumentRequestPayload) => {
    setStatus('loading')
    setError(null)

    try {
      await apiRequest('/api/alumni/record-request', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setStatus('succeeded')
    } catch (requestError) {
      setStatus('failed')
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to submit document request',
      )
    }
  }, [])

  const value = useMemo(
    () => ({
      profile,
      status,
      error,
      submitCardApplication,
      submitDocumentRequest,
      updateProfile,
    }),
    [profile, status, error, submitCardApplication, submitDocumentRequest, updateProfile],
  )

  return <AlumniContext.Provider value={value}>{children}</AlumniContext.Provider>
}

export function useAlumniContext() {
  const context = useContext(AlumniContext)

  if (!context) {
    throw new Error('useAlumniContext must be used within an AlumniProvider')
  }

  return context
}
