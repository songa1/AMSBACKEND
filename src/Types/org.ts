import { WorkingSector } from "./users";

export interface Gender {
  id: string;
  name: string;
}

export interface ResidentDistrict {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  countryCode: string;
}

export interface ResidentSector {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  workingSectorId: string;
  districtId: string;
  countryId: number;
  sectorId: string;
  stateId: string;
  website: string;
}
