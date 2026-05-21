import {
  LayoutDashboard,
  Settings,
  Users,
  BookOpen,
  GraduationCap,
  Briefcase,
  Wallet,
  Receipt,
  Banknote,
  CalendarCheck,
  Clock,
  BookText,
  Trophy,
  MessageSquare,
  Smartphone,
  Video,
  FileText,
  CreditCard,
  Percent,
  Calculator,
  ShieldCheck,
  Star,
  Palette,
  UserCog,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  items?: NavItem[];
  locked?: boolean;
}

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "General Settings",
    href: "/general-settings",
    icon: Settings,
    items: [
      { title: "Institute Profile", href: "/general-settings?tab=institute-profile" },
      { title: "Fees Particulars", href: "/general-settings?tab=fees-particulars" },
      { title: "Accounts For Fees Invoice", href: "/general-settings?tab=accounts-fees-invoice" },
      { title: "Rules & Regulations", href: "/general-settings?tab=rules-regulations" },
      { title: "Marks Grading", href: "/general-settings?tab=marks-grading" },
      { title: "Account Settings", href: "/general-settings?tab=account-settings" },
    ],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: BookOpen,
    items: [
      { title: "All Classes", href: "/classes?tab=all-classes" },
      { title: "New Class", href: "/classes?tab=new-class" },
    ],
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: BookText,
    items: [
      { title: "Classes With Subjects", href: "/subjects?tab=classes-with-subjects" },
      { title: "Assign Subjects", href: "/subjects?tab=assign-subjects" },
    ],
  },
  {
    title: "Students",
    href: "/students",
    icon: GraduationCap,
    items: [
      { title: "All Students", href: "/students?tab=all-students" },
      { title: "Add New", href: "/students?tab=add-new" },
      { title: "Admission Letter", href: "/students?tab=admission-letter" },
      { title: "Student ID Cards", href: "/students?tab=student-id-cards" },
      { title: "Print Basic List", href: "/students?tab=print-basic-list" },
      { title: "Manage Login", href: "/students?tab=manage-login" },
    ],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Briefcase,
    items: [
      { title: "All Employees", href: "/employees?tab=all-employees" },
      { title: "Add New", href: "/employees?tab=add-new" },
      { title: "Job Letter", href: "/employees?tab=job-letter" },
      { title: "Manage Login", href: "/employees?tab=manage-login" },
    ],
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Wallet,
    items: [
      { title: "Admin Users", href: "/accounts?tab=admin-users" },
      { title: "Permissions", href: "/accounts?tab=permissions" },
      { title: "Invitations", href: "/accounts?tab=invitations" },
    ],
  },
  {
    title: "Fees",
    href: "/fees",
    icon: Banknote,
    items: [
      { title: "Generate Fees Invoice", href: "/fees?tab=generate-fees-invoice" },
      { title: "Collect Fees", href: "/fees?tab=collect-fees" },
      { title: "Fees Paid Slip", href: "/fees?tab=fees-paid-slip" },
      { title: "Fees Defaulters", href: "/fees?tab=fees-defaulters" },
    ],
  },
  {
    title: "Salary",
    href: "/salary",
    icon: Banknote,
    items: [
      { title: "Payroll Setup", href: "/salary?tab=payroll-setup" },
      { title: "Allowances", href: "/salary?tab=allowances" },
      { title: "Payslips", href: "/salary?tab=payslips" },
    ],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    items: [
      { title: "Students Attendance", href: "/attendance?tab=students-attendance" },
      { title: "Employees Attendance", href: "/attendance?tab=employees-attendance" },
      { title: "Class wise Report", href: "/attendance?tab=class-wise-report" },
      { title: "Students Attendance Report", href: "/attendance?tab=students-attendance-report" },
      { title: "Employees Attendance Report", href: "/attendance?tab=employees-attendance-report" },
    ],
  },
];
