import Link from 'next/link';
import { EmptyState } from '@campus-one/ui';

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page may have moved or the address may be incorrect."
      action={
        <Link
          href="/"
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
        >
          Go home
        </Link>
      }
    />
  );
}
