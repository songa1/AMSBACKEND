const cohorts = [
  {
    id: 0,
    name: "Not Specified",
    description: "Default Value when user did not choose any cohort",
    createdAt: new Date(),
  },
];

for (let i = 1; i <= 55; i++) {
  cohorts.push({
    id: i,
    name: String(i),
    description: String(i),
    createdAt: new Date(),
  });
}

export { cohorts };
