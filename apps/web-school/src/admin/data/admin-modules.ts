// ─── Standalone types (no external repo imports) ──────────────────────────────
// Originally Jertz referenced APIcenter_Alumni_User/backend/src/modules/alumni/alumni.types
// We inline the relevant shapes here so this file is self-contained in CAMPUS-ONE-FE.

export type VerificationType = 'student_record' | 'manual_alumni_verification'
export type DeliveryMethod = 'pickup' | 'delivery' | 'courier'

// ─── Shared base shapes ───────────────────────────────────────────────────────
export interface GraduationSchema {
  student_id: string
  academic_unit: string
  graduation_year: string
  last_program: string
  proof_reference: string
  verification_type: VerificationType
}

interface AlumniRegistrationBase extends GraduationSchema {
  actor_uuid: string
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  phone: string
}

interface AlumniProfileUpdateBase {
  employment_status: string
  employer_name: string
  job_title: string
  city: string
  country: string
}

interface AlumniCardApplicationBase {
  card_type: string
  delivery_method: DeliveryMethod
  contact_email: string
  contact_phone: string
  remarks?: string
}

interface AlumniRecordRequestBase {
  document_type: string
  purpose: string
  copies: number
  delivery_method: DeliveryMethod
  remarks?: string
}

// ─── Exported record types ────────────────────────────────────────────────────
export type AlumniRegistryRecord = AlumniRegistrationBase &
  AlumniProfileUpdateBase & {
    full_name: string
    registered_at: string
    alumni_number: string
    onboarding_stage: 'Submitted' | 'Registry Matched' | 'Validated' | 'Activated'
    member_status: 'Pending Verification' | 'Active Member' | 'For Exit Clearance' | 'Inactive'
    consent_status: 'Granted' | 'Pending Renewal' | 'Restricted'
  }

export type ClearanceOversightRecord = GraduationSchema & {
  clearance_id: string
  actor_uuid: string
  full_name: string
  exit_term: string
  office_owner: string
  due_date: string
  status: 'Pending Review' | 'Needs Action' | 'Approved' | 'Released'
}

export type IdCardApplicationRecord = AlumniCardApplicationBase &
  GraduationSchema & {
    application_id: string
    actor_uuid: string
    full_name: string
    application_status: 'Queued' | 'For Printing' | 'For Release' | 'Completed'
    card_serial: string
  }

export type BenefitFulfillmentRecord = GraduationSchema & {
  benefit_id: string
  actor_uuid: string
  full_name: string
  benefit_name: string
  fulfillment_channel: 'Portal' | 'Campus Desk' | 'Partner Office'
  fulfillment_status: 'Pending' | 'In Progress' | 'Fulfilled'
  owner: string
}

export type DocumentRequestQueueRecord = AlumniRecordRequestBase &
  GraduationSchema & {
    request_id: string
    full_name: string
    request_status: 'Queued' | 'In Validation' | 'Ready for Delivery' | 'Completed' | 'On Hold'
    assigned_unit: string
    requested_at: string
    target_release_date: string
  }

export type DeliveryManagementRecord = GraduationSchema & {
  delivery_id: string
  request_id: string
  actor_uuid: string
  full_name: string
  delivery_method: 'Pick-up' | 'Courier'
  dispatch_status: 'Pending Schedule' | 'Ready at Hub' | 'In Transit' | 'Delivered'
  release_point: string
  tracking_reference: string
}

export type NotificationEngineRecord = Pick<GraduationSchema, 'academic_unit' | 'graduation_year' | 'last_program'> & {
  notification_id: string
  linked_actor_uuid?: string
  campaign_name: string
  channel: 'Email' | 'SMS' | 'In-App'
  audience: string
  schedule_at: string
  status: 'Draft' | 'Scheduled' | 'Live' | 'Archived'
}

export type ActivityTrackingRecord = GraduationSchema & {
  activity_id: string
  actor_uuid: string
  full_name: string
  touchpoint: 'Clearance' | 'Registry' | 'ID Services' | 'Documents' | 'Privacy'
  event_name: string
  event_time: string
  outcome: 'Completed' | 'Waiting' | 'Escalated'
}

export type PrivacyComplianceRecord = GraduationSchema & {
  control_id: string
  actor_uuid?: string
  policy_area: 'Consent' | 'Retention' | 'Access Review' | 'Disclosure'
  owner: string
  review_due: string
  status: 'Compliant' | 'Review Required' | 'Action Needed'
}

export type DataDownloadRequestRecord = GraduationSchema & {
  download_id: string
  actor_uuid: string
  full_name: string
  request_scope: 'Profile Snapshot' | 'Service Requests' | 'Full Alumni Export'
  request_status: 'Queued' | 'Preparing Export' | 'Awaiting Release Approval' | 'Delivered'
  requested_at: string
  release_channel: 'Secure Link' | 'Registrar Pick-up'
  expires_at: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────
export const registryRecords: AlumniRegistryRecord[] = [
  {
    actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991',
    email: 'john.doe@email.com', first_name: 'John Michael', middle_name: 'A.', last_name: 'Doe',
    phone: '09171234567', student_id: '2018-00124', academic_unit: 'College of Computing Studies',
    graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102',
    verification_type: 'student_record', employment_status: 'Employed', employer_name: 'Northwind Labs',
    job_title: 'Frontend Developer', city: 'Quezon City', country: 'Philippines',
    full_name: 'John Michael Doe', registered_at: '2026-05-01', alumni_number: 'ALM-2026-001',
    onboarding_stage: 'Activated', member_status: 'Active Member', consent_status: 'Granted',
  },
  {
    actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219',
    email: 'maria.santos@email.com', first_name: 'Maria Clara', last_name: 'Santos',
    phone: '09187654321', student_id: '2017-00418', academic_unit: 'College of Business Administration',
    graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148',
    verification_type: 'student_record', employment_status: 'Self-Employed', employer_name: 'Santos Studio',
    job_title: 'Founder', city: 'Pasig', country: 'Philippines',
    full_name: 'Maria Clara Santos', registered_at: '2026-05-03', alumni_number: 'ALM-2026-002',
    onboarding_stage: 'Validated', member_status: 'For Exit Clearance', consent_status: 'Pending Renewal',
  },
  {
    actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9',
    email: 'arnel.reyes@email.com', first_name: 'Arnel', last_name: 'Reyes',
    phone: '09068882233', student_id: '2016-01994', academic_unit: 'College of Engineering',
    graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090',
    verification_type: 'manual_alumni_verification', employment_status: 'Seeking Opportunity',
    employer_name: '', job_title: '', city: 'Cebu City', country: 'Philippines',
    full_name: 'Arnel Reyes', registered_at: '2026-04-28', alumni_number: 'ALM-2026-003',
    onboarding_stage: 'Registry Matched', member_status: 'Pending Verification', consent_status: 'Granted',
  },
]

export const clearanceRecords: ClearanceOversightRecord[] = [
  { clearance_id: 'CLR-2026-001', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', full_name: 'Maria Clara Santos', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record', exit_term: 'AY 2025-2026', office_owner: 'Registrar', due_date: '2026-05-18', status: 'Pending Review' },
  { clearance_id: 'CLR-2026-002', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', full_name: 'Arnel Reyes', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification', exit_term: 'AY 2025-2026', office_owner: 'Library', due_date: '2026-05-17', status: 'Needs Action' },
  { clearance_id: 'CLR-2026-003', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', full_name: 'John Michael Doe', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record', exit_term: 'AY 2025-2026', office_owner: 'Accounting', due_date: '2026-05-14', status: 'Approved' },
]

export const idCardApplications: IdCardApplicationRecord[] = [
  { application_id: 'ID-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', card_type: 'Standard Alumni ID', delivery_method: 'pickup', contact_email: 'john.doe@email.com', contact_phone: '09171234567', remarks: 'Photo already validated', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record', full_name: 'John Michael Doe', application_status: 'For Release', card_serial: 'CARD-88412' },
  { application_id: 'ID-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', card_type: 'Lifetime Alumni ID', delivery_method: 'delivery', contact_email: 'maria.santos@email.com', contact_phone: '09187654321', remarks: 'Deliver with membership kit', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record', full_name: 'Maria Clara Santos', application_status: 'For Printing', card_serial: 'CARD-88413' },
  { application_id: 'ID-2026-003', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', card_type: 'Replacement Alumni ID', delivery_method: 'pickup', contact_email: 'arnel.reyes@email.com', contact_phone: '09068882233', remarks: 'Lost previous card', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification', full_name: 'Arnel Reyes', application_status: 'Queued', card_serial: 'CARD-88414' },
]

export const benefitFulfillmentRecords: BenefitFulfillmentRecord[] = [
  { benefit_id: 'BEN-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', full_name: 'John Michael Doe', benefit_name: 'Career Center Access', fulfillment_channel: 'Portal', fulfillment_status: 'Fulfilled', owner: 'Membership Desk', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { benefit_id: 'BEN-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', full_name: 'Maria Clara Santos', benefit_name: 'Welcome Package', fulfillment_channel: 'Campus Desk', fulfillment_status: 'In Progress', owner: 'Alumni Affairs', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { benefit_id: 'BEN-2026-003', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', full_name: 'Arnel Reyes', benefit_name: 'Partner Office Referral', fulfillment_channel: 'Partner Office', fulfillment_status: 'Pending', owner: 'Engagement Desk', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]

export const documentRequestQueue: DocumentRequestQueueRecord[] = [
  { request_id: 'DOC-2026-001', document_type: 'Transcript of Records', purpose: 'Employment onboarding', copies: 2, delivery_method: 'courier', remarks: 'Need sealed copies', full_name: 'John Michael Doe', request_status: 'Ready for Delivery', assigned_unit: 'Registrar', requested_at: '2026-05-04', target_release_date: '2026-05-17', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { request_id: 'DOC-2026-002', document_type: 'Certificate of Graduation', purpose: 'Visa filing', copies: 1, delivery_method: 'pickup', remarks: 'Present ID on release', full_name: 'Maria Clara Santos', request_status: 'In Validation', assigned_unit: 'Records Office', requested_at: '2026-05-06', target_release_date: '2026-05-19', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { request_id: 'DOC-2026-003', document_type: 'Certified True Copy of Diploma', purpose: 'License application', copies: 1, delivery_method: 'courier', remarks: 'Signature verification needed', full_name: 'Arnel Reyes', request_status: 'Queued', assigned_unit: 'Registrar', requested_at: '2026-05-07', target_release_date: '2026-05-22', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]

export const deliveryManagementRecords: DeliveryManagementRecord[] = [
  { delivery_id: 'DLV-2026-001', request_id: 'DOC-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', full_name: 'John Michael Doe', delivery_method: 'Courier', dispatch_status: 'In Transit', release_point: 'Records Dispatch', tracking_reference: 'LBC-3918482', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { delivery_id: 'DLV-2026-002', request_id: 'DOC-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', full_name: 'Maria Clara Santos', delivery_method: 'Pick-up', dispatch_status: 'Pending Schedule', release_point: 'Registrar Window 2', tracking_reference: 'PICKUP-SLOT-14', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { delivery_id: 'DLV-2026-003', request_id: 'DOC-2026-003', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', full_name: 'Arnel Reyes', delivery_method: 'Courier', dispatch_status: 'Ready at Hub', release_point: 'Records Dispatch', tracking_reference: 'JRS-5539021', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]

export const notificationEngineRecords: NotificationEngineRecord[] = [
  { notification_id: 'NTF-2026-001', linked_actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', campaign_name: 'Clearance approval reminders', channel: 'Email', audience: 'Graduates awaiting exit approval', schedule_at: '2026-05-16 09:00', status: 'Scheduled', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration' },
  { notification_id: 'NTF-2026-002', campaign_name: 'ID card release advisory', channel: 'SMS', audience: 'Members with cards for release', schedule_at: '2026-05-15 15:30', status: 'Live', academic_unit: 'All Colleges', graduation_year: '2022-2024', last_program: 'Multi-program' },
  { notification_id: 'NTF-2026-003', campaign_name: 'Privacy rights orientation', channel: 'In-App', audience: 'Newly activated alumni members', schedule_at: '2026-05-20 08:00', status: 'Draft', academic_unit: 'All Colleges', graduation_year: '2024', last_program: 'Multi-program' },
]

export const activityTrackingRecords: ActivityTrackingRecord[] = [
  { activity_id: 'ACT-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', full_name: 'John Michael Doe', touchpoint: 'Documents', event_name: 'Courier handoff confirmed', event_time: '2026-05-15 10:22', outcome: 'Completed', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { activity_id: 'ACT-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', full_name: 'Maria Clara Santos', touchpoint: 'Clearance', event_name: 'Registrar approval pending release review', event_time: '2026-05-15 08:44', outcome: 'Waiting', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { activity_id: 'ACT-2026-003', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', full_name: 'Arnel Reyes', touchpoint: 'Privacy', event_name: 'Download request needs disclosure review', event_time: '2026-05-14 16:11', outcome: 'Escalated', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]

export const privacyComplianceRecords: PrivacyComplianceRecord[] = [
  { control_id: 'PRV-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', policy_area: 'Consent', owner: 'Data Protection Officer', review_due: '2026-06-01', status: 'Compliant', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { control_id: 'PRV-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', policy_area: 'Disclosure', owner: 'Registrar', review_due: '2026-05-21', status: 'Review Required', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { control_id: 'PRV-2026-003', policy_area: 'Retention', owner: 'Records Office', review_due: '2026-05-19', status: 'Action Needed', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]

export const dataDownloadRequests: DataDownloadRequestRecord[] = [
  { download_id: 'DDR-2026-001', actor_uuid: '5b8eb7a8-8efd-4f87-b2ca-1a5f465b6991', full_name: 'John Michael Doe', request_scope: 'Service Requests', request_status: 'Preparing Export', requested_at: '2026-05-15 07:15', release_channel: 'Secure Link', expires_at: '2026-05-22', student_id: '2018-00124', academic_unit: 'College of Computing Studies', graduation_year: '2024', last_program: 'BS Computer Science', proof_reference: 'REG-VERIFY-102', verification_type: 'student_record' },
  { download_id: 'DDR-2026-002', actor_uuid: '3d1fb4b6-0f85-46dc-bf8b-86257ad74219', full_name: 'Maria Clara Santos', request_scope: 'Full Alumni Export', request_status: 'Awaiting Release Approval', requested_at: '2026-05-14 15:02', release_channel: 'Registrar Pick-up', expires_at: '2026-05-21', student_id: '2017-00418', academic_unit: 'College of Business Administration', graduation_year: '2023', last_program: 'BS Business Administration', proof_reference: 'REG-VERIFY-148', verification_type: 'student_record' },
  { download_id: 'DDR-2026-003', actor_uuid: '76fbb8c3-e62f-418f-b0ee-c592d978f7c9', full_name: 'Arnel Reyes', request_scope: 'Profile Snapshot', request_status: 'Queued', requested_at: '2026-05-14 09:46', release_channel: 'Secure Link', expires_at: '2026-05-20', student_id: '2016-01994', academic_unit: 'College of Engineering', graduation_year: '2022', last_program: 'BS Civil Engineering', proof_reference: 'MANUAL-ALUMNI-090', verification_type: 'manual_alumni_verification' },
]
