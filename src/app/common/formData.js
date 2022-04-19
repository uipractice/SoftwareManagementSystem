import moment from "moment";

const formData = (type, rowData, selectedMonth) => {
  if (type == "new") {
    return {
      softwareName: "",
      softwareType: "software",
      team: "",
      owner: "",
      email: "",
      websiteUrl: "",
      billingCycle: "monthly",
      nextBilling: moment().add(1, "month").format("YYYY-MM-DD"),
      billingDetails: {}, // pricingInDollar pricingInRupee billingMonth nextBilling, desc, invoiceFiles
    };
  } else if (type == "edit" && rowData != undefined && selectedMonth != undefined) {
    
    return {...rowData , nextBilling : moment(rowData.nextBilling).format('YYYY-MM-DD')};
    
  } else if (type == "renew" && rowData != undefined) {
    return {
      softwareName: rowData.softwareName,
      softwareType: rowData.softwareType,
      team: rowData.team,
      owner: rowData.owner,
      email: rowData.email,
      websiteUrl: rowData.websiteUrl,
      billingCycle: rowData.billingCycle,
      nextBilling: moment(rowData?.nextBilling).add(1, 'month').format('YYYY-MM-DD'),
      billingDetails: {...rowData.billingDetails}, // pricingInDollar pricingInRupee billingMonth nextBilling, desc, invoiceFiles
    };
  }
};

export default formData;
