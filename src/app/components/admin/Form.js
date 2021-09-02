import React, { useState, useEffect } from 'react';
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

const nonMandatoryFields = ['websiteUrl', 'description', 'invoiceFiles'];

function Form({ isOpen, closeModal, rowData, isEdit = false }) {
  const [state, setState] = useState({});
  const [invoiceFiles, setInvoiceFiles] = useState({});
  const [billingDetails, setBillingDetails] = useState({
    pricingInDollar: '',
    pricingInRupee: '',
    billingMonth: moment().format('MMMM').toLowerCase(),
    description: '',
  });

  useEffect(() => {
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
      };
      delete prevBillingDetails._id;
      setBillingDetails(prevBillingDetails);
    }
    setState(stateData);
  }, [isEdit, rowData]);

  /**
   * Setting billing details.
   *
   * @param {object} e contains event object.
   * @param {string} key contains string to check billing details.
   * @param {bool} priceSection contains boolean value.
   * @return null.
   */
  const handleOnChange = (e, key, priceSection) => {
    const trimmedValue = e.target.value.trim();
    if (key === 'billingDetails') {
      setBillingDetails({
        ...billingDetails,
        [e.target.name]: priceSection
          ? trimmedValue.replace(/[^0-9]/g, '')
          : trimmedValue,
      });
    } else
      setState({
        ...state,
        [e.target.name]: trimmedValue,
        ...(e.target.name === 'billingCycle' && {
          nextBilling: moment()
            .add(1, `${trimmedValue === 'monthly' ? 'month' : 'year'}`)
            .format('YYYY-MM-DD'),
        }),
      });
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

  function validateEmail(inputText) {
    const mailformat =
      /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@evoketechnologies.com(\s*,\s*|\s*$))*$/;
    if (inputText.match(mailformat)) {
      return true;
    } else {
      toast.error('Invalid email ID !', {
        autoClose: 1800,
      });
      return false;
    }
  }

  function validateUrl(inputText = '') {
    const url = /^\S+$/;
    if (!inputText.match(url))
      toast.error('Invalid Url !', {
        autoClose: 1800,
      });
    return inputText.match(url);
  }

  /**
   * Resetting the billing details.
   *
   * @param {object} e contains event object.
   * @return null.
   */
  const handleReset = (e) => {
    e.preventDefault();
    setState(defaultFormData);
    setInvoiceFiles({});
    setBillingDetails({
      pricingInDollar: '',
      pricingInRupee: '',
      billingMonth: moment().format('MMMM').toLowerCase(),
      description: '',
    });
  };

  const uploadInvoiceFiles = ({ _id: id, ...rest }, billing) => {
    if (invoiceFiles && Object.keys(invoiceFiles).length) {
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
    if (validateEmail(state.email) && validateUrl(state.websiteUrl)) {
      axios
        .post(
          `${
            isEdit
              ? getApiUrl(`softwareInfo/renew/${rowData?._id}`)
              : getApiUrl(`softwareInfo/create`)
          }`,
          isEdit ? newBillingRecord : state
        )
        .then((res) => {
          if (res.data && Object.keys(res.data)?.length) {
            uploadInvoiceFiles(res.data);
            closeModal();
            toast.success('Data Saved Successfully !', {
              autoClose: 1000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.error('Data Saved FAILED !', {
              autoClose: 1000,
            });
          }
        });
    }
  };

  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

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
              <label htmlFor='softwareType'>Select Type *</label>
              <ToggleButtonGroup
                type='radio'
                name='softwareType'
                value={state?.softwareType}
                disabled={isEdit}
                onChange={(val) => setState({ ...state, softwareType: val })}
              >
                <ToggleButton
                  disabled={isEdit}
                  checked={state?.softwareType === 'certificate'}
                  value={'certificate'}
                  className='certificate'
                >
                  Certificate
                </ToggleButton>
                <ToggleButton
                  disabled={isEdit}
                  checked={state?.softwareType === 'domain'}
                  value={'domain'}
                  className='domian'
                >
                  Domain
                </ToggleButton>
                <ToggleButton
                  disabled={isEdit}
                  checked={state?.softwareType === 'software'}
                  value={'software'}
                  className='software'
                >
                  Software
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='softwareName'>Tool/Software *</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='softwareName'
                disabled={isEdit}
                value={state?.softwareName}
              />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='websiteUrl'>URL ( Ex: https:// )</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='websiteUrl'
                disabled={isEdit}
                value={state?.websiteUrl}
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='team'>Team/Project/Business Unit *</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='team'
                disabled={isEdit}
                value={state?.team}
              />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='owner'>User/Owner *</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='owner'
                disabled={isEdit}
                value={state?.owner}
              />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='email'>Email Id * </label>
              <textarea
                type='textarea'
                className='form-control'
                onChange={(e) => handleEmailChange(e, true)}
                onKeyDown={(e) => handleEmailChange(e, true)}
                name='email'
                value={state.email && state.email.toLowerCase()}
                rows='3'
                cols='50'
              />
            </div>
          </div>

          <div className='row'></div>
          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='billingCycle'>Billing Cycle *</label>
              <ToggleButtonGroup
                type='radio'
                name='billingCycle'
                value={state?.billingCycle}
                disabled={isEdit}
                onChange={(val) =>
                  handleOnChange({
                    target: { name: 'billingCycle', value: val },
                  })
                }
              >
                <ToggleButton
                  disabled={isEdit}
                  checked={state?.billingCycle === 'monthly'}
                  value={'monthly'}
                >
                  Monthly
                </ToggleButton>
                <ToggleButton
                  disabled={isEdit}
                  checked={state?.billingCycle === 'yearly'}
                  value={'yearly'}
                  className='yearly'
                >
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className='form-group col-md-2'>
              <label htmlFor='billingMonth'>For the month of *</label>
              <select
                className='form-control text-capitalize'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='billingMonth'
                value={billingDetails?.billingMonth}
                disabled={state?.billingCycle === 'yearly'}
              >
                {months
                  .slice(
                    moment().month(moment().format('MMMM')).format('M') - 2,
                    months.length
                  ) // Getting the list of upcoming months only
                  .map((month) => (
                    <option className='option' key={month} value={month}>
                      {month}
                    </option>
                  ))}
              </select>
            </div>

            <div className='form-group col-md-2'>
              <label htmlFor='nextBilling'>Next Billing Date *</label>
              <input
                type='date'
                className='form-control'
                onChange={handleOnChange}
                name='nextBilling'
                value={state?.nextBilling}
                // min={moment().subtract(1, 'month').format('YYYY-MM-DD')}
                // max={
                //   state.billingCycle === 'yearly'
                //     ? ''
                //     : moment().add(1, 'month').format('YYYY-MM-DD')
                // }
              />
            </div>
            <div className='form-group col-md-2'>
              <label htmlFor='pricingInDollar'>Pricing in $ *</label>
              <NumberFormat
                thousandsGroupStyle='thousand'
                prefix='$ '
                decimalSeparator='.'
                displayType='input'
                type='text'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                name='pricingInDollar'
                value={billingDetails?.pricingInDollar}
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
            <div className='form-group col-md-2'>
              <label htmlFor='pricingInRupee'>Pricing in ₹ *</label>
              <NumberFormat
                thousandsGroupStyle='thousand'
                value={billingDetails?.pricingInRupee}
                prefix='₹ '
                decimalSeparator='.'
                displayType='input'
                type='text'
                name='pricingInRupee'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                thousandSeparator={true}
                allowNegative={true}
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='description'>Pricing Description</label>
              <textarea
                type='text'
                className='form-control long'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='description'
                value={billingDetails?.description}
                style={{ resize: 'none' }}
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='invoiceFiles'>Upload Invoice</label>
              <div
                className={`form-control long dashed-box ${
                  Object.keys(invoiceFiles).length === 0 && 'pointer'
                }`}
                {...(Object.keys(invoiceFiles).length === 0 && {
                  onClick: (e) => document.getElementById('file')?.click(),
                })}
              >
                <div className='d-flex justify-content-center align-items-center h-100'>
                  {Object.keys(invoiceFiles).length ? (
                    <div className='selected-items'>
                      {Object.keys(invoiceFiles)?.map((key, i) => (
                        <div key={i}>
                          <span
                            key={invoiceFiles[key].name}
                            className='file-close-icon'
                            onClick={() => {
                              const fileState = { ...invoiceFiles };
                              delete fileState[key];
                              setInvoiceFiles(fileState);
                            }}
                          >
                            {invoiceFiles[key].name}
                            &nbsp;&nbsp;
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>
                      Click here to upload
                      <img className='px-2' src={Upload} alt='download' />
                    </span>
                  )}
                </div>
              </div>
              <input
                id='file'
                type='file'
                name='invoiceFiles'
                multiple={true} // single file upload
                className='form-control '
                onChange={(e) => setInvoiceFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className='form-group row share '>
            <div className='col-md-12 text-center'>
              {isEdit ? (
                <button
                  className='form-control btn btn-primary'
                  onClick={closeModal}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className='form-control btn btn-primary'
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
              <button
                className='form-control btn btn-primary share-btn'
                onClick={handleSubmit}
                disabled={
                  Object.keys(state).some((key) =>
                    nonMandatoryFields.includes(key) ? false : state[key] === ''
                  ) ||
                  Object.keys(billingDetails).some((key) =>
                    nonMandatoryFields.includes(key)
                      ? false
                      : billingDetails[key] === ''
                  )
                }
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
