import React, { useEffect, useState, useCallback } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Modal,
  Spinner,
} from "react-bootstrap";
import NumberFormat from "react-number-format";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import formData from "../../common/formData";
import formFields from "../../common/formFields";
import Upload from "../../assets/images/upload.svg";
import Download from '../../assets/images/download.svg';

import { getApiUrl } from "../utils/helper";
import "./Container.css";

const nonMandatoryFields = [
  "websiteUrl",
  "invoiceFiles",
  "pricingInDollar",
  "pricingInRupee",
  "description",
];

export default function Form_new({
  type,
  rowData,
  selectedMonth,
  isOpen,
  closeModal,
  selectedYear,
  updateToolStatus,
}) {
  let fields = formFields(type);

  const [data, setData] = useState({});
  const [billingDetails, setBillingDetails] = useState({ ...selectedMonth });
  const [isloading, setLoading] = useState(false);
  const [invoiceFiles, setInvoiceFiles] = useState([]);

  useEffect(() => {
    setData(formData(type, rowData, selectedMonth));
  }, []);

  useEffect(() => {
    handleBillingdetails();
  }, []);

  function handleBillingdetails() {
    if (type == "new") {
      setBillingDetails({
        pricingInDollar: "",
        pricingInRupee: "",
        billingMonth: moment().format("MMMM").toLowerCase(),
        description: "",
        invoiceFiles: [],
      });
      setInvoiceFiles([])
    } else if (type == "edit") {
      setBillingDetails({ ...selectedMonth });
    } else if (type == "renew") {
      setBillingDetails({
        pricingInDollar: "",
        pricingInRupee: "",
        billingMonth: moment(rowData.nextBilling).format("MMMM").toLowerCase(),
        description: "",
        invoiceFiles: [],
      });
    }
  }

  function headerName() {
    if (type == "new") {
      return <h3>Add Tool/Software</h3>;
    } else if (type == "edit") {
      return <h3>Edit Tool/Software</h3>;
    } else if (type == "renew") {
      return <h3>Renew Tool/Software</h3>;
    } else {
      return <h3>Add Tool/Software</h3>;
    }
  }

  function buttonName() {
    if (type == "new") {
      return "Save";
    } else if (type == "edit") {
      return "Update";
    } else if (type == "renew") {
      return "Renew";
    } else {
      return "Save";
    }
  }

  const setTargetName = (value, e) => {
    if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
      setData({
        ...data,
        [e.target.name]: value,
      });
    } else {
      setData({
        ...data,
        [e.target.name]: "",
      });
    }
  };

  function handleEmailChange(e, email) {
    if (e.key === "@" && !data.autoFill && email) {
      setData({
        ...data,
        [e.target.name]: e.target.value + "@evoketechnologies.com",
        autoFill: true,
      });
    } else if (!data.autoFill) {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        autoFill: false,
      });
    } else {
      setData({
        ...data,
        autoFill: false,
      });
    }
  }

  const getBillingDetails = (input) => {
    return input.match(/[a-zA-Z0-9]+([\s]+)*$/)
      ? input.replace(/[^a-zA-Z0-9 ]/g, "")
      : "";
  };
  const settingBillingDetails = (priceSection, value) => {
    return !priceSection ? value : "";
  };

  const billingCycle = (e) => {
    return e.target.value === "monthly" ? "month" : "year";
  };

  function handleOnChange(e, key, priceSection, url = false) {
    if (key === "billingDetails") {
      let input = "";
      if (!priceSection) {
        input = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
      }
      const value = priceSection
        ? e.target.value.replace(/[^0-9.]/g, "")
        : getBillingDetails(input);
      setBillingDetails({
        ...billingDetails,
        [e.target.name]:
          priceSection && value > 0
            ? value
            : settingBillingDetails(priceSection, value),
      });
    } else if (e.target.name === "billingCycle") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        ...(e.target.name === "billingCycle" && {
          nextBilling: moment()
            .add(1, `${billingCycle(e)}`)
            .format("YYYY-MM-DD"),
        }),
      });
    } else if (e.target.name === "nextBilling") {
      setBillingDetails({
        ...billingDetails,
        [e.target.name]: e.target.value,
      });
    } else if (url) {
      const value = e.target.value.trim();
      setData({
        ...data,
        [e.target.name]: value,
      });
    } else {
      const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
      setTargetName(value, e);
    }
  }

  const handleReset = (e) => {
    e.preventDefault();
    setData(formData(type, rowData, selectedMonth));
    setInvoiceFiles([]);
    handleBillingdetails();
  };

  const handleAddFile = () => {
    document.getElementById("invoiceFiles").click();
  };

  const addAttachment = (fileInput) => {
    const files = [...invoiceFiles];
    for (const file of fileInput.target.files) {
      files.push(file);
    }
    setInvoiceFiles(files);
  };

  function ValidateEmail(inputText) {
    const mailTextformat =
      /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
    if (inputText.match(mailTextformat)) {
      return true;
    } else {
      toast.error("Invalid email ID !", {
        autoClose: 1800,
      });
      setLoading(false);
      return false;
    }
  }

  const uploadInvoiceFiles = (swData, year, month) => {
    if (invoiceFiles && invoiceFiles.length > 0) {
      const formdata = new FormData();
      for (let file in invoiceFiles) {
        formdata.append("fileName", invoiceFiles[file]);
      }
      formdata.append("year", year);
      formdata.append("month", month);
      axios
        .post(getApiUrl(`softwareInfo/multiple/${swData._id}`), formdata)
        .then((res) => {
          console.log("Files Uploaded : ", res.data.status);
          toast.success("Files Uplaoded Successfully !", {
            autoClose: 1000,
            onClose: updateToolStatus(true),
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error in Upload : ", err);
        });
    } else {
     console.log('Upload failed')
    }
    setLoading(false);
  };

  function createBillingRecord(){
    if(type == 'edit'){
      return {
        ...billingDetails,
        invoiceFiles:[...invoiceFiles],
        nextBilling: data.nextBilling,
        createdAt: moment().format("YYYY-MM-DD"),
      };
    }
    else{
      return {
        ...billingDetails,
        invoiceFiles: [],
        nextBilling: data.nextBilling,
        createdAt: moment().format("YYYY-MM-DD"),
      };
    }
  }

  function findYearByMonth(sMonth, sYear){
    if(sMonth == 'december'){
      sYear = Number(sYear) - 1;
      return sYear+''
    }
    else{
      return sYear
    }
  }

  function findBillingInfo(subYear, subMonth){
    let billingInfo = {};
    let availableYears = Object.keys(data.billingDetails);
    availableYears.forEach((year) => {
      let subscriptionDetails = data.billingDetails[year];
      let subscribedMonths = [];
      subscriptionDetails.forEach((subscriptionInfo) => {
        if (!subscribedMonths.includes(subscriptionInfo.billingMonth)) {
          subscribedMonths.push(subscriptionInfo.billingMonth);
        }
      });
      billingInfo[year] = subscribedMonths;
    });

    if (
      billingInfo[subYear] &&
      billingInfo[subYear].includes(subMonth)
    ) {
      toast.error(
        `Subscription already done for ${subMonth} , ${subYear}`,
        {
          autoClose: 3000,
        }
      );
      setLoading(false);
      return false;
    }
    return billingInfo;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let billingRecord = createBillingRecord();
    
    let subscriptionYear = data.nextBilling.substring(0, 4);
    let subscriptionMonth = billingRecord.billingMonth;

    subscriptionYear = findYearByMonth(subscriptionMonth, subscriptionYear)

    let billingInfo = {};

    if (type == "renew") {
      billingInfo = findBillingInfo(subscriptionYear, subscriptionMonth)
      if(!billingInfo){
        return false
      }
    }

    let softwareToolDetails = JSON.parse(JSON.stringify(data));
    
    if (type == "renew") {
      if (Object.keys(softwareToolDetails.billingDetails).includes(subscriptionYear)) {
        softwareToolDetails.billingDetails[subscriptionYear].push(billingRecord);
      }
      else{
        softwareToolDetails.billingDetails[subscriptionYear] = [billingRecord];
      }
    } else if (
      selectedYear != undefined &&
      Object.keys(softwareToolDetails.billingDetails).includes(selectedYear)
    ) {
      if (type == "edit") {
        let validmonth = false;
        softwareToolDetails.billingDetails[selectedYear].forEach((element) => {
          if (element.billingMonth == billingDetails.billingMonth) {
            element.nextBilling = billingDetails.nextBilling;
            element.description = billingDetails.description;
            element.pricingInDollar = billingDetails.pricingInDollar;
            element.pricingInRupee = billingDetails.pricingInRupee;
            element.invoiceFiles = billingDetails.invoiceFiles;
            validmonth = true;
          }
        });

        if (!validmonth) {
          toast.error(`Unable to update`, {
            autoClose: 3000,
          });
          setLoading(false);
          return false;
        }
      } else {
        softwareToolDetails.billingDetails[subscriptionYear].push(
          billingRecord
        );
      }
    } else {
      softwareToolDetails.billingDetails[subscriptionYear] = [billingRecord];
    }
    if (ValidateEmail(softwareToolDetails.email)) {
      const renewUrl = `softwareInfo/renew/${rowData?._id}`;
      axios
        .post(
          `${
            type != "new"
              ? getApiUrl(renewUrl)
              : getApiUrl("softwareInfo/create")
          }`,
          softwareToolDetails
        )
        .then((res) => {
          if (type != "new") {
            let subscribedYears = Object.keys(res.data.billingDetails);
            if (subscribedYears.includes(subscriptionYear)) {
              uploadInvoiceFiles(res.data, subscriptionYear, subscriptionMonth);
            }
          } else {
            uploadInvoiceFiles(res.data, subscriptionYear, subscriptionMonth);
            setData(formData(type, rowData, selectedMonth));
          }

          closeModal();
          toast.success("Data Saved Successfully !", {
            autoClose: 1000,
            onClose: updateToolStatus(true),
          });
          setLoading(false);
        });
    }
  };

  const downloadInvoice = useCallback((invoiceFiless) => {
    axios
        .get(
            getApiUrl(`softwareInfo/download/${rowData._id}/${billingDetails.createdAt.substring(0, 4)}/${billingDetails.billingMonth}`)
        )
        .then((res) => {
            const files = res.data;
            downloadFiles(files, invoiceFiless);
        });
}, []);

const downloadFiles = (filesUrls, fileNames) => {
  let index = 0;
  for (let file of filesUrls) {
      const link = document.createElement('a');
      if (file.includes(fileNames)) {
          link.href = file;
          link.target = '_blank';
          link.setAttribute('id', 'downloadFile');
          link.setAttribute('download', fileNames);
          document.body.appendChild(link);
          link.click();
          index += 1;
          document.getElementById('downloadFile')?.remove();
      }

  }
};

function invoiceFileNames(formType, value){
  if(formType == 'newFile'){
    return value.name
  }
  else{
    if(formType == 'oldFile'){
      return value.includes("_") ? value.split("_")[1] : value
    }
  }
}

  const mailformat =
    /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;

  return (
    <Modal
      centered
      size="lg"
      style={{ borderRadius: "0 !important" }}
      show={isOpen}
      backdrop="static"
      onHide={closeModal}
      className="software-modal"
    >
      <Modal.Header closeButton className="modal-area">
        <h3>{headerName()}</h3>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row">
            <div className="form-group col-md-4">
              <label>Select type *</label>
              <ToggleButtonGroup
                type="radio"
                name="softwareType"
                value={data?.softwareType}
                disabled={fields.softwareType}
                onChange={(val) => setData({ ...data, softwareType: val })}
              >
                <ToggleButton
                  disabled={fields.softwareType}
                  checked={data?.softwareType === "certificate"}
                  value={"certificate"}
                  className="certificate"
                >
                  Certificate
                </ToggleButton>
                <ToggleButton
                  disabled={fields.softwareType}
                  checked={data?.softwareType === "domain"}
                  value={"domain"}
                  className="domian"
                >
                  Domain
                </ToggleButton>
                <ToggleButton
                  disabled={fields.softwareType}
                  checked={data?.softwareType === "software"}
                  value={"software"}
                  className="software"
                >
                  Software
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="softwareName">Tool/Software *</label>
              <input
                type="text"
                className="form-control"
                onChange={handleOnChange}
                name="softwareName"
                disabled={fields.softwareName}
                value={data?.softwareName}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="websiteUrl">URL </label>
              <span className="help-text">( Ex: https:// )</span>
              <input
                type="text"
                className="form-control"
                onChange={(e) => handleOnChange(e, "", false, true)}
                name="websiteUrl"
                disabled={fields.websiteUrl}
                value={data?.websiteUrl}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="team">Team/Project/Business Unit *</label>
              <input
                type="text"
                className="form-control"
                onChange={handleOnChange}
                name="team"
                disabled={fields.team}
                value={data?.team}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="owner">User/Owner *</label>
              <input
                type="text"
                className="form-control"
                onChange={handleOnChange}
                name="owner"
                disabled={fields.owner}
                value={data?.owner}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="email">Email Id * </label>
              <span className="email-help-text">
                {" "}
                (Add multiple emails with (,) separation)
              </span>

              <textarea
                type="textarea"
                className="form-control"
                onChange={(e) => handleEmailChange(e, true)}
                onKeyDown={(e) => handleEmailChange(e, true)}
                disabled={fields.email}
                name="email"
                value={
                  data.email &&
                  data.email.match(mailformat) &&
                  data.email.toLowerCase()
                }
                rows="3"
                cols="50"
              />
            </div>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="billingCycle">Billing Cycle *</label>
              <ToggleButtonGroup
                type="radio"
                name="billingCycle"
                value={data?.billingCycle}
                disabled={fields.billingCycle}
                onChange={(val) =>
                  handleOnChange({
                    target: { name: "billingCycle", value: val },
                  })
                }
              >
                <ToggleButton
                  disabled={fields.billingCycle}
                  checked={data?.billingCycle === "monthly"}
                  value={"monthly"}
                >
                  Monthly
                </ToggleButton>
                <ToggleButton
                  disabled={fields.billingCycle}
                  checked={data?.billingCycle === "yearly"}
                  value={"yearly"}
                  className="yearly"
                >
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="billingMonth">For the month of *</label>
              <select
                className="form-control"
                onChange={(e) => handleOnChange(e, "billingDetails")}
                name="billingMonth"
                value={billingDetails?.billingMonth}
                disabled={data?.billingCycle === "yearly" || type == "edit"}
              >
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="nextBilling">Next Billing Date *</label>
              <input
                type="date"
                className="form-control"
                onChange={handleOnChange}
                name="nextBilling"
                value={
                  type == "edit"
                    ? moment(billingDetails?.nextBilling).format("YYYY-MM-DD")
                    : moment(data?.nextBilling).format("YYYY-MM-DD")
                }
                //min={moment().subtract(1, "month").format("YYYY-MM-DD")}
                max={
                  data.billingCycle === "yearly"
                    ? ""
                    : moment().add(1, "month").format("YYYY-MM-DD")
                }
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pricingInDollar">Pricing in $ </label>
              <NumberFormat
                thousandsGroupStyle="thousand"
                prefix="$ "
                decimalSeparator="."
                displayType="input"
                type="text"
                className="form-control"
                onChange={(e) => handleOnChange(e, "billingDetails", true)}
                name="pricingInDollar"
                value={billingDetails?.pricingInDollar}
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="pricingInRupee">Pricing in ₹ </label>
              <NumberFormat
                thousandsGroupStyle="thousand"
                value={billingDetails?.pricingInRupee}
                prefix="₹ "
                decimalSeparator="."
                displayType="input"
                type="text"
                name="pricingInRupee"
                className="form-control"
                onChange={(e) => handleOnChange(e, "billingDetails", true)}
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="description">Pricing Description </label>
              <textarea
                type="text"
                className="form-control long"
                onChange={(e) => handleOnChange(e, "billingDetails")}
                name="description"
                maxLength="250"
                value={billingDetails?.description}
                style={{ resize: "none" }}
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='invoiceFiles'>Upload Invoice</label>
              <div
                className={`form-control long dashed-box  ${
                  (invoiceFiles === null || invoiceFiles.length <= 0) &&
                  'pointer'
                } ${
                  (invoiceFiles === null || invoiceFiles.length > 0) &&
                  'files-container'
                }`}
              >

                <div
                  className={`${invoiceFiles.length <= 0 && 'no-selected-items'}
                  ${invoiceFiles.length > 0 && 'selected-items'}`}
                >
                  {
                    type == 'edit' ? billingDetails.invoiceFiles.map((item, key) => (
                      <div>
                        <span
                          key={key}
                          className='file-close-icon'
                          onClick={() => {
                            const fileState = [...billingDetails.invoiceFiles];
                            fileState.splice(key, 1);
                            setBillingDetails({...billingDetails,invoiceFiles : fileState});
                          }}
                        >
                          {invoiceFileNames('oldFile',billingDetails.invoiceFiles[key])}
                          &nbsp;&nbsp;
                        </span>
                        <span>
                          <img
                          className='pl-3 pr-2 pointer'
                          src={Download}
                          onClick={() => downloadInvoice(billingDetails.invoiceFiles[key])}
                          alt='download'
                          />
                        </span>
                      </div>
                    )):''
                  }
                  {invoiceFiles.length>0 && invoiceFiles.map((item, key) => (
                    <div>
                      <span
                        key={key}
                        className='file-close-icon'
                        onClick={() => {
                          const fileState = [...invoiceFiles];
                          fileState.splice(key, 1);
                          setInvoiceFiles(fileState);
                        }}
                      >
                        {invoiceFileNames('newFile',invoiceFiles[key])}
                        &nbsp;&nbsp;
                      </span>
                      <span>
                        <img
                        className='pl-3 pr-2 pointer'
                        src={Download}
                        onClick={() => downloadInvoice(invoiceFiles[key])}
                        alt='download'
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <div className='addFileBtn'>
                  <a onClick={(e) => handleAddFile()} href='javascript:void(0)'>
                    Add files here
                    <img className='px-2' src={Upload} alt='download' />
                  </a>
                </div>
              </div>
              <input
                id='invoiceFiles'
                type='file'
                name='invoiceFiles'
                multiple // single file upload
                className='form-control'
                onChange={(e) => addAttachment(e)}
                onClick={(e) => (e.target.value = null)}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="form-group row share">
            {isloading ? (
              <Spinner
                animation="border"
                variant="info"
                className="spinnericon"
              />
            ) : (
              <div className="col-md-12 text-center">
                <button
                  className="form-control btn btn-primary"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className="form-control btn btn-primary share-btn"
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(data).some((key) =>
                      nonMandatoryFields.includes(key)
                        ? false
                        : data[key] === ""
                    ) ||
                    Object.keys(billingDetails).some((key) =>
                      nonMandatoryFields.includes(key)
                        ? false
                        : billingDetails[key] === ""
                    )
                  }
                >
                  {buttonName()}
                </button>
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
