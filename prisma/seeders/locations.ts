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

      // const cells = rwanda.Cells(province, district, sector) ?? [];

      // for (const [m, cell] of cells.entries()) {
      //   const cellId = `${sectorId}-${m + 1}`;
      //   cellData.push({
      //     id: cellId,
      //     name: cell,
      //     sectorId: sectorId,
      //     createdAt: new Date(),
      //   });

      //   const villages =
      //     rwanda.Villages(province, district, sector, cell) ?? [];

      //   for (const [d, village] of villages.entries()) {
      //     const villageId = `${districtId}-${cellId}-${d + 1}`;
      //     villageData.push({
      //       id: villageId,
      //       name: village,
      //       cellId: cellId,
      //       createdAt: new Date(),
      //     });
      //   }
      // }
    }
  }
}

export { districtsData, sectorData, cellData, villageData };
