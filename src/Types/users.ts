export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  genderName: string | null;
  nearestLandmark: string | null;
  residentDistrictId: string | null;
  residentSectorId: string | null;
  cohortId: number | null;
  track: string | null;
  roleId: string | null;
  role: Role | null;
  organizationFoundedId: number | null;
  positionInFounded: string | null;
  organizationEmployedId: number | null;
  positionInEmployed: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
}

export interface Payload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: Role;
  id: string;
}
