'use client';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import styles from './page.module.css';

const checkpoints = [
  { label: 'Department Head Approval', done: true },
  { label: 'Registrar Verification', done: true },
  { label: 'Library Clearance', done: false },
  { label: 'Finance Confirmation', done: false },
  { label: 'Final Release', done: false },
];

function ClearanceTrackerContent() {
  return (
    <section className="section-card">
      <header>
        <h2>Clearance Tracker</h2>
        <p>Monitor each step in real-time</p>
      </header>
      <ul className="checkpoint-list">
        {checkpoints.map((cp) => (
          <li key={cp.label} className={cp.done ? 'done' : ''}>
            <strong>{cp.label}</strong>
            <span>{cp.done ? '✓ Done' : 'Pending'}</span>
          </li>
        ))}
      </ul>
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
