'use client'
import { useState, useEffect } from "react";
import { 
  ArrowLeft, BookOpen, Smartphone, Laptop, Database, ArrowRight, CheckCircle, 
  User, Users, GraduationCap, FileText, Settings, Award 
} from "lucide-react";
import { fetchLiveTableCounts, type TableCounts } from "../../services/admin.service";

interface AdmissionsScopeGuidePageProps {
  onBack: () => void;
  onNavigateToView: (view: string) => void;
}

export function AdmissionsScopeGuidePage({ onBack, onNavigateToView }: AdmissionsScopeGuidePageProps) {
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [tableCounts, setTableCounts] = useState<TableCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState<boolean>(true);

  useEffect(() => {
    async function loadCounts() {
      setLoadingCounts(true);
      const res = await fetchLiveTableCounts();
      if (res.data) {
        setTableCounts(res.data);
      }
      setLoadingCounts(false);
    }
    loadCounts();
  }, []);

  const getLiveCount = (tableId: string) => {
    if (loadingCounts || !tableCounts) return "fetching...";
    switch (tableId) {
      case "personal": return `${tableCounts.profiles} profiles`;
      case "parent": return `${tableCounts.parents} profiles`;
      case "academic": return `${tableCounts.academic} entries`;
      case "alumni": return `${tableCounts.alumni} legacies`;
      case "documents": return `${tableCounts.documents} attachments`;
      default: return "0";
    }
  };

  const sections = [
    {
      id: "personal",
      title: "Personal Profile",
      icon: User,
      color: "amber",
      table: "applicant_profiles",
      mobileFields: [
        "First Name",
        "Middle Name (Required validation)",
        "Last Name",
        "Birthdate (Strict age limit validation)",
        "Address & Mobile Number",
      ],
      adminCapabilities: [
        "Identity verification check",
        "Full-name parsing audit",
        "Age compliance calculation",
        "Quick profile correction",
      ],
      targetAction: "applications",
      actionLabel: "Verify Profiles"
    },
    {
      id: "parent",
      title: "Parent Information",
      icon: Users,
      color: "blue",
      table: "parent_information",
      mobileFields: [
        "Father Full Name & Sublabel Guide",
        "Father Contact & Home Address",
        "Mother Full Name & Sublabel Guide",
        "Mother Contact & Home Address",
        "Guardian Contact Details",
      ],
      adminCapabilities: [
        "Parent validation audit",
        "Primary emergency contact setup",
        "Address correlation checks",
      ],
      targetAction: "applications",
      actionLabel: "Audit Relations"
    },
    {
      id: "academic",
      title: "Academic Background",
      icon: GraduationCap,
      color: "purple",
      table: "academic_background",
      mobileFields: [
        "Previous Grade Level",
        "School Name",
        "Completion Year (Typeable & Date Picker validation)",
      ],
      adminCapabilities: [
        "Chronological history audit",
        "Validation of high school strands",
        "Verification of completion dates",
      ],
      targetAction: "applications",
      actionLabel: "Review Backgrounds"
    },
    {
      id: "alumni",
      title: "Alumni Relatives",
      icon: Award,
      color: "green",
      table: "alumni_relatives",
      mobileFields: [
        "Relative Full Name",
        "Relationship Type Select Dropdown",
        "College / Department Attended",
        "Batch Graduation Year",
        "Relative Contact Phone",
      ],
      adminCapabilities: [
        "Legacy prioritization matching",
        "Alumni registry reconciliation",
        "Awarding legacy admission weights",
      ],
      targetAction: "applications",
      actionLabel: "Verify Legacy Profiles"
    },
    {
      id: "documents",
      title: "Document Center",
      icon: FileText,
      color: "red",
      table: "applicant_documents",
      mobileFields: [
        "PSA Birth Certificate File",
        "Grade Report Cards & Transcripts",
        "Certificate of Good Moral Character",
        "Interactive File Attachments",
      ],
      adminCapabilities: [
        "High-res document auditing",
        "Individual file validation",
        "Automated PDF & Image viewing",
        "Requesting Re-uploads from Mobile",
      ],
      targetAction: "document-verification",
      actionLabel: "Start Document Audits"
    }
  ];

  const currentData = sections.find(s => s.id === activeSection) || sections[0];
  const IconComponent = currentData.icon;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Admissions Guide</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Mobile Admissions Scope Guide</h1>
            <p className="text-sm text-gray-500 mt-0.5">Understand how applicant data submitted on mobile connects to administrative operations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Side Navigation Menu */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Admissions Steps</h3>
          {sections.map((sect) => {
            const SectIcon = sect.icon;
            const isActive = sect.id === activeSection;
            return (
              <button
                key={sect.id}
                onClick={() => setActiveSection(sect.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all text-left ${
                  isActive
                    ? "border-[#F59E0B] bg-amber-50/50 text-[#F59E0B] shadow-sm"
                    : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <SectIcon className={`w-4 h-4 ${isActive ? "text-[#F59E0B]" : "text-gray-400"}`} />
                <span>{sect.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Scope Viewer Card */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
            
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[#F59E0B]">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentData.title}</h2>
                  <p className="text-xs text-gray-500 font-mono flex items-center flex-wrap gap-1.5 mt-0.5">
                    <Database className="w-3.5 h-3.5" />
                    Supabase Table: <span className="underline">{currentData.table}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-2 animate-pulse">
                      Live Database: {getLiveCount(currentData.id)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToView(currentData.targetAction)}
                className="px-4 h-10 rounded-xl bg-[#1a1a1a] text-white font-bold text-xs hover:bg-black transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{currentData.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Comparison View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Mobile Inputs Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Smartphone className="w-24 h-24 text-gray-900" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Collected via Mobile</h3>
                </div>
                <ul className="space-y-3">
                  {currentData.mobileFields.map((field, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Web Dashboard Capability Card */}
              <div className="bg-[#1a1a1a] rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Laptop className="w-24 h-24 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Laptop className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wide">Web Admin Capability</h3>
                </div>
                <ul className="space-y-3">
                  {currentData.adminCapabilities.map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-200">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Summary Tip Alert */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin-slow" />
              <div>
                <p className="text-xs text-blue-900 font-bold mb-0.5">Integrity Sync Tip</p>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Validation limits on the mobile applicant forms (e.g. required Middle name, typeable calendar completion years, and birthdate boundaries) are tied to database constraints so that Web Admins can process fully clean applications without format reconciliation.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
