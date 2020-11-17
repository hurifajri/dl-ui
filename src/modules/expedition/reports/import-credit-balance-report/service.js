import { inject, Lazy } from "aurelia-framework";
import { RestService } from "../../../../utils/rest-service";

const serviceUri = "credit-balance/reports";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "finance");
  }

  search(info) {
    let endpoint = `${serviceUri}`;
    return super.list(endpoint, info);
  }

  getXls(info) {
    var query = "";
    if (info.supplierName != null) {
      query = `?supplierName=${info.supplierName}&month=${info.month}&year=${info.year}&isImport=${info.isImport}`;
    } else {
      query = `?month=${info.month}&year=${info.year}&isImport=${info.isImport}`;
    }

    let endpoint = `${serviceUri}/downloads/xls${query}`;
    return super.getXls(endpoint);
  }

  getPdf(info) {
    var query = "";
    if (info.supplierName != null) {
      query = `?supplierName=${info.supplierName}&month=${info.month}&year=${info.year}&isImport=${info.isImport}`;
    } else {
      query = `?month=${info.month}&year=${info.year}&isImport=${info.isImport}`;
    }

    let endpoint = `${serviceUri}/downloads/pdf${query}`;
    return super.getPdf(endpoint);
  }
}
