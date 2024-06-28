export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const roles = [
  {
    id: "11",
    name: Role?.ADMIN,
    createdAt: new Date(),
  },
  {
    id: "12",
    name: Role?.USER,
    createdAt: new Date(),
  },
];
