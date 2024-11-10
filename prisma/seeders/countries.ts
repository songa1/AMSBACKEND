import csc from "countries-states-cities";
import { randomUUID } from "crypto";

const countryList = csc.getAllCountries();

const countries = countryList.map((country) => {
  return {
    id: country.iso2,
    name: country.name,
    cId: country.id,
    createdAt: new Date(),
  };
});

const state: any = countries.map((c) => {
  const stateList = csc.getStatesOfCountry(c.cId);
  const sts = stateList.map((s) => {
    const cities = csc.getCitiesOfState(s.id).map((y) => {
      return {
        id: randomUUID(),
        name: y.name,
        countryCode: y.country_code,
        createdAt: new Date(),
      };
    });

    return [
      ...cities,
      {
        id: s.state_code || randomUUID(),
        name: s.name,
        countryCode: s.country_code,
        createdAt: new Date(),
      },
    ];
  });
  return sts.flat();
});

const states = state.flat();

countries.push({
  id: "unspecified",
  name: "Not specified",
  cId: 1000000,
  createdAt: new Date(),
});

states.push({
  id: "unspecified",
  name: "Not specified",
  countryCode: "unspecified",
  createdAt: new Date(),
});

export { countries, states };
