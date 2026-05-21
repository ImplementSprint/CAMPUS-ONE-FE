import type { ResourceName } from "@/lib/backend/types";

export type FieldConfig = {
  key: string;
  label: string;
  placeholder: string;
};

export type ResourceConfig = {
  resource: ResourceName;
  title: string;
  description: string;
  statusLabel: string;
  fields: FieldConfig[];
  columns: string[];
};

export const resourceConfigs: Record<ResourceName, ResourceConfig> = {
  classes: {
    resource: "classes",
    title: "Class Setup",
    description: "Create class sections, assign advisers, rooms, and setup readiness statuses.",
    statusLabel: "Class setup records",
    fields: [
      { key: "name", label: "Class Name", placeholder: "Enter class name" },
      { key: "adviser", label: "Adviser", placeholder: "Enter adviser name" },
      { key: "students", label: "Students", placeholder: "Enter student count" },
      { key: "room", label: "Room", placeholder: "Enter room number" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["name", "adviser", "students", "room", "status"],
  },
  subjects: {
    resource: "subjects",
    title: "Subject Setup",
    description: "Manage subject offerings, grade levels, units, and assigned teachers.",
    statusLabel: "Subject records",
    fields: [
      { key: "code", label: "Code", placeholder: "Enter subject code" },
      { key: "subject", label: "Subject", placeholder: "Enter subject name" },
      { key: "level", label: "Level", placeholder: "Enter grade level" },
      { key: "units", label: "Units", placeholder: "Enter number of units" },
      { key: "teacher", label: "Teacher", placeholder: "Enter teacher name" },
    ],
    columns: ["code", "subject", "level", "units", "teacher"],
  },
  students: {
    resource: "students",
    title: "Student Setup",
    description: "Prepare student records and enrollment statuses for the future student service.",
    statusLabel: "Student records",
    fields: [
      { key: "id", label: "Student ID", placeholder: "Enter student ID" },
      { key: "name", label: "Name", placeholder: "Enter student name" },
      { key: "level", label: "Level", placeholder: "Enter grade level" },
      { key: "section", label: "Section", placeholder: "Enter section name" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["id", "name", "level", "section", "status"],
  },
  employees: {
    resource: "employees",
    title: "Employee Setup",
    description: "Add faculty and admin staff who will later use admin and professor views.",
    statusLabel: "Employee records",
    fields: [
      { key: "name", label: "Name", placeholder: "Enter employee name" },
      { key: "role", label: "Role", placeholder: "Enter role" },
      { key: "department", label: "Department", placeholder: "Enter department" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["name", "role", "department", "status"],
  },
  accounts: {
    resource: "accounts",
    title: "Account Setup",
    description: "Invite school admins and define initial access for registration/admin modules.",
    statusLabel: "Account records",
    fields: [
      { key: "user", label: "User Email", placeholder: "Enter email address" },
      { key: "role", label: "Role", placeholder: "Enter role" },
      { key: "access", label: "Access", placeholder: "Enter access level" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["user", "role", "access", "status"],
  },
  fees: {
    resource: "fees",
    title: "Fee Setup",
    description: "Draft tuition, miscellaneous fees, and collection statuses.",
    statusLabel: "Fee records",
    fields: [
      { key: "fee", label: "Fee Name", placeholder: "Enter fee name" },
      { key: "coverage", label: "Coverage", placeholder: "Enter coverage" },
      { key: "amount", label: "Amount", placeholder: "Enter amount" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["fee", "coverage", "amount", "status"],
  },
  salary: {
    resource: "salary",
    title: "Salary Setup",
    description: "Prepare payroll rows for employee salary and payslip setup.",
    statusLabel: "Payroll records",
    fields: [
      { key: "employee", label: "Employee", placeholder: "Enter employee name" },
      { key: "position", label: "Position", placeholder: "Enter position" },
      { key: "baseSalary", label: "Base Salary", placeholder: "Enter base salary" },
      { key: "cycle", label: "Cycle", placeholder: "Enter pay cycle" },
      { key: "status", label: "Status", placeholder: "Enter status" },
    ],
    columns: ["employee", "position", "baseSalary", "cycle", "status"],
  },
  attendance: {
    resource: "attendance",
    title: "Attendance Setup",
    description: "Monitor class attendance placeholders and readiness for daily reporting.",
    statusLabel: "Attendance rows",
    fields: [
      { key: "class", label: "Class", placeholder: "Enter class name" },
      { key: "expected", label: "Expected", placeholder: "Enter expected count" },
      { key: "present", label: "Present", placeholder: "Enter present count" },
      { key: "absent", label: "Absent", placeholder: "Enter absent count" },
      { key: "rate", label: "Rate", placeholder: "Enter attendance rate" },
    ],
    columns: ["class", "expected", "present", "absent", "rate"],
  },
};
