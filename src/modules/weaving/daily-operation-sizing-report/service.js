import {
  inject,
  Lazy
} from "aurelia-framework";
import {
  HttpClient
} from "aurelia-fetch-client";
import {
  RestService
} from "../../../utils/rest-service";
import {
  Container
} from "aurelia-dependency-injection";
import {
  Config
} from "aurelia-api";
import {
  debug
} from 'util';

const serviceUri = 'weaving/daily-operations-sizing';

export class Service extends RestService {

  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "weaving");
  }

  getById(id) {
    var endpoint = `${serviceUri}/${id}`;
    return super.get(endpoint);
  }

  getUnitById(Id) {
    var config = Container.instance.get(Config);
    var _endpoint = config.getEndpoint("core");
    var _serviceUri = `master/units/${Id}`;

    return _endpoint.find(_serviceUri).then(result => {
      return result.data;
    });
  }

  getReportData(machine, order, status, weavingUnit, startDate, endDate) {
    var endpoint = `${serviceUri}/get-report`;
    var query = '';

    if (machine) {
      if (query === '') query = `machineId=${(machine.Id)}`;
      else query = `${query}&machineId=${(machine.Id)}`;
    }
    if (order) {
      if (query === '') query = `orderId=${(order.Id)}`;
      else query = `${query}&orderId=${(order.Id)}`;
    }
    if (status) {
      if (query === '') query = `operationStatus=${status}`;
      else query = `${query}&operationStatus=${status}`;
    }
    if (weavingUnit) {
      if (query === '') query = `unitId=${weavingUnit.Id}`;
      else query = `${query}&unitId=${weavingUnit.Id}`;
    }
    if (startDate) {
      if (query === '') query = `dateFrom=${(startDate)}`;
      else query = `${query}&dateFrom=${(startDate)}`;
    }
    if (endDate) {
      if (query === '') query = `dateTo=${(endDate)}`;
      else query = `${query}&dateTo=${(endDate)}`;
    }
    if (query !== '')
      endpoint = `${serviceUri}/get-report?${query}`;
    
    return super.get(endpoint);
  }

  getReportXls(order, material, status, weavingUnit, startDate, endDate) {
    var endpoint = `${serviceUri}/get-report`;
    var query = '';

    if (machine) {
      if (query === '') query = `machineId=${(machine.Id)}`;
      else query = `${query}&machineId=${(machine.Id)}`;
    }
    if (order) {
      if (query === '') query = `orderId=${(order.Id)}`;
      else query = `${query}&orderId=${(order.Id)}`;
    }
    if (status) {
      if (query === '') query = `operationStatus=${status}`;
      else query = `${query}&operationStatus=${status}`;
    }
    if (weavingUnit) {
      if (query === '') query = `unitId=${weavingUnit.Id}`;
      else query = `${query}&unitId=${weavingUnit.Id}`;
    }
    if (startDate) {
      if (query === '') query = `dateFrom=${(startDate)}`;
      else query = `${query}&dateFrom=${(startDate)}`;
    }
    if (endDate) {
      if (query === '') query = `dateTo=${(endDate)}`;
      else query = `${query}&dateTo=${(endDate)}`;
    }
    if (query !== '')
      endpoint = `${serviceUri}/get-report?${query}`;

    return super.getXls(endpoint);
  }

  //Get Data Daily Operation Warping Report
  getAll() {
    var filterType = "get-all";
    var endpoint = `${serviceUri}/${filterType}`;
    return super.get(endpoint);
  }

  getByOrder(orderId) {
    var filterType = "get-by-order";
    var endpoint = `${serviceUri}/${filterType}/${orderId}`;
    return super.get(endpoint);
  }

  getByWeavingUnit(weavingUnitId) {
    var filterType = "get-by-weaving-unit";
    var endpoint = `${serviceUri}/${filterType}/${weavingUnitId}`;
    return super.get(endpoint);
  }

  //Export to Excel Daily Operation Warping Report
  getXlsAll() {
    var filterType = "get-all";
    var endpoint = `${serviceUri}/${filterType}`;
    return super.getXls(endpoint);
  }

  getXlsByOrder(orderId) {
    var filterType = "get-by-order";
    var endpoint = `${serviceUri}/${filterType}/${orderId}`;
    return super.getXls(endpoint);
  }

  getXlsByWeavingUnit(weavingUnitId) {
    var filterType = "get-by-weaving-unit";
    var endpoint = `${serviceUri}/${filterType}/${weavingUnitId}`;
    return super.getXls(endpoint);
  }
}
