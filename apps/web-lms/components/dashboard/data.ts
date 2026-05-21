export type NavItem = {
  label: string;
  href: string;
  marker: string;
  children?: NavChild[];
};

export type NavChild = {
  label: string;
  tab: string;
};

export function getActiveChild(parentHref: string, tab?: string | string[]) {
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  const parent = navItems.find((item) => item.href === parentHref);

  return parent?.children?.find((child) => child.tab === tabValue);
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", marker: "DB" },
  {
    label: "General Settings",
    href: "/general-settings",
    marker: "GS",
    children: [
      { label: "Institute Profile", tab: "institute-profile" },
      { label: "Fees Particulars", tab: "fees-particulars" },
      { label: "Accounts For Fees Invoice", tab: "accounts-fees-invoice" },
      { label: "Rules & Regulations", tab: "rules-regulations" },
      { label: "Marks Grading", tab: "marks-grading" },
      { label: "Account Settings", tab: "account-settings" },
    ],
  },
  {
    label: "Classes",
    href: "/classes",
    marker: "CL",
    children: [
      { label: "All Classes", tab: "all-classes" },
      { label: "New Class", tab: "new-class" },
    ],
  },
  {
    label: "Subjects",
    href: "/subjects",
    marker: "SB",
    children: [
      { label: "Classes With Subjects", tab: "classes-with-subjects" },
      { label: "Assign Subjects", tab: "assign-subjects" },
    ],
  },
  {
    label: "Students",
    href: "/students",
    marker: "ST",
    children: [
      { label: "All Students", tab: "all-students" },
      { label: "Add New", tab: "add-new" },
      { label: "Admission Letter", tab: "admission-letter" },
      { label: "Student ID Cards", tab: "student-id-cards" },
      { label: "Print Basic List", tab: "print-basic-list" },
      { label: "Manage Login", tab: "manage-login" },
    ],
  },
  {
    label: "Employees",
    href: "/employees",
    marker: "EM",
    children: [
      { label: "All Employees", tab: "all-employees" },
      { label: "Add New", tab: "add-new" },
      { label: "Job Letter", tab: "job-letter" },
      { label: "Manage Login", tab: "manage-login" },
    ],
  },
  {
    label: "Accounts",
    href: "/accounts",
    marker: "AC",
    children: [
      { label: "Admin Users", tab: "admin-users" },
      { label: "Permissions", tab: "permissions" },
      { label: "Invitations", tab: "invitations" },
    ],
  },
  {
    label: "Fees",
    href: "/fees",
    marker: "FE",
    children: [
      { label: "Generate Fees Invoice", tab: "generate-fees-invoice" },
      { label: "Collect Fees", tab: "collect-fees" },
      { label: "Fees Paid Slip", tab: "fees-paid-slip" },
      { label: "Fees Defaulters", tab: "fees-defaulters" },
    ],
  },
  {
    label: "Salary",
    href: "/salary",
    marker: "SA",
    children: [
      { label: "Payroll Setup", tab: "payroll-setup" },
      { label: "Allowances", tab: "allowances" },
      { label: "Payslips", tab: "payslips" },
    ],
  },
  {
    label: "Attendance",
    href: "/attendance",
    marker: "AT",
    children: [
      { label: "Students Attendance", tab: "students-attendance" },
      { label: "Employees Attendance", tab: "employees-attendance" },
      { label: "Class wise Report", tab: "class-wise-report" },
      { label: "Students Attendance Report", tab: "students-attendance-report" },
      { label: "Employees Attendance Report", tab: "employees-attendance-report" },
    ],
  },
];

