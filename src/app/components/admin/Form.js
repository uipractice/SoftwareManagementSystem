import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { getApiUrl } from '../utils/helper';

toast.configure();

const defaultFormData = {
  softwareName: '',
  softwareType: 'software',
  team: '',
  owner: '',
  billingCycle: 'monthly',
  billingDetails: [], // pricingInDollar pricingInRupee billingMonth nextBilling
};

function Form({ isOpen, closeModal, rowData = {}, isEdit = false }) {
  const inputRef = useRef(null);
  const [state, setState] = useState(defaultFormData);
  const [billingDetails, setBillingDetails] = useState({
    pricingInDollar: '',
    pricingInRupee: '',
    billingMonth: '',
  });

  useEffect(() => {
    inputRef?.current?.focus();
    let stateData = defaultFormData
    if (isEdit) {
      stateData = {...rowData,  nextBilling: moment(rowData?.nextBilling)
        .add(rowData?.nextBilling ? 2 : 1, 'month')
        .format('YYYY-MM-DD')}
      setBillingDetails(
        {...rowData?.billingDetails?.[rowData.billingDetails.length - 1], billingMonth: moment(rowData.nextBilling)
          .format('MMMM')}
      );
    }
    else{
      setBillingDetails({...billingDetails, billingMonth:moment().format('MMMM')})
    }
    setState(stateData);

  }, [isEdit, rowData]);

  function handleOnChange(e, key) {
    if (key === 'billingDetails') {
      setBillingDetails({
        ...billingDetails,
        [e.target.name]: e.target.value,
      });
    } else
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
  }

  const handleReset = (e) => {
    e.preventDefault();
    setState(defaultFormData);
  };

  function handleSubmit(e) {
    e.preventDefault();
    state.billingDetails.push({
      ...billingDetails,
      nextBilling: state.nextBilling,
    });
    axios
      .post(
        `${
          isEdit
            ? getApiUrl(`softwareInfo/update/${rowData.id}`)
            : getApiUrl(`softwareInfo/create`)
        }`,
        state
      )
      .then((res) => {
        if (res.data === 'success') {
          closeModal();
          toast.success('Data Saved Successfully !', {
            autoClose: 2000,
          });
          console.log(state);

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error('Data Saved FAILED !', {
            autoClose: 2000,
          });
          console.log(state);
        }
      });
  }
  console.log("softwareType", state.softwareType)
  return (
    <Modal
      centered
      size='lg'
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      onHide={closeModal}
      className='software-modal'
    >
      <Modal.Header closeButton className='modal-area'>
        <h3>Add Tool/Software</h3>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='softwareType'>Select Type</label>
              {/* <select
                ref={inputRef}
                className='form-control'
                onChange={handleOnChange}
                name='softwareType'
                disabled={isEdit}
                defaultValue={state?.softwareType}
              >
                <option value='Software'>Software</option>
                <option value='Certificate'>Certificate</option>
                <option value='Domain'>Domain</option>
              </select> */}
              <ToggleButtonGroup
                type='radio'
                name='softwareType'
                value={state?.softwareType}
                disabled={isEdit}
                className='mb-2'
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
            <div className='form-group col-md-6'>
              <label htmlFor='softwareName'>Tool/Software</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='softwareName'
                disabled={isEdit}
                defaultValue={state?.softwareName}
              />
            </div>
            
          </div>

          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='team'>Team</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='team'
                disabled={isEdit}
                defaultValue={state?.team}
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='owner'>User/Owner</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='owner'
                disabled={isEdit}
                value={state?.owner}
              />
            </div>
            
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='billingCycle'>Billing Cycle</label>
              <ToggleButtonGroup
                type='radio'
                name='billingCycle'
                value={state?.billingCycle}
                disabled={isEdit}
                className='mb-2'
                onChange={(val) => setState({ ...state, billingCycle: val })}
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
            
              <div className='form-group col-md-3'>
              
                <label htmlFor='billingMonth'>For the month of</label>
                <select
                  className='form-control'
                  onChange={(e) => handleOnChange(e, 'billingDetails')}
                  name='billingMonth'
                  value={
                    billingDetails.billingMonth
                  }
                  disabled={state?.billingCycle === 'yearly'}
                >
                  <option value='january'>January</option>
                  <option value='february'>February</option>
                  <option value='march'>March</option>
                  <option value='april'>April</option>
                  <option value='may'>May</option>
                  <option value='june'>June</option>
                  <option value='july'>July</option>
                  <option value='august'>August</option>
                  <option value='aeptember'>September</option>
                  <option value='actober'>October</option>
                  <option value='aovember'>November</option>
                  <option value='december'>December</option>
                </select>
              </div>
            
            <div className='form-group col-md-3'>
              <label htmlFor='nextBilling'>Next Billing Date</label>
              <input
                type='date'
                className='form-control'
                onChange={handleOnChange}
                name='nextBilling'
                value={state.nextBilling}
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='pricingInDollar'>Pricing in $</label>
              <input
                type='number'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='pricingInDollar'
                value={billingDetails?.pricingInDollar}
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='pricingInRupee'>Pricing in ₹</label>
              <input
                type='number'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='pricingInRupee'
                value={billingDetails?.pricingInRupee}
              />
            </div>
            
          </div>

          <div className='form-group row share'>
            <div className='col-md-6'></div>
            <div className='col-md-6 text-right'>
              <button
                className='form-control btn btn-primary'
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className='form-control btn btn-primary share-btn'
                onClick={handleSubmit}
                disabled={
                  Object.keys(state).some((key) => state[key] === '') ||
                  Object.keys(billingDetails).some(
                    (key) => billingDetails[key] === ''
                  )
                }
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
export default Form;
