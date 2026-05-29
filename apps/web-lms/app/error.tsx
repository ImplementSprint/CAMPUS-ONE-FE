'use client';

import { ErrorState } from '@campus-one/ui';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Unable to load this page"
      description="Refresh the page or try again in a moment."
      action={
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
        >
          Try again
        </button>
      }
    />
  );
}
