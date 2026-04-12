'use client'
import { useState } from "react";
import { useNavigate } from "next/navigation";
import { TrackApplication } from "../components/TrackApplication";

export function TrackApplicationPage() {
  const router = useRouter();

  const handleSuccess = (email: string, referenceNumber: string) => {
    // Redirect to application status page with credentials
    router.push(`/admissions/status?email=${encodeURIComponent(email)}&ref=${encodeURIComponent(referenceNumber)}`);
  };

  return <TrackApplication onSuccess={handleSuccess} />;
}
