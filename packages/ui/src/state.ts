import { createElement, type ReactNode } from 'react';

type StateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function cx(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ');
}

const containerClass =
  'mx-auto flex min-h-[320px] w-full max-w-xl flex-col items-center justify-center px-6 py-12 text-center';
const titleClass = 'text-base font-semibold text-neutral-950';
const descriptionClass = 'mt-2 max-w-md text-sm leading-6 text-neutral-600';
const actionClass = 'mt-5 flex items-center justify-center gap-3';

export function LoadingState({ title, description, className }: StateProps) {
  return createElement(
    'section',
    {
      role: 'status',
      'aria-live': 'polite',
      className: cx(containerClass, className),
    },
    createElement('div', {
      className: 'mb-4 h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900',
      'aria-hidden': 'true',
    }),
    createElement('h1', { className: titleClass }, title),
    description ? createElement('p', { className: descriptionClass }, description) : null,
  );
}

export function EmptyState({ title, description, action, className }: StateProps) {
  return createElement(
    'section',
    {
      'aria-label': title,
      className: cx(containerClass, className),
    },
    createElement('h1', { className: titleClass }, title),
    description ? createElement('p', { className: descriptionClass }, description) : null,
    action ? createElement('div', { className: actionClass }, action) : null,
  );
}

export function ErrorState({ title, description, action, className }: StateProps) {
  return createElement(
    'section',
    {
      role: 'alert',
      className: cx(containerClass, className),
    },
    createElement('h1', { className: titleClass }, title),
    description ? createElement('p', { className: descriptionClass }, description) : null,
    action ? createElement('div', { className: actionClass }, action) : null,
  );
}
