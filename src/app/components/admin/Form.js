import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import moment from 'moment';
import Upload from '../../assets/images/upload.svg';
// Helpers
import { getApiUrl } from '../utils/helper';

toast.configure();

// default fotm data
const defaultFormData = {
  softwareName: '',
  softwareType: 'software',
  team: '',
  owner: '',
  email: '',
  websiteUrl: '',
  billingCycle: 'monthly',
  nextBilling: moment().add(1, 'month').format('YYYY-MM-DD'),
  billingDetails: [], // pricingInDollar pricingInRupee billingMonth nextBilling, desc, invoiceFiles
};

const nonMandatoryFields = ['websiteUrl', 'invoiceFiles'];

function Form({ isOpen, closeModal, rowData, isEdit = false,updateToolStatus }) {
  const inputRef = useRef(null);
  const [state, setState] = useState({});
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    pricingInDollar: '',
    pricingInRupee: '',
    billingMonth: moment().format('MMMM').toLowerCase(),
    description: '',
  });

  useEffect(() => {
    inputRef?.current?.focus();
    let stateData = defaultFormData;
    if (isEdit) {
      stateData = {
        ...rowData,
        nextBilling: moment(rowData?.nextBilling)
          .add(1, 'month')
          .format('YYYY-MM-DD'),
      };
      const prevBillingDetails = {
        ...rowData?.billingDetails?.[rowData.billingDetails.length - 1],
        ...(rowData?.billingCycle === 'monthly' && {
          billingMonth: moment(rowData.nextBilling)
            .format('MMMM')
            .toLowerCase(),
        }),
        invoiceFiles: [],
        pricingInDollar: '',
        pricingInRupee: '',
      };
      delete prevBillingDetails._id;
      setBillingDetails(prevBillingDetails);
    }
    setState(stateData);
  }, [isEdit, rowData]);

  const setTargetName = (value, e) => {
    if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
      setState({
        ...state,
        [e.target.name]: value,
      });
    } else {
      setState({
        ...state,
        [e.target.name]: '',
      });
    }
  }

  const getBillingDetails = (data) => {
    return data.match(/[a-zA-Z0-9]+([\s]+)*$/)
    ? data.replace(/[^a-zA-Z0-9 ]/g, '')
    : '';
  }
  const settingBillingDetails = (priceSection, value) => {
    return  !priceSection ? value : '';
  }
  const billingCycle = (e) => {
    return e.target.value === 'monthly' ? 'month' : 'year'
  }
  /**
   * Setting billing details.
   *
   * @param {object} e contains event object.
   * @param {string} key contains string to check billing details.
   * @param {bool} priceSection contains boolean value.
   * @return null.
   */
  const handleOnChange = (e, key, priceSection, url = false) => {
    if (key === 'billingDetails') {
      let data = '';
      if (!priceSection) {
        data = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
      }
      const value = priceSection
        ? e.target.value.replace(/[^0-9.]/g, '')
        : getBillingDetails(data);
      setBillingDetails({
        ...billingDetails,
        [e.target.name]:
          priceSection && value > 0 ? value : settingBillingDetails(priceSection, value),
      });
    } else if (e.target.name === 'billingCycle') {
      setState({
        ...state,
        [e.target.name]: e.target.value,
        ...(e.target.name === 'billingCycle' && {
          nextBilling: moment()
            .add(1, `${billingCycle(e)}`)
            .format('YYYY-MM-DD'),
        }),
      });
    } else if (e.target.name === 'nextBilling') {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    } else if (url) {
      const value = e.target.value.trim();
      setState({
        ...state,
        [e.target.name]: value,
      });
    } else {
      const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
      setTargetName(value, e);
    }
  };

  function handleEmailChange(e, email) {
    if (e.key === '@' && !state.autoFill && email) {
      setState({
        ...state,
        [e.target.name]: e.target.value + '@evoketechnologies.com',
        autoFill: true,
      });
    } else if (!state.autoFill) {
      setState({
        ...state,
        [e.target.name]: e.target.value,
        autoFill: false,
      });
    } else {
      setState({
        ...state,
        autoFill: false,
      });
    }
  }

  function ValidateEmail(inputText) {
    const mailTextformat =
      /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
    if (inputText.match(mailTextformat)) {
      return true;
    } else {
      toast.error('Invalid email ID !', {
        autoClose: 1800,
      });
      return false;
    }
  }

  /**
   * Resetting the billing details.
   *
   * @param {object} e contains event object.
   * @return null.
   */
  const handleReset = (e) => {
    e.preventDefault();
    let resetData = { ...defaultFormData };
    resetData.team = state.team;
    resetData.owner = state.owner;
    resetData.websiteUrl = state.websiteUrl;
    resetData.softwareName = state.softwareName;
    resetData.email = state.email;
    isEdit
      ? setState(resetData)
      : setState({
          ...state,
          softwareName: '',
          owner: '',
          team: '',
          websiteUrl: '',
          email: '',
          softwareType: 'software',
          billingCycle: 'monthly',
        });
    setInvoiceFiles([]);
    setBillingDetails({
      pricingInDollar: '',
      pricingInRupee: '',
      billingMonth: moment().format('MMMM').toLowerCase(),
      description: '',
    });
  };

  const uploadInvoiceFiles = ({ _id: id, ...rest }, billing) => {
    if (invoiceFiles && invoiceFiles.length > 0) {
      const formData = new FormData();
      for (let file in invoiceFiles) {
        formData.append('fileName', invoiceFiles[file]);
      }
      axios
        .post(getApiUrl(`softwareInfo/multiple/${id}`), formData)
        .then((res) => {
          console.log('Files Uploaded : ', res.data.status);
        })
        .catch((err) => {
          console.log('Error in Upload : ', err);
        });
    }
  };
  const handleAddFile = () => {
    document.getElementById('invoiceFiles').click();
  };

  const addAttachment = (fileInput) => {
    const files = [...invoiceFiles];
    for (const file of fileInput.target.files) {
      files.push(file);
    }
    console.log('files', files);
    setInvoiceFiles(files);
  };

  /**
   * Displays the modal.
   *
   * @param {object} e contains event object.
   * @return null.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBillingRecord = {
      ...billingDetails,
      nextBilling: state.nextBilling,
      createdAt: moment().format('YYYY-MM-DD'),
    };
    state.billingDetails.push(newBillingRecord);
    console.log('state', state);
    if (ValidateEmail(state.email)) {
      const renewUrl = `softwareInfo/renew/${rowData?._id}`;
      axios
        .post(
          `${
            isEdit
              ? getApiUrl(renewUrl)
              : getApiUrl('softwareInfo/create')
          }`,
          isEdit ? newBillingRecord : state
        )
        .then((res) => {
          if (res.data && Object.keys(res.data)?.length) {
            uploadInvoiceFiles(res.data);
            closeModal();
            toast.success('Data Saved Successfully !', {
              autoClose: 1000,
              onClose:updateToolStatus(true)
            });
            
            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          } else {
            toast.error('Data Saved FAILED !', {
              autoClose: 2000,
            });
          }
        });
    }
  };
  const mailformat =
    /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
  
    return (
      <Modal
        centered
        size='lg'
        style={{ borderRadius: '0 !important' }}
        show={isOpen}
        backdrop='static'
        onHide={closeModal}
        className='software-modal'
      >
        <Modal.Header closeButton className='modal-area'>
          <h3>Add Tool/Software</h3>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className='row'>
              <div className='form-group col-md-4'>
                <label htmlFor='softwareName'>Tool/Software *</label>
                <input
                  type='text'
                  className='form-control'
                  //onChange={handleOnChange}
                  name='softwareName'
                  disabled={isEdit}
                  //value={state?.softwareName}
                />
              </div>
              <div className='form-group col-md-4'>
                <label htmlFor='websiteUrl'>URL </label>
                <span class='help-text'>( Ex: https:// )</span>
                <input
                  type='text'
                  className='form-control'
                 // onChange={(e) => handleOnChange(e, '', false, true)}
                  name='websiteUrl'
                  disabled={isEdit}
                 // value={state?.websiteUrl}
                />
              </div>
            </div>
            <div className='row'>
              <div className='form-group col-md-4'>
                <label htmlFor='team'>Team/Project/Business Unit *</label>
                <input
                  type='text'
                  className='form-control'
                 // onChange={handleOnChange}
                  name='team'
                  disabled={isEdit}
                 // value={state?.team}
                />
              </div>
              <div className='form-group col-md-4'>
                <label htmlFor='owner'>User/Owner *</label>
                <input
                  type='text'
                  className='form-control'
                //  onChange={handleOnChange}
                  name='owner'
                  disabled={isEdit}
                 // value={state?.owner}
                />
              </div>
              <div className='form-group col-md-4'>
                <label htmlFor='email'>Email Id * </label>
                <span className='email-help-text'>
                  {' '}
                  (Add multiple emails with (,) separation)
                </span>
  
                <textarea
                  type='textarea'
                  className='form-control'
                 // onChange={(e) => handleEmailChange(e, true)}
                 // onKeyDown={(e) => handleEmailChange(e, true)}
                  disabled={isEdit}
                  name='email'
                  // value={
                  //   state.email &&
                  //   state.email.match(mailformat) &&
                  //   state.email.toLowerCase()
                  // }
                  rows='3'
                  cols='50'
                />
              </div>
            </div>
  
           
            <div className='form-group row share '>
              <div className='col-md-12 text-center'>
                <button
                  className='form-control btn btn-primary'
                 // onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className='form-control btn btn-primary share-btn'
                 // onClick={handleSubmit}
                  // disabled={
                  //   Object.keys(state).some((key) =>
                  //     nonMandatoryFields.includes(key) ? false : state[key] === ''
                  //   ) ||
                  //   Object.keys(billingDetails).some((key) =>
                  //     nonMandatoryFields.includes(key)
                  //       ? false
                  //       : billingDetails[key] === ''
                  //   )
                  // }
                >
                  {isEdit ? 'Renew' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
}
export default Form;
