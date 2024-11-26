const cohorts = [
  {
    id: 1,
    name: "Not Specified",
    description: "Default Value when user did not choose any cohort",
    createdAt: new Date(),
  },
];

for (let i = 2; i <= 56; i++) {
  cohorts.push({
    id: i,
    name: String(i),
    description: String(i),
    createdAt: new Date(),
  });
}

export { cohorts };
