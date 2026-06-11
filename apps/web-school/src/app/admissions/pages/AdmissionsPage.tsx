'use client'
import { useState } from "react";
import type { AppSession, SchoolLevel, ApplicantType } from "../types/admissions.types";
import { AdmissionsMobileLayout } from "../components/AdmissionsMobileLayout";
import { Home } from "../components/Home";
import { SchoolLevelSelection } from "../components/SchoolLevelSelection";
import { ApplicantTypeSelection } from "../components/ApplicantTypeSelection";
import { ProgramSelection } from "../components/ProgramSelection";
import { CreateAccount } from "../components/CreateAccount";
import { PersonalProfile } from "../components/PersonalProfile";
import { ParentInformation } from "../components/ParentInformation";
import { AcademicBackground } from "../components/AcademicBackground";
import { AlumniRelativeInformation } from "../components/AlumniRelativeInformation";
import { DocumentCenter } from "../components/DocumentCenter";
import { AdmissionResultPortal } from "../components/AdmissionResultPortal";
import { ActivityLog } from "../components/ActivityLog";
import { ApplicationConfirmation } from "../components/ApplicationConfirmation";
import { getRequirementsByLevelAndType, logEvent, submitApplication } from "../services/admissions.service";

// ─── Step config ──────────────────────────────────────────────────────────────
const STEP_TITLES: Record<AppSession["step"], string> = {
  "home":                  "Welcome Home",
  "select":                "Start Your Application",
  "program-selection":     "Select Your Program",
  "create-account":        "Create Applicant Account",
  "personal-profile":      "Fill Out Personal Profile",
  "parent-info":           "Parent Information",
  "academic-background":   "Academic Background",
  "alumni-info":           "Alumni Relative Information",
  "documents":             "Document Requirements",
  "activity-log":          "Activity Log",
  "confirmation":          "Application Submitted",
  "result":                "Admission Result",
};
const STEP_SUBTITLES: Record<AppSession["step"], string | null> = {
  "home":                  "Review guidelines and pay reservation fee",
  "select":                "Select your school level and applicant type",
  "program-selection":     "Choose your program or track",
  "create-account":        "Step 1 of 2",
  "personal-profile":      "Step 2 of 2",
  "parent-info":           "Provide parent or guardian information",
  "academic-background":   "Share your academic history",
  "alumni-info":           "Provide alumni relative information (optional)",
  "documents":             null,
  "activity-log":          null,
  "confirmation":          null,
  "result":                null,
};

// ─── Progress dots (shown on select screen only) ──────────────────────────────
function SelectionDots({ level, type }: { level: SchoolLevel | null; type: ApplicantType | null }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-white border-b border-gray-100">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${level ? "text-[#F59E0B]" : "text-gray-300"}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${level ? "bg-[#F59E0B] text-white" : "bg-gray-200 text-gray-400"}`}>1</div>
        School Level
      </div>
      <div className={`h-px flex-1 ${level ? "bg-[#F59E0B]" : "bg-gray-200"}`} />
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${type ? "text-[#F59E0B]" : "text-gray-300"}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${type ? "bg-[#F59E0B] text-white" : "bg-gray-200 text-gray-400"}`}>2</div>
        Applicant Type
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AdmissionsPage() {
  const [session, setSession] = useState<AppSession>({
    step: "select",
    schoolLevel: null,
    applicantType: null,
    applicantId: null,
    firstName: "",
    lastName: "",
    email: "",
    collegeDepartment: null,
    collegeProgram: null,
    seniorHighTrack: null,
    tvlStrand: null,
    applicationStatus: null,
    referenceNumber: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateSession = (patch: Partial<AppSession>) =>
    setSession((prev) => ({ ...prev, ...patch }));

  const handleLevelSelect = async (level: SchoolLevel) => {
    updateSession({ schoolLevel: level, applicantType: null });
    await logEvent("school_level_selected", level, "Freshman", { school_level: level });
  };

  const handleTypeSelect = async (type: ApplicantType) => {
    if (!session.schoolLevel) return;
    updateSession({ applicantType: type });
    await logEvent("applicant_type_selected", session.schoolLevel, type, {});
  };

  const handleProgramSelectionSuccess = (data: {
    collegeDepartment?: any;
    collegeProgram?: any;
    seniorHighTrack?: any;
    tvlStrand?: any;
  }) => {
    updateSession({
      ...data,
      step: "documents",
    });
  };

  const canContinueFromSelect = !!session.schoolLevel && !!session.applicantType;

  const handleContinueFromSelect = async () => {
    if (!canContinueFromSelect) return;
    await logEvent("selection_confirmed", session.schoolLevel!, session.applicantType!, {
      school_level: session.schoolLevel,
      applicant_type: session.applicantType,
    });
    updateSession({ step: "create-account" });
  };

  const handleAccountCreated = (applicantId: string, email: string) => {
    // Store applicant_id in session storage for later use
    sessionStorage.setItem("applicant_id", applicantId);
    updateSession({ step: "personal-profile", applicantId, email });
  };

  const handleSubmitApplication = async () => {
    if (!session.applicantId) return;
    setSubmitError(null);
    
    const res = await submitApplication(session.applicantId);
    if (res.error) {
      setSubmitError(`Unable to submit application: ${res.error.message}`);
    } else {
      updateSession({ 
        step: "confirmation", 
        referenceNumber: res.data!.reference_number 
      });
    }
  };

  const handleBack = () => {
    const flow: AppSession["step"][] = ["select", "create-account", "personal-profile", "parent-info", "academic-background", "alumni-info", "program-selection", "documents", "result"];
    const idx = flow.indexOf(session.step);
    if (idx > 0) updateSession({ step: flow[idx - 1] });
  };

  const handleSidebarNavigate = (step: string) => {
    // Allow navigation to home only if applicationStatus is "Passed"
    if (step === "home") {
      if (session.applicationStatus === "Passed") {
        updateSession({ step: step as AppSession["step"] });
      }
      return;
    }
    
    // Allow navigation to result, program, documents, personal-profile, parent-info, academic-background, alumni-info, and activity-log
    if (step === "result" || step === "program-selection" || step === "documents" || step === "personal-profile" || step === "parent-info" || step === "academic-background" || step === "alumni-info" || step === "activity-log") {
      updateSession({ step: step as AppSession["step"] });
    }
  };

  const requirements =
    session.schoolLevel && session.applicantType
      ? getRequirementsByLevelAndType(session.schoolLevel, session.applicantType)
      : [];

  // Show back button only on form pages during account creation/profile setup
  const showBack = 
    session.step === "personal-profile" || 
    session.step === "parent-info" ||
    session.step === "academic-background" ||
    session.step === "alumni-info" ||
    session.step === "program-selection" ||
    session.step === "documents" ||
    session.step === "activity-log" ||
    session.step === "create-account";

  return (
    <AdmissionsMobileLayout
      session={session}
      onNavigate={handleSidebarNavigate}
    >
      {/* Page Title */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-[15px] font-bold text-[#1a1a1a]">{STEP_TITLES[session.step]}</h1>
        {STEP_SUBTITLES[session.step] && (
          <p className="text-xs text-gray-400 mt-0.5">{STEP_SUBTITLES[session.step]}</p>
        )}
      </div>

      {/* Selection progress dots (only on select screen) */}
      {session.step === "select" && (
        <SelectionDots level={session.schoolLevel} type={session.applicantType} />
      )}

      {/* ── HOME SCREEN ────────────────────────────────────────────────── */}
      {session.step === "home" && (
        <Home session={session} />
      )}

      {/* ── SELECT SCREEN ──────────────────────────────────────────────── */}
      {session.step === "select" && (
        <>
          <div className="px-4 pt-4 pb-5 space-y-5">
            <SchoolLevelSelection selected={session.schoolLevel} onSelect={handleLevelSelect} />
            {session.schoolLevel && (
              <ApplicantTypeSelection
                schoolLevel={session.schoolLevel}
                selected={session.applicantType}
                onSelect={handleTypeSelect}
              />
            )}
          </div>
          <div className="mx-4 mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 pb-5 sm:flex-row sm:justify-end">
            <button
              onClick={handleContinueFromSelect}
              disabled={!canContinueFromSelect}
              className={`h-11 rounded-md px-4 text-sm font-semibold transition-colors sm:min-w-40 ${
                canContinueFromSelect
                  ? "bg-campus-brand text-campus-ink hover:bg-campus-brandStrong hover:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </>
      )}

      {/* ── CREATE ACCOUNT ──────────────────────────────────────────────── */}
      {session.step === "create-account" && session.schoolLevel && session.applicantType && (
        <CreateAccount
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          onSuccess={handleAccountCreated}
        />
      )}

      {/* ── PERSONAL PROFILE ────────────────────────────────────────────── */}
      {session.step === "personal-profile" && session.schoolLevel && session.applicantType && session.applicantId && (
        <PersonalProfile
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          applicantId={session.applicantId}
          onSuccess={(firstName, lastName) =>
            updateSession({ step: "parent-info", firstName, lastName })
          }
          onBack={handleBack}
        />
      )}

      {/* ── PARENT INFORMATION ──────────────────────────────────────────── */}
      {session.step === "parent-info" && session.schoolLevel && session.applicantType && session.applicantId && (
        <ParentInformation
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          applicantId={session.applicantId}
          onSuccess={() => updateSession({ step: "academic-background" })}
          onBack={handleBack}
        />
      )}

      {/* ── ACADEMIC BACKGROUND ─────────────────────────────────────────── */}
      {session.step === "academic-background" && session.schoolLevel && session.applicantType && session.applicantId && (
        <AcademicBackground
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          applicantId={session.applicantId}
          onSuccess={() => updateSession({ step: "alumni-info" })}
          onBack={handleBack}
        />
      )}

      {/* ── ALUMNI RELATIVE INFORMATION ─────────────────────────────────── */}
      {session.step === "alumni-info" && session.schoolLevel && session.applicantType && session.applicantId && (
        <AlumniRelativeInformation
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          applicantId={session.applicantId}
          onSuccess={() => updateSession({ step: "program-selection" })}
          onBack={handleBack}
        />
      )}

      {/* ── PROGRAM SELECTION ───────────────────────────────────────────── */}
      {session.step === "program-selection" && session.schoolLevel && session.applicantType && (
        <ProgramSelection
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          onSuccess={handleProgramSelectionSuccess}
          onBack={handleBack}
        />
      )}

      {/* ── DOCUMENT CENTER ─────────────────────────────────────────────── */}
      {session.step === "documents" && session.schoolLevel && session.applicantType && session.applicantId && (
        <>
          <div className="px-4 pt-4">
            <DocumentCenter
              requirements={requirements}
              schoolLevel={session.schoolLevel}
              applicantType={session.applicantType}
              applicantId={session.applicantId}
            />
          </div>
          <div className="mx-4 mt-6 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-4 pb-5 sm:flex-row sm:justify-end">
            {submitError && (
              <p
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:mr-auto"
                role="alert"
              >
                {submitError}
              </p>
            )}
            <button
              onClick={handleSubmitApplication}
              className="h-11 rounded-md bg-campus-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 sm:min-w-44"
            >
              Submit Application
            </button>
          </div>
        </>
      )}

      {/* ── CONFIRMATION ────────────────────────────────────────────────── */}
      {session.step === "confirmation" && session.referenceNumber && (
        <ApplicationConfirmation
          referenceNumber={session.referenceNumber}
          email={session.email}
          schoolLevel={session.schoolLevel!}
          applicantType={session.applicantType!}
          applicantName={`${session.firstName} ${session.lastName}`.trim() || "Applicant"}
        />
      )}

      {/* ── ACTIVITY LOG ────────────────────────────────────────────────── */}
      {session.step === "activity-log" && session.schoolLevel && session.applicantType && session.applicantId && (
        <ActivityLog
          schoolLevel={session.schoolLevel}
          applicantType={session.applicantType}
          applicantId={session.applicantId}
        />
      )}

      {/* ── RESULT ──────────────────────────────────────────────────────── */}
      {session.step === "result" && session.schoolLevel && session.applicantType && session.applicantId && (
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
          <AdmissionResultPortal
            applicantId={session.applicantId}
            schoolLevel={session.schoolLevel}
            applicantType={session.applicantType}
            firstName={session.firstName}
            lastName={session.lastName}
            collegeProgram={session.collegeProgram}
            collegeDepartment={session.collegeDepartment}
            seniorHighTrack={session.seniorHighTrack}
            tvlStrand={session.tvlStrand}
          />
        </div>
      )}
    </AdmissionsMobileLayout>
  );
}
