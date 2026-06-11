import type { ReactNode } from 'react';

type AdmissionsActionFooterProps = {
  children: ReactNode;
  className?: string;
};

export function AdmissionsActionFooter({ children, className = '' }: AdmissionsActionFooterProps) {
  return (
    <div className={`mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end ${className}`}>
      {children}
    </div>
  );
}

