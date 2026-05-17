'use client'
import { useState } from "react";
import { ApplicantAdminDashboard } from "../applicant-admin/ApplicantAdminDashboard";
import { StudentAdminDashboard } from "../student-admin/StudentAdminDashboard";

export function UnifiedAdminDashboard() {
  const [currentPortal, setCurrentPortal] = useState<"applicant" | "student">("applicant");

  return (
    <>
      {currentPortal === "applicant" ? (
        <ApplicantAdminDashboard onSwitchPortal={setCurrentPortal} />
      ) : (
        <StudentAdminDashboard />
      )}
    </>
  );
}
