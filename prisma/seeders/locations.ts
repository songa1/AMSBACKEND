// @ts-ignore
import rwanda from "rwanda";

const provinces = rwanda.Provinces();
const districtsData: any[] = [];
const sectorData: any[] = [];
const cellData: any[] = [];
const villageData: any[] = [];

for (const province of provinces) {
  const districts = rwanda.Districts(province) ?? [];

  for (const [k, district] of districts.entries()) {
    const districtId = `${province}-${k + 1}`;
    districtsData.push({
      id: districtId,
      name: district,
      createdAt: new Date(),
    });

    const sectors = rwanda.Sectors(province, district) ?? [];

    for (const [j, sector] of sectors.entries()) {
      const sectorId = `${districtId}-${j + 1}`;
      sectorData.push({
        id: sectorId,
        name: sector,
        districtName: district,
        createdAt: new Date(),
      });
    }
  }
}



districtsData.push({
  id: "unspecified",
  name: "Not Specified",
  createdAt: new Date(),
});

sectorData.push({
  id: "unspecified",
  name: "Not Specified",
  districtName: "Not Specified",
  createdAt: new Date(),
});

export { districtsData, sectorData, cellData, villageData };
