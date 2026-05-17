type StatusTone = 'success' | 'warning' | 'info' | 'neutral' | 'danger'

type StatusPillProps = {
  label: string
  tone: StatusTone
}

export function StatusPill({ label, tone }: StatusPillProps) {
  return <span className={`status-pill ${tone}`}>{label}</span>
}
