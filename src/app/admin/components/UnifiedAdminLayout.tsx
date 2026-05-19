'use client'
import { ReactNode, useState, useEffect } from "react";
import { logout, getCurrentUser } from "@/services/auth.service";
import { LogOut, LayoutDashboard, FileText, GraduationCap, Bell, ChevronDown, ChevronRight, Inbox, FileCheck, CheckCircle, ClipboardList, Calendar, Shield, Users, BarChart3, HelpCircle, FileText as FileTextIcon, BookOpen } from "lucide-react";

interface UnifiedAdminLayoutProps {
  children: ReactNode;
  currentPortal: "applicant" | "student";
  currentView: string;
  onNavigate?: (view: string) => void;
  onSwitchPortal?: (portal: "applicant" | "student") => void;
}

export function UnifiedAdminLayout({ 
  children, 
  currentPortal, 
  currentView, 
  onNavigate,
  onSwitchPortal 
}: UnifiedAdminLayoutProps) {
  const user = getCurrentUser();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "admissions-pipeline",
    "candidate-assessment",
    "service-configuration",
    "support-operations"
  ]);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Get admin role from session storage only on client
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setAdminRole(sessionStorage.getItem('admin_role'));
    }
  }, []);

  const isSuperAdmin = adminRole === 'super_admin';
  const isApplicantAdmin = adminRole === 'applicant_admin';
  const isStudentAdmin = adminRole === 'student_admin';
  const isAlumniAdmin = adminRole === 'alumni_admin';

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const applicantMenuStructure = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      type: "single" as const
    },
    {
      id: "admissions-scope-guide",
      label: "Admissions Scope Guide",
      icon: BookOpen,
      type: "single" as const
    },
    {
      id: "admissions-pipeline",
      label: "Admissions Pipeline",
      type: "folder" as const,
      items: [
        { id: "application-queue", label: "Application Queue", icon: Inbox },
        { id: "document-verification", label: "Document Verification", icon: FileCheck },
        { id: "selection-decisioning", label: "Selection & Decisioning", icon: CheckCircle },
      ]
    },
    {
      id: "candidate-assessment",
      label: "Candidate Assessment",
      type: "folder" as const,
      items: [
        { id: "entrance-examination", label: "Entrance Examination", icon: ClipboardList },
        { id: "interview-coordination", label: "Interview Coordination", icon: Calendar },
      ]
    },
    {
      id: "service-configuration",
      label: "Service Configuration",
      type: "folder" as const,
      items: [
        { id: "eligibility-criteria", label: "Eligibility Criteria", icon: Shield },
        { id: "enrollment-quotas", label: "Enrollment Quotas", icon: Users },
        { id: "admissions-analytics", label: "Admissions Analytics", icon: BarChart3 },
      ]
    },
    {
      id: "support-operations",
      label: "Support Operations",
      type: "folder" as const,
      items: [
        { id: "applicant-helpdesk", label: "Applicant Help Desk", icon: HelpCircle },
        { id: "transmission-logs", label: "Transmission Logs", icon: FileTextIcon },
      ]
    }
  ];

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: GraduationCap },
  ];

  const menuStructure = currentPortal === "applicant" ? applicantMenuStructure : studentMenuItems;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white flex flex-col flex-shrink-0 shadow-2xl">
        {/* Logo */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[#F59E0B] font-bold text-xl">CAMPUS</span>
                <span className="text-white font-light text-xl">Admin</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 ml-12 -mt-1">
            {currentPortal === "applicant" ? "Applicant Management" : "Student Management"}
          </p>
        </div>

        {/* Portal Switcher - Only for Super Admin */}
        {isMounted && isSuperAdmin && (
          <div className="p-6 border-b border-gray-800">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Switch Portal</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSwitchPortal?.("applicant")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  currentPortal === "applicant"
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/30"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
                }`}
              >
                Applicants
              </button>
              <button
                onClick={() => onSwitchPortal?.("student")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  currentPortal === "student"
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/30"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
                }`}
              >
                Students
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <p className="text-xs text-gray-400 mb-3 px-3 uppercase tracking-wider font-semibold">Menu</p>
          <div className="space-y-1">
            {currentPortal === "applicant" ? (
              <>
                {applicantMenuStructure.map((item) => {
                  if (item.type === "single") {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate?.(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
                            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  }

                  // Folder type
                  const isExpanded = expandedSections.includes(item.id);
                  
                  return (
                    <div key={item.id} className="mb-2">
                      <button
                        onClick={() => toggleSection(item.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-gray-200 uppercase tracking-wider transition-colors"
                      >
                        <span>{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isActive = currentView === subItem.id;
                            
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => onNavigate?.(subItem.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ml-2 ${
                                  isActive
                                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
                                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                                {subItem.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {studentMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate?.(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-gray-800">
          <div className="mb-4 px-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white shadow-lg">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 border border-gray-800 hover:border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-20 flex items-center justify-between px-10 flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
              {currentView === "dashboard" && "Dashboard"}
              {currentView === "admissions-scope-guide" && "Admissions Scope Guide"}
              {currentView === "applications" && "Applications"}
              {currentView === "application-queue" && "Application Queue"}
              {currentView === "document-verification" && "Document Verification"}
              {currentView === "selection-decisioning" && "Selection & Decisioning"}
              {currentView === "entrance-examination" && "Entrance Examination"}
              {currentView === "interview-coordination" && "Interview Coordination"}
              {currentView === "eligibility-criteria" && "Eligibility Criteria"}
              {currentView === "enrollment-quotas" && "Enrollment Quotas"}
              {currentView === "admissions-analytics" && "Admissions Analytics"}
              {currentView === "applicant-helpdesk" && "Applicant Help Desk"}
              {currentView === "transmission-logs" && "Transmission Logs"}
              {currentView === "students" && "Students"}
              {currentView === "detail" && (currentPortal === "applicant" ? "Application Details" : "Student Details")}
            </h1>
            <p className="text-sm text-gray-500">
              {currentView === "dashboard" && `Welcome back, ${user?.name || "Admin"}`}
              {currentView === "admissions-scope-guide" && "Explore how mobile inputs map to web administrative workflows"}
              {currentView === "applications" && "Manage and review all applications"}
              {currentView === "application-queue" && "Central intake for all new submissions"}
              {currentView === "document-verification" && "Verify birth certificates, IDs, and transcripts"}
              {currentView === "selection-decisioning" && "Final approvals or rejections"}
              {currentView === "entrance-examination" && "Schedule and encode admission test results"}
              {currentView === "interview-coordination" && "Manage faculty and dean interview schedules"}
              {currentView === "eligibility-criteria" && "Define mandatory requirements for each program"}
              {currentView === "enrollment-quotas" && "Real-time management of available slots"}
              {currentView === "admissions-analytics" && "Visual reports on application traffic"}
              {currentView === "applicant-helpdesk" && "Resolve issues and inquiries from applicants"}
              {currentView === "transmission-logs" && "Audit trail of alerts and emails"}
              {currentView === "students" && "Manage enrolled students"}
              {currentView === "detail" && "View and manage details"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-sm text-gray-900">
                  {user?.name || "Admin"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white shadow-lg">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
