export type PublicSchool = {
  schoolId: string;
  schoolSlug: string;
  displayName: string;
  schoolType?: string | null;
  status?: string | null;
};

export type SelectedSchool = {
  schoolId: string;
  schoolSlug: string;
  displayName: string;
  apiBaseUrl: string;
};

export type TenantHeaders = {
  'X-School-Slug'?: string;
};

export type SchoolRegistrationRequest = {
  name: string;
  representative: string;
  email: string;
  contactNumber: string;
  schoolType: string;
  targetSubdomain: string;
};

export type SchoolRegistrationResponse = {
  message: string;
  school: PublicSchool;
  next?: string;
};
