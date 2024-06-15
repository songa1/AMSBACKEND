export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  genderName: string;
  nearestLandmark: string;
  residentDistrictId: string;
  residentSectorId: string;
  cohortId: number;
  track: string;
  organizationFoundedId: number;
  positionInFounded: string;
  organizationEmployedId: number;
  positionInEmployed: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  id: string;
}
