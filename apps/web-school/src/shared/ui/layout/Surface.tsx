import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/ui/ui/utils';

export function Surface({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn('rounded-lg border border-campus-border bg-campus-surface shadow-sm', className)}
      {...props}
    />
  );
}
