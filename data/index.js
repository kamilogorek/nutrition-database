import bobbyburger from "./bobbyburger.json";
import dagrasso from "./dagrasso.json";
import goodlood from "./goodlood.json";
import lajkonik from "./lajkonik.json";
import pasibus from "./pasibus.json";

const companies = {
  ["Bobby Burger"]: bobbyburger,
  ["DaGrasso"]: dagrasso,
  ["GoodLood"]: goodlood,
  ["Lajkonik"]: lajkonik,
  ["Pasibus"]: pasibus
};

const dataset = Object.keys(companies)
  .map(company =>
    companies[company].map(v => ({
      company,
      ...v
    }))
  )
  .flat();

export { companies, dataset };
