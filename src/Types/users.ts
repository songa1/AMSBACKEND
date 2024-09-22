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
  residentCountryId: string | null;
  residentCountry: Country | null;
  residentDistrictId: string | null;
  residentSectorId: string | null;
  cohortId: number | null;
  track: Track | null;
  isRwandan: boolean | null;
  trackId: string | null;
  roleId: string | null;
  role: Role | null;
  bio: string | null;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  state: State;
  organizationFoundedId: number | null;
  positionInFounded: string | null;
  organizationEmployedId: number | null;
  positionInEmployed: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  profileImage: ProfileImage | null;
  profileImageId: string | null;
}

export interface ProfileImage {
  id: string;
  link: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  createdAt: string;
}

export interface State {
  id: string;
  name: string;
  countryCode: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
}

export interface WorkingSector {
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
