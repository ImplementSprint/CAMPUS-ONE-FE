import type { SchoolProfile } from "@/lib/backend/types";
import { cn } from "@/lib/utils";

type RegistrationSummaryProps = {
  school: SchoolProfile;
};

export function RegistrationSummary({ school }: RegistrationSummaryProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <div className="flex items-start justify-between gap-6 pb-6 border-b border-gray-200 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
            Registration details
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 tracking-tight">{school.name || "School Name Not Set"}</h2>
          <p className="mt-2 text-[13px] text-gray-500 font-medium">
            Representative: <span className="text-gray-900">{school.representative || "N/A"}</span> / <span className="text-gray-900">{school.email || "N/A"}</span>
          </p>
        </div>
        <span className="rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
          {school.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {[
          { label: "Target subdomain", value: school.targetSubdomain || "Not set" },
          { label: "School type", value: school.schoolType || "Not set" },
          { label: "Contact", value: school.contactNumber || "Not set" },
          { label: "Setup progress", value: `${school.setupProgress}%` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-[14px] font-bold text-gray-900 tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
