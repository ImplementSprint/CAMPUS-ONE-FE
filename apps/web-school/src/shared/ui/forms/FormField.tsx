import type { ReactNode } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-campus-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-sm text-campus-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
