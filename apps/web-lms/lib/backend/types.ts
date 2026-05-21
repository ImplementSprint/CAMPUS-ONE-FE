export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type ResourceName =
  | "classes"
  | "subjects"
  | "students"
  | "employees"
  | "accounts"
  | "fees"
  | "salary"
  | "attendance";

export type BackendRecord = Record<string, string>;

export type SchoolProfile = {
  id: string;
  name: string;
  representative: string;
  email: string;
  contactNumber: string;
  schoolType: string;
  targetSubdomain: string;
  status: "draft" | "submitted" | "approved";
  setupProgress: number;
};

export type ActionLog = {
  id: string;
  label: string;
  module: string;
  createdAt: string;
};

export type CampusDb = {
  schools: Record<string, SchoolProfile>;
  users: User[];
  classes: BackendRecord[];
  subjects: BackendRecord[];
  students: BackendRecord[];
  employees: BackendRecord[];
  accounts: BackendRecord[];
  fees: BackendRecord[];
  salary: BackendRecord[];
  attendance: BackendRecord[];
  activities: string[];
  actionLogs: ActionLog[];
};

export const resourceNames: ResourceName[] = [
  "classes",
  "subjects",
  "students",
  "employees",
  "accounts",
  "fees",
  "salary",
  "attendance",
];
