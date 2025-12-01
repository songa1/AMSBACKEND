// Add this small helper — makes everything safe
export const safeConnect = (id: any) => {
  return id ? { connect: { id } } : undefined;
};
