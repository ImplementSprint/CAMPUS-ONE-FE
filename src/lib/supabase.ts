import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // Ensure the underlying client behaves as a singleton in dev (prevents duplicate locks)
    isSingleton: true,
    // Increase lock acquire timeout to reduce noisy warnings from transient lock contention
    auth: {
      lockAcquireTimeout: 10000, // 10s
    },
  }
);

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? 'applicant-documents';
