import { SectionCard } from '../components/common/SectionCard'

const checkpoints = [
  { label: 'Department Head Approval' },
  { label: 'Registrar Verification' },
  { label: 'Library Clearance' },
  { label: 'Finance Confirmation' },
  { label: 'Final Release' },
]

const currentStep = 3

export function ClearanceTrackerPage() {
  return (
    <SectionCard title="Clearance Tracker" subtitle="Monitor each step in real-time">
      <div className="tracker-shell">
        <div className="tracker-progress" aria-label="Clearance progress tracker">
          <div
            className="tracker-progress-line"
            style={{ width: `${(100 / (checkpoints.length - 1)) * (currentStep - 1)}%` }}
          />

          {checkpoints.map((checkpoint, index) => {
            const stepNumber = index + 1
            const state = stepNumber < currentStep ? 'complete' : stepNumber === currentStep ? 'current' : 'pending'

            return (
              <div key={checkpoint.label} className={`tracker-step ${state}`}>
                <span className="tracker-dot" aria-hidden="true">
                  {state === 'complete' ? '✓' : stepNumber}
                </span>
                <strong>{checkpoint.label}</strong>
                <small>{state === 'complete' ? 'Completed' : state === 'current' ? 'In Progress' : 'Pending'}</small>
              </div>
            )
          })}
        </div>
      </div>
    </SectionCard>
  )
}
