const formFields = (type) => {
  if (type == "new") {
    return {
      softwareType: false,
      softwareName: false,
      websiteUrl: false,
      team: false,
      owner: false,
      email: false,
      billingCycle: false,
      billingMonth: false,
      nextBilling: false,
      pricingInDollar: false,
      pricingInRupee: false,
      description: false,
      invoiceFiles: false,
    };
  } else if (type == "edit") {
    return {
      softwareType: true,
      softwareName: true,
      websiteUrl: true,
      team: true,
      owner: true,
      email: true,
      billingCycle: true,
      billingMonth: true,
      nextBilling: false,
      pricingInDollar: false,
      pricingInRupee: false,
      description: false,
      invoiceFiles: false,
    };
  } else if (type == "renew") {
    return {
      softwareType: true,
      softwareName: true,
      websiteUrl: true,
      team: true,
      owner: true,
      email: true,
      billingCycle: true,
      billingMonth: false,
      nextBilling: false,
      pricingInDollar: false,
      pricingInRupee: false,
      description: false,
      invoiceFiles: false,
    };
  }
};

export default formFields;
