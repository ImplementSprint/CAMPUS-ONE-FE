'use client';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const checkpoints = [
  { label: 'Department Head Approval' },
  { label: 'Registrar Verification' },
  { label: 'Library Clearance' },
  { label: 'Finance Confirmation' },
  { label: 'Final Release' },
];

// currentStep is 1-indexed: 3 = "Library Clearance" is currently active
const currentStep = 3;

function ClearanceTrackerContent() {
  return (
    <section className="section-card">
      <header>
        <h2>Clearance Tracker</h2>
        <p>Monitor each step in real-time</p>
      </header>
      <div className="tracker-shell">
        <div className="tracker-progress" aria-label="Clearance progress tracker">
          <div
            className="tracker-progress-line"
            style={{ width: `${(100 / (checkpoints.length - 1)) * (currentStep - 1)}%` }}
          />
          {checkpoints.map((checkpoint, index) => {
            const stepNumber = index + 1;
            const state = stepNumber < currentStep ? 'complete' : stepNumber === currentStep ? 'current' : 'pending';
            return (
              <div key={checkpoint.label} className={`tracker-step ${state}`}>
                <span className="tracker-dot" aria-hidden="true">
                  {state === 'complete' ? '✓' : stepNumber}
                </span>
                <strong>{checkpoint.label}</strong>
                <small>{state === 'complete' ? 'Completed' : state === 'current' ? 'In Progress' : 'Pending'}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ClearanceTrackerPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <ClearanceTrackerContent />
    </ProtectedRoute>
  );
}
