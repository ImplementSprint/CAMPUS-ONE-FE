'use client'
import { useState } from "react";
import { AlumniSignUpHome } from "../components/AlumniSignUpHome";
import { AlumniCreateAccount } from "../components/AlumniCreateAccount";
import { AlumniProfile } from "../components/AlumniProfile";
import { AlumniConfirmation } from "../components/AlumniConfirmation";

export type AlumniSignUpStep = "home" | "create-account" | "profile" | "confirmation";

export interface AlumniSignUpSession {
  step: AlumniSignUpStep;
  alumniId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  graduationYear: number | null;
  department: string;
  referenceNumber: string | null;
}

export function AlumniSignUpPage() {
  const [session, setSession] = useState<AlumniSignUpSession>({
    step: "home",
    alumniId: null,
    email: "",
    firstName: "",
    lastName: "",
    graduationYear: null,
    department: "",
    referenceNumber: null,
  });

  const updateSession = (patch: Partial<AlumniSignUpSession>) =>
    setSession((prev) => ({ ...prev, ...patch }));

  const renderStep = () => {
    switch (session.step) {
      case "home":
        return <AlumniSignUpHome onStart={() => updateSession({ step: "create-account" })} />;
      case "create-account":
        return (
          <AlumniCreateAccount
            onSuccess={(alumniId, email) => {
              updateSession({ step: "profile", alumniId, email });
            }}
            onBack={() => updateSession({ step: "home" })}
          />
        );
      case "profile":
        return (
          <AlumniProfile
            alumniId={session.alumniId!}
            email={session.email}
            onSuccess={(refNum) => {
              updateSession({ step: "confirmation", referenceNumber: refNum });
            }}
            onBack={() => updateSession({ step: "create-account" })}
          />
        );
      case "confirmation":
        return <AlumniConfirmation referenceNumber={session.referenceNumber} />;
      default:
        return null;
    }
  };

  return renderStep();
}

