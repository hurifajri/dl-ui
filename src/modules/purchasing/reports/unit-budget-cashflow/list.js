import { inject } from "aurelia-framework";
import { Service } from "./service";
import { CurrencyService } from "./currency-service";
import { Router } from "aurelia-router";
import moment from "moment";
import numeral from "numeral";

var UnitLoader = require("../../../../loader/unit-loader");
var AccountingUnitLoader = require("../../../../loader/accounting-unit-loader");

@inject(Router, Service, CurrencyService)
export class List {
  constructor(router, service, currencyService) {
    this.service = service;
    this.router = router;
    this.currencyService = currencyService;
    this.isEmpty = true;
    this.isEdit = false;
  }

  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 5,
    },
  };

  tableOptions = {
    pagination: false,
    showColumns: false,
    search: false,
    showToggle: false,
  };

  collection = {
    columns: [
      "Mata Uang",
      "Nominal Valas (Best Case)",
      "Nominal IDR (Best Case)",
      "Actual IDR (Best Case)",
      "Nominal Valas (Worst Case)",
      "Nominal IDR (Worst Case)",
      "Actual IDR (Worst Case)",
    ],
  };

  enums = [
    "ExportSales",
    "LocalSales",
    "CashSales",
    "InteralDivisionSales",
    "InternalUnitSales",
    "InternalIncomeVATCalculation",
    "OthersSales",
    "ExternalIncomeVATCalculation",
    "ImportedRawMaterial",
    "LocalRawMaterial",
    "EmployeeExpenses", // Missing before
    "AuxiliaryMaterial",
    "SubCount",
    "Embalage",
    "Electricity",
    "Coal",
    "FuelOil",
    "SparePartsMachineMaintenance",
    "DirectLaborCost",
    "HolidayAllowanceLaborCost",
    "ConsultantCost",
    "HealthInsuranceSocialSecurity",
    "SeveranceCost",
    "UtilityCost",
    "ImportCost",
    "InternalDivisionPurchase",
    "InternalUnitPurchase",
    "InternalOutcomeVATCalculation",
    "MarketingSalaryCost",
    "MarketingSalaryExpense",
    "MarketingHealthInsuranceSocialSecurity",
    "MarketingHolidayAllowance",
    "AdvertisementCost",
    "BusinessTripCost",
    "ShippingCost",
    "SalesComission",
    "FreightCost",
    "ClaimCost",
    "DocumentationCost",
    "InsuranceCost",
    "OtherSalesCost",
    "GeneralAdministrativeExternalOutcomeVATCalculation",
    "TaxCost",
    "GeneralAdministrativeSalaryCost",
    "GeneralAdministrativeSalaryExpense",
    "GeneralAdministrativeSocialSecurity",
    "GeneralAdministrativeDirectorsSalary",
    "GeneralAdministrativeBuildingMaintenance",
    "GeneralAdministrativeBusinessTrip",
    "GeneralAdministrativeMailingCost",
    "GeneralAdministrativeStationary",
    "GeneralAdministrativeWaterCost",
    "GeneralAdministrativeElectricityCost",
    "GeneralAdministrativeConsultant",
    "GeneralAdministrativeTraining",
    "GeneralAdministrativeCertification",
    "GeneralAdministrativeDonation",
    "GeneralAdministrativeGuestEntertainment",
    "GeneralAdministrativeVehicleBuildingMachineInsurance",
    "GeneralAdministrativeCorporateHousehold",
    "GeneralAdministrativeSeveranceCost",
    "GeneralAdministrativeHolidayAllowance",
    "GeneralAdministrativeVehicleCost",
    "GeneralAdministrativeSecurityCost",
    "GeneralAdministrativeOthersCost",
    "GeneralAdministrativeCommunicationCost",
    "OthersOperationalCost",
    "CashInDeposit",
    "CashInOthers",
    "MachineryPurchase",
    "VehiclePurchase",
    "InventoryPurchase",
    "ComputerToolsPurchase",
    "ProductionToolsMaterialsPurchase",
    "ProjectPurchase",
    "CashOutDesposit",
    "CashInLoanWithdrawal", // Missing before
    "CashInAffiliates",
    "CashInForexTrading",
    "CashInCompanyReserves",
    "CashInLoanWithdrawalOthers",
    "CashOutInstallments",
    "CashOutBankInterest",
    "CashOutBankAdministrationFee",
    "CashOutAffiliates",
    "CashOutForexTrading",
    "CashOutOthers",
  ];

  bind() {
    this.data = {};
  }

  async search() {
    this.collectionOptions = {
      readOnly: true,
    };
    // console.log(this.ItemsCollection);

    let unitId = 0;
    if (this.unit && this.unit.Id) {
      unitId = this.unit.Id;
      this.data.UnitId = this.unit.Id;
    }

    let dueDate = this.dueDate
      ? moment(this.dueDate).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");

    this.data.DueDate = dueDate;

    let bestCasePromises = this.enums.map((enumItem, index) => {
      return this.service
        .getBestCase({
          layoutOrder: index + 1,
          unitId: unitId,
          dueDate: dueDate,
        })
        .then((bestCases) => {
          return bestCases;
        });
    });

    let worstCaseResult = await this.service
      .getWorstCase({ unitId: unitId, dueDate: dueDate })
      .then((worstCases) => {
        return worstCases;
      });

    await Promise.all(bestCasePromises).then((bestCasePromiseResult) => {
      let bestCaseResult = bestCasePromiseResult;

      let bestCases = bestCaseResult.map((response) => {
        if (!response.data || response.data.length <= 0) {
          response.data = [{}];
        }

        return response.data;
      });

      // console.log("arr", bestCases);
      bestCases = [].concat.apply([], bestCases);

      let currencyPromises = [];
      for (let bestCase of bestCases) {
        if (bestCase.CurrencyId && bestCase.CurrencyId > 0) {
          currencyPromises.push(
            this.currencyService.getById(bestCase.CurrencyId)
          );
        }
      }

      return Promise.all(currencyPromises).then((currencyPromiseResult) => {
        let worstCases = [];
        let currencies = currencyPromiseResult;
        if (worstCaseResult) worstCases = worstCaseResult.data;

        // ini data yang akan di submit
        this.data.Items = [];
        for (let bestCase of bestCases) {
          let worstCase = worstCases.find(
            (wc) =>
              wc.LayoutOrder == bestCase.LayoutOrder &&
              wc.CurrencyId == bestCase.CurrencyId
          );
          let currency = currencies.find(
            (c) => c && c.Id == bestCase.CurrencyId
          );

          if (worstCase) {
            this.data.Items.push({
              CurrencyId: bestCase.CurrencyId,
              Currency: currency,
              BestCaseCurrencyNominal: bestCase.CurrencyNominal,
              BestCaseNominal: bestCase.Nominal,
              CurrencyNominal: worstCase.CurrencyNominal,
              Nominal: worstCase.Nominal,
              LayoutOrder: bestCase.LayoutOrder,
              LayoutName: bestCase.LayoutName,
              IsHasBestCase: true,
            });
          } else {
            if (bestCase.LayoutOrder > 0) {
              this.data.Items.push({
                CurrencyId: bestCase.CurrencyId,
                Currency: currency,
                BestCaseCurrencyNominal: bestCase.CurrencyNominal,
                BestCaseNominal: bestCase.Nominal,
                CurrencyNominal: 0,
                Nominal: 0,
                LayoutOrder: bestCase.LayoutOrder,
                LayoutName: bestCase.LayoutName,
                IsHasBestCase: true,
              });
            } else {
              this.data.Items.push({
                CurrencyId: bestCase.CurrencyId,
                Currency: currency,
                BestCaseCurrencyNominal: bestCase.CurrencyNominal,
                BestCaseNominal: bestCase.Nominal,
                CurrencyNominal: 0,
                Nominal: 0,
                LayoutOrder: bestCase.LayoutOrder,
                LayoutName: bestCase.LayoutName,
                IsHasBestCase: false,
              });
            }
          }
        }
      });
    });

    const getItem = (min, max) => (item) =>
      item.LayoutOrder >= min && item.LayoutOrder <= max;

    // OPERATING ACTIVITIES
    const revenue = this.data.Items.filter(getItem(1, 6));
    const otherRevenue = this.data.Items.filter(getItem(7, 8));
    const cogSold = this.data.Items.filter(getItem(9, 28));
    const sellingExpenses = this.data.Items.filter(getItem(29, 41));
    const gaExpenses = this.data.Items.filter(getItem(42, 43));
    const generalExpenses = this.data.Items.filter(getItem(44, 65));
    const telpExpenses = this.data.Items.filter(getItem(66, 66));
    const otherExpenses = this.data.Items.filter(getItem(67, 67));

    // INVESTING ACTIVITIES
    const depoInAndOthers = this.data.Items.filter(getItem(68, 69));
    const assetTetap = this.data.Items.filter(getItem(70, 75));
    const depoOut = this.data.Items.filter(getItem(76, 76));

    // FINANCING ACTIVITIES
    const loanWithdrawal = this.data.Items.filter(getItem(77, 77));
    const othersCI = this.data.Items.filter(getItem(78, 81));
    const loanInstallment = this.data.Items.filter(getItem(82, 83));
    const bankExpenses = this.data.Items.filter(getItem(84, 84));
    const othersCO = this.data.Items.filter(getItem(85, 87));

    const joined = [
      "Revenue",
      ...revenue,
      "Revenue from other operating",
      ...otherRevenue,
      "Total",
      "Cost of Good Sold",
      ...cogSold,
      "Marketing Expenses",
      "Biaya Penjualan",
      ...sellingExpenses,
      "General & Administrative Expenses",
      ...gaExpenses,
      "Biaya umum dan administrasi",
      ...generalExpenses,
      ...telpExpenses,
      "Other Operating Expenses",
      ...otherExpenses,
      "Total",
      "Surplus/Deficit-Cash from Operating Activities",
      ...depoInAndOthers,
      "Total",
      "Pembayaran pembelian asset tetap :",
      ...assetTetap,
      ...depoOut,
      "Total",
      "Surplus/Deficit-Cash from Investing Activities",
      ...loanWithdrawal,
      "Others :",
      ...othersCI,
      "Total",
      "Loan Installment and Interest expense",
      ...loanInstallment,
      "Bank Expenses",
      ...bankExpenses,
      "Others :",
      ...othersCO,
      "Total",
      "Surplus/Deficit-Cash from Financing Activities",
    ];

    const modifiedJoined = [];
    joined.map((item) => {
      const newBestCaseNominal =
        item && item.Currency && item.Currency.Code !== "IDR"
          ? 0
          : item.BestCaseNominal;
      const newNominal =
        item && item.Currency && item.Currency.Code !== "IDR"
          ? 0
          : item.Nominal;

      const modifiedItem =
        typeof item === "string"
          ? item
          : {
              ...item,
              newBestCaseNominal,
              newNominal,
            };

      modifiedJoined.push(modifiedItem);
    });

    // console.log("Revenue", revenue);
    // console.log("Revenue from other operating", otherRevenue);
    // console.log("Cost of Good Sold", cogSold);
    // console.log("Biaya Penjualan", sellingExpenses);
    // console.log("General & Administrative Expenses", gaExpenses);
    // console.log("Biaya umum dan administrasi", generalExpenses);
    // console.log("Telephone, Fax & Internet", telpExpenses);
    // console.log("Other Operating Expenses", otherExpenses);
    // console.log("Deposito & Lain-lain", depoInAndOthers);
    // console.log("Pembayaran pembelian asset tetap", assetTetap);
    // console.log("Cash Out Deposito", depoOut);
    // console.log("Loan Withdrawal", loanWithdrawal);
    // console.log("Others Cash In", othersCI);
    // console.log("Loan Installment and Interest expense", loanInstallment);
    // console.log("Bank Expenses", bankExpenses);
    // console.log("Others Cash Out", othersCO);

    this.isEmpty = this.data.Items.length !== 0 ? false : true;
    // this.data.Items = joined;
    this.data.Items = modifiedJoined;

    console.log("data.Items", this.data.Items);
  }

  save() {
    this.service
      .upsertWorstCase(this.data)
      .then(() => {
        this.collectionOptions = {
          readOnly: true,
        };
        this.isEdit = false;
        this.ItemsCollection.bind();
        alert("berhasil simpan!");
      })
      .catch((e) => {
        alert("terjadi kesalahan");
      });
  }

  edit() {
    this.collectionOptions = {
      readOnly: false,
    };

    this.isEdit = true;
    this.ItemsCollection.bind();
  }

  get unitLoader() {
    return UnitLoader;
  }
}