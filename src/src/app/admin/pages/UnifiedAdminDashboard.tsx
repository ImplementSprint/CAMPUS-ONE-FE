'use client'
import { useState } from "react";
import { UnifiedAdminLayout } from "../components/UnifiedAdminLayout";
import { ApplicantAdminDashboard } from "./ApplicantAdminDashboard";
import { StudentAdminDashboard } from "./StudentAdminDashboard";

export function UnifiedAdminDashboard() {
  const [currentPortal, setCurrentPortal] = useState<"applicant" | "student">("applicant");

  return (
    <>
      {currentPortal === "applicant" ? (
        <ApplicantAdminDashboard onSwitchPortal={setCurrentPortal} />
      ) : (
        <StudentAdminDashboard onSwitchPortal={setCurrentPortal} />
      )}
    </>
  );
}
