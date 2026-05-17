// ─── Infrastructure ───────────────────────────────────────────────────────────
export type SchemaHealth = 'healthy' | 'degraded' | 'isolated' | 'offline'
export type ServiceStatus = 'online' | 'degraded' | 'offline'
export type ManifestStatus = 'registered' | 'unresponsive' | 'version-mismatch'

export interface SchemaRoom {
  id: string; name: string; schema: string
  tables: number; connections: number; health: SchemaHealth
  lastChecked: string; description: string
}

export interface ServiceManifest {
  service_id: string; name: string; version: string
  port: number; base_url: string; status: ManifestStatus
  consumes: string[]; emits: string[]
  last_heartbeat: string
}

export interface KafkaTopic {
  topic: string; producer: string; consumer: string
  throughput_per_min: number; lag: number; status: 'active' | 'idle' | 'erroring'
  description: string
}

export interface KafkaAlert {
  alert_id: string; severity: 'critical' | 'warning' | 'info'
  topic: string; message: string; timestamp: string; resolved: boolean
}

// ─── IAM ─────────────────────────────────────────────────────────────────────
export type AdminRole = 'SUPER_ADMIN' | 'ALUMNI_ADMIN' | 'STUDENT_ADMIN' | 'APPLICANT_ADMIN'
export type Permission = 'read' | 'write' | 'approve' | 'delete' | 'export'

export interface RolePermissionMatrix {
  role: AdminRole; scope: string; permissions: Permission[]
}

export interface MasterUser {
  user_id: string; full_name: string; email: string
  role: AdminRole; tenant_id: string
  status: 'active' | 'suspended' | 'pending'
  last_login: string; mfa_enabled: boolean
}

// ─── System Ops ───────────────────────────────────────────────────────────────
export interface SystemConfig {
  key: string; label: string; value: string
  category: 'academic' | 'system' | 'maintenance'; editable: boolean
}

export interface AuditEntry {
  audit_id: string; admin_name: string; admin_role: AdminRole
  action: string; schema: string; resource: string
  timestamp: string; outcome: 'success' | 'failure' | 'blocked'
}

export interface SecurityControl {
  control_id: string; area: string; status: 'pass' | 'warning' | 'fail'
  description: string; last_scan: string; remediation?: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface JourneyMetric {
  stage: string; count: number; change_pct: number; color: string
}

export interface CrossServiceReport {
  report_id: string; title: string; schemas: string[]
  last_generated: string; status: 'ready' | 'generating' | 'stale'
  row_count: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const schemaRooms: SchemaRoom[] = [
  { id: 'sch-app', name: 'Application DB', schema: 'application', tables: 14, connections: 8, health: 'healthy', lastChecked: '2026-05-16 18:00', description: 'Handles applicant profiles, document submissions, and admission results.' },
  { id: 'sch-enr', name: 'Enrollment DB', schema: 'enrollment', tables: 19, connections: 12, health: 'healthy', lastChecked: '2026-05-16 18:00', description: 'Subject selection, enrollment confirmation, and section assignment.' },
  { id: 'sch-aca', name: 'Academics DB', schema: 'academics', tables: 22, connections: 15, health: 'degraded', lastChecked: '2026-05-16 17:58', description: 'Grades, class records, professor assignments, and curriculum data.' },
  { id: 'sch-gra', name: 'Graduation DB', schema: 'graduation', tables: 11, connections: 4, health: 'healthy', lastChecked: '2026-05-16 18:00', description: 'Graduation verification, candidacy checks, and diploma processing.' },
  { id: 'sch-alm', name: 'Alumni DB', schema: 'alumni', tables: 16, connections: 7, health: 'healthy', lastChecked: '2026-05-16 18:00', description: 'Alumni registry, card applications, document requests, and clearances.' },
]

export const serviceManifests: ServiceManifest[] = [
  { service_id: 'svc-alumni', name: 'Alumni Service', version: '1.2.0', port: 3002, base_url: '/api/v1/alumni', status: 'registered', consumes: ['graduation.verified.v1'], emits: ['alumni.registration.submitted.v1', 'alumni.record.requested.v1'], last_heartbeat: '2026-05-16 18:00:12' },
  { service_id: 'svc-enroll', name: 'Enrollment Service', version: '1.1.3', port: 3001, base_url: '/api/v1/enrollment', status: 'registered', consumes: ['auth.user.login.v1'], emits: ['enrollment.subject.selected.v1', 'enrollment.checkout.submitted.v1'], last_heartbeat: '2026-05-16 18:00:08' },
  { service_id: 'svc-app', name: 'Application Service', version: '1.0.9', port: 3003, base_url: '/api/v1/application', status: 'registered', consumes: [], emits: ['application.submitted.v1', 'application.decision.v1'], last_heartbeat: '2026-05-16 18:00:05' },
  { service_id: 'svc-grad', name: 'Graduation Service', version: '1.0.4', port: 3004, base_url: '/api/v1/graduation', status: 'version-mismatch', consumes: ['enrollment.checkout.submitted.v1'], emits: ['graduation.verified.v1'], last_heartbeat: '2026-05-16 17:55:44' },
  { service_id: 'svc-auth', name: 'Auth Gateway', version: '2.0.1', port: 3000, base_url: '/api/v1/auth', status: 'registered', consumes: [], emits: ['auth.user.login.v1', 'auth.token.refreshed.v1'], last_heartbeat: '2026-05-16 18:00:15' },
]

export const kafkaTopics: KafkaTopic[] = [
  { topic: 'graduation.verified.v1', producer: 'Graduation Service', consumer: 'Alumni Service', throughput_per_min: 3, lag: 0, status: 'active', description: 'Triggers alumni log creation on graduation confirmation.' },
  { topic: 'enrollment.subject.selected.v1', producer: 'Enrollment Service', consumer: 'Academics Service', throughput_per_min: 48, lag: 2, status: 'active', description: 'Student adds a subject to enrollment cart.' },
  { topic: 'enrollment.checkout.submitted.v1', producer: 'Enrollment Service', consumer: 'Graduation Service', throughput_per_min: 12, lag: 0, status: 'active', description: 'Enrollment confirmed; triggers graduation candidacy check.' },
  { topic: 'alumni.registration.submitted.v1', producer: 'Alumni Service', consumer: 'Auth Gateway', throughput_per_min: 1, lag: 0, status: 'idle', description: 'Alumni self-registration submitted.' },
  { topic: 'alumni.record.requested.v1', producer: 'Alumni Service', consumer: 'Notification Service', throughput_per_min: 4, lag: 14, status: 'erroring', description: 'Document request submitted — consumer lagging.' },
  { topic: 'auth.user.login.v1', producer: 'Auth Gateway', consumer: 'All Services', throughput_per_min: 220, lag: 0, status: 'active', description: 'User authentication event broadcast to all subscribers.' },
]

export const kafkaAlerts: KafkaAlert[] = [
  { alert_id: 'kaf-001', severity: 'critical', topic: 'alumni.record.requested.v1', message: 'Consumer lag reached 14 — Notification Service may be down.', timestamp: '2026-05-16 17:52:11', resolved: false },
  { alert_id: 'kaf-002', severity: 'warning', topic: 'graduation.verified.v1', message: 'Throughput dropped below expected baseline (was 15/min).', timestamp: '2026-05-16 17:30:00', resolved: false },
  { alert_id: 'kaf-003', severity: 'info', topic: 'auth.user.login.v1', message: 'Throughput spike detected — 220/min vs normal 80/min.', timestamp: '2026-05-16 18:00:01', resolved: true },
]

export const rolePermissions: RolePermissionMatrix[] = [
  { role: 'ALUMNI_ADMIN', scope: 'alumni schema', permissions: ['read', 'write', 'approve', 'export'] },
  { role: 'ALUMNI_ADMIN', scope: 'notification engine', permissions: ['read', 'write'] },
  { role: 'STUDENT_ADMIN', scope: 'enrollment schema', permissions: ['read', 'write', 'approve'] },
  { role: 'STUDENT_ADMIN', scope: 'academics schema', permissions: ['read', 'approve'] },
  { role: 'APPLICANT_ADMIN', scope: 'application schema', permissions: ['read', 'write', 'approve'] },
  { role: 'APPLICANT_ADMIN', scope: 'graduation schema', permissions: ['read'] },
]

export const masterUsers: MasterUser[] = [
  { user_id: 'usr-001', full_name: 'Super Admin', email: 'super@campus-one.edu', role: 'SUPER_ADMIN', tenant_id: 'global', status: 'active', last_login: '2026-05-16 18:00', mfa_enabled: true },
  { user_id: 'usr-002', full_name: 'Jasper Santos', email: 'j.santos@campus-one.edu', role: 'ALUMNI_ADMIN', tenant_id: 'campus-one', status: 'active', last_login: '2026-05-16 14:22', mfa_enabled: true },
  { user_id: 'usr-003', full_name: 'Pia Reyes', email: 'p.reyes@campus-one.edu', role: 'STUDENT_ADMIN', tenant_id: 'campus-one', status: 'active', last_login: '2026-05-15 09:11', mfa_enabled: false },
  { user_id: 'usr-004', full_name: 'Carlo Mendoza', email: 'c.mendoza@campus-one.edu', role: 'APPLICANT_ADMIN', tenant_id: 'campus-one', status: 'suspended', last_login: '2026-05-10 11:40', mfa_enabled: false },
]

export const systemConfigs: SystemConfig[] = [
  { key: 'academic_year', label: 'Current Academic Year', value: 'AY 2025-2026', category: 'academic', editable: true },
  { key: 'semester', label: 'Current Semester', value: '2nd Semester', category: 'academic', editable: true },
  { key: 'enrollment_open', label: 'Enrollment Window Open', value: 'true', category: 'academic', editable: true },
  { key: 'enrollment_deadline', label: 'Enrollment Deadline', value: '2026-06-01', category: 'academic', editable: true },
  { key: 'maintenance_mode', label: 'Maintenance Mode', value: 'false', category: 'maintenance', editable: true },
  { key: 'maintenance_message', label: 'Maintenance Banner Message', value: '', category: 'maintenance', editable: true },
  { key: 'platform_version', label: 'Platform Version', value: '1.2.0', category: 'system', editable: false },
  { key: 'tenant_id', label: 'Active Tenant', value: 'campus-one', category: 'system', editable: false },
]

export const auditTrail: AuditEntry[] = [
  { audit_id: 'aud-001', admin_name: 'Jasper Santos', admin_role: 'ALUMNI_ADMIN', action: 'APPROVED clearance CLR-2026-002', schema: 'alumni', resource: 'clearance_records', timestamp: '2026-05-16 17:48:02', outcome: 'success' },
  { audit_id: 'aud-002', admin_name: 'Pia Reyes', admin_role: 'STUDENT_ADMIN', action: 'EXPORTED enrollment report Q2', schema: 'enrollment', resource: 'enrollment_logs', timestamp: '2026-05-16 16:30:11', outcome: 'success' },
  { audit_id: 'aud-003', admin_name: 'Carlo Mendoza', admin_role: 'APPLICANT_ADMIN', action: 'ATTEMPTED DELETE on application APP-2026-091', schema: 'application', resource: 'applications', timestamp: '2026-05-16 14:12:55', outcome: 'blocked' },
  { audit_id: 'aud-004', admin_name: 'Jasper Santos', admin_role: 'ALUMNI_ADMIN', action: 'LAUNCHED notification NTF-2026-002', schema: 'alumni', resource: 'notification_engine', timestamp: '2026-05-15 15:31:00', outcome: 'success' },
  { audit_id: 'aud-005', admin_name: 'Super Admin', admin_role: 'SUPER_ADMIN', action: 'SUSPENDED user usr-004', schema: 'public', resource: 'admin_users', timestamp: '2026-05-14 10:00:00', outcome: 'success' },
]

export const securityControls: SecurityControl[] = [
  { control_id: 'sec-001', area: 'TLS/SSL Certificate', status: 'pass', description: 'Wildcard cert valid. Expires 2027-03-12.', last_scan: '2026-05-16 18:00' },
  { control_id: 'sec-002', area: 'Database Encryption at Rest', status: 'pass', description: 'AES-256 encryption enabled on all 5 schema rooms.', last_scan: '2026-05-16 18:00' },
  { control_id: 'sec-003', area: 'MFA Enforcement', status: 'warning', description: '2 of 4 admin users have MFA disabled (STUDENT_ADMIN, APPLICANT_ADMIN).', last_scan: '2026-05-16 18:00', remediation: 'Enforce MFA on all non-suspended admin accounts.' },
  { control_id: 'sec-004', area: 'Data Privacy Policy (DPA 2012)', status: 'pass', description: 'Consent fields active across all alumni and applicant records.', last_scan: '2026-05-15 22:00' },
  { control_id: 'sec-005', area: 'Row-Level Security (RLS)', status: 'warning', description: 'academics schema RLS policies require review — 3 stale policies found.', last_scan: '2026-05-16 17:58', remediation: 'Review and republish RLS policies on academics schema.' },
  { control_id: 'sec-006', area: 'API Rate Limiting', status: 'pass', description: 'Rate limits active on all public-facing endpoints.', last_scan: '2026-05-16 18:00' },
  { control_id: 'sec-007', area: 'Kafka Topic ACLs', status: 'fail', description: 'alumni.record.requested.v1 has no consumer ACL — open consumer access.', last_scan: '2026-05-16 17:52', remediation: 'Apply ACL to restrict consumer to Notification Service only.' },
]

export const journeyMetrics: JourneyMetric[] = [
  { stage: 'Applications Submitted', count: 1240, change_pct: 12, color: '#38bdf8' },
  { stage: 'Admitted', count: 980, change_pct: 8, color: '#818cf8' },
  { stage: 'Enrolled', count: 874, change_pct: 5, color: '#a78bfa' },
  { stage: 'Active Students', count: 3420, change_pct: 2, color: '#f0abfc' },
  { stage: 'Graduates (AY 2025)', count: 512, change_pct: 3, color: '#4ade80' },
  { stage: 'Registered Alumni', count: 3, change_pct: 100, color: '#F5A623' },
]

export const crossServiceReports: CrossServiceReport[] = [
  { report_id: 'rpt-001', title: 'Application-to-Enrollment Conversion Rate', schemas: ['application', 'enrollment'], last_generated: '2026-05-16 08:00', status: 'ready', row_count: 980 },
  { report_id: 'rpt-002', title: 'Enrollment-to-Graduation Completion Rate', schemas: ['enrollment', 'academics', 'graduation'], last_generated: '2026-05-15 08:00', status: 'stale', row_count: 512 },
  { report_id: 'rpt-003', title: 'Graduate-to-Alumni Onboarding Funnel', schemas: ['graduation', 'alumni'], last_generated: '2026-05-16 08:00', status: 'ready', row_count: 3 },
  { report_id: 'rpt-004', title: 'Platform-Wide Admin Activity Summary', schemas: ['system', 'public'], last_generated: '2026-05-16 06:00', status: 'ready', row_count: 5 },
  { report_id: 'rpt-005', title: 'Privacy Compliance Across All Schemas', schemas: ['application', 'enrollment', 'alumni'], last_generated: '2026-05-14 08:00', status: 'stale', row_count: 2194 },
]
