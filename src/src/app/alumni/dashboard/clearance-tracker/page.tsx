'use client';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
<<<<<<< HEAD
import styles from './page.module.css';

const checkpoints = [
  { label: 'Department Head Approval', status: 'completed' },
  { label: 'Registrar Verification', status: 'completed' },
  { label: 'Library Clearance', status: 'inProgress' },
  { label: 'Finance Confirmation', status: 'pending' },
  { label: 'Final Release', status: 'pending' },
];

function ClearanceTrackerContent() {
  const currentIndex = checkpoints.findIndex((checkpoint) => checkpoint.status === 'inProgress');
  const completedCount = checkpoints.filter((checkpoint) => checkpoint.status === 'completed').length;
  const activeIndex = currentIndex >= 0 ? currentIndex : completedCount;
  const progress = checkpoints.length > 1 ? (activeIndex / (checkpoints.length - 1)) * 100 : 0;

  return (
    <section className={styles.trackerSection}>
      <header className={styles.header}>
        <h2 className={styles.title}>Clearance Tracker</h2>
        <p className={styles.subtitle}>Monitor each step in real-time</p>
      </header>
      <div className={styles.stepperWrap}>
        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} style={{ width: `${progress}%` }} />
        </div>

        <ol className={styles.stepList}>
          {checkpoints.map((checkpoint, index) => (
            <li
              key={checkpoint.label}
              className={`${styles.stepItem} ${styles[checkpoint.status]}`}
              aria-current={checkpoint.status === 'inProgress' ? 'step' : undefined}
            >
              <span className={styles.stepCircle}>
                {checkpoint.status === 'completed' ? '✓' : index + 1}
              </span>
              <strong className={styles.stepLabel}>{checkpoint.label}</strong>
              <span className={styles.stepStatus}>
                {checkpoint.status === 'completed' && 'Completed'}
                {checkpoint.status === 'inProgress' && 'In Progress'}
                {checkpoint.status === 'pending' && 'Pending'}
              </span>
            </li>
          ))}
        </ol>
      </div>
=======

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
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
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
