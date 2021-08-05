import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

toast.configure();

const defaultFormData = {
  softwareName: '',
  softwareType: '',
  team: '',
  owner: '',
  billingCycle: '',
  billingDetails: [], // pricingInDollar pricingInRupee billingMonth nextBilling
};

function Form({ isOpen, closeModal, rowData, isEdit = false }) {
  const inputRef = useRef(null);
  const [state, setState] = useState(defaultFormData);
  const [billingDetails, setBillingDetails] = useState({
    pricingInDollar: '',
    pricingInRupee: '',
    billingMonth: '',
  });

  useEffect(() => {
    inputRef?.current?.focus();
    if (isEdit) {
      setState(rowData);
      setBillingDetails(
        rowData?.billingDetails?.[rowData.billingDetails.length - 1]
      );
    }
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
    state.billingDetails.push(billingDetails);
    axios
      .post(
        `${
          isEdit
            ? `http://localhost:5000/softwareInfo/update/${'610a85d0dd787c1dfcd0d6c5'}`
            : `http://localhost:5000/softwareInfo/create`
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

  return (
    <Modal
      centered
      size='lg'
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Header closeButton className='modal-area'>
        <h3>Add Tool/Software</h3>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='softwareType'>Select Type</label>
              <select
                ref={inputRef}
                className='form-control'
                onChange={handleOnChange}
                name='softwareType'
                defaultValue={state?.softwareType}
              >
                <option value='Software'>Software</option>
                <option value='Certificate'>Certificate</option>
                <option value='Domain'>Domain</option>
              </select>
            </div>
            <div className='form-group col-md-5'>
              <label htmlFor='softwareName'>Tool/Software</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='softwareName'
                defaultValue={state?.softwareName}
              />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='team'>Team</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='team'
                defaultValue={state?.team}
              />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-5'>
              <label htmlFor='owner'>User/Owner</label>
              <input
                type='text'
                className='form-control'
                onChange={handleOnChange}
                name='owner'
                value={state?.owner}
              />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='billingCycle'>Billing Cycle</label>
              <ToggleButtonGroup
                type='radio'
                name='options'
                value={state?.billingCycle}
                className='mb-2'
                onChange={(val) => setState({ ...state, billingCycle: val })}
              >
                <ToggleButton value={'monthly'}> Monthly</ToggleButton>
                <ToggleButton value={'yearly'}> Yearly</ToggleButton>
              </ToggleButtonGroup>
            </div>
            {state?.billingCycle === 'monthly' && (
              <div className='form-group col-md-3'>
                <label htmlFor='billingMonth'>For the month of</label>
                <select
                  className='form-control'
                  onChange={(e) => handleOnChange(e, 'billingDetails')}
                  name='billingMonth'
                  value={billingDetails?.billingMonth}
                >
                  <option value=''></option>
                  <option value='January'>January</option>
                  <option value='February'>February</option>
                  <option value='March'>March</option>
                  <option value='April'>April</option>
                  <option value='May'>May</option>
                  <option value='June'>June</option>
                  <option value='July'>July</option>
                  <option value='August'>August</option>
                  <option value='September'>September</option>
                  <option value='October'>October</option>
                  <option value='November'>November</option>
                  <option value='December'>December</option>
                </select>
              </div>
            )}
          </div>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='pricingInDollar'>Pricing in $</label>
              <input
                type='number'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='pricingInDollar'
                value={billingDetails?.pricingInDollar}
              />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='pricingInRupee'>Pricing in ₹</label>
              <input
                type='number'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='pricingInRupee'
                value={billingDetails?.pricingInRupee}
              />
            </div>
            {/* <div className='form-group col-md-3'>
              <label htmlFor='totalAmount'>Total Amount</label>
              <input
                type='number'
                className='form-control'
                onChange={handleOnChange}
                name='totalAmount'
                value={state?.totalAmount}
              />
            </div> */}
            <div className='form-group col-md-3'>
              <label htmlFor='nextBilling'>Next Billing Date</label>
              <input
                type='date'
                className='form-control'
                onChange={handleOnChange}
                name='nextBilling'
                value={moment(state?.nextBilling).format('dd-mm-yyyy')}
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
              {/* state.softwareName &&
          state.teamName &&
          state.selectType &&
          state.owner &&
          state.billingCycle &&
          (state.billingCycle !== 'monthly' ||
          (state.billingCycle === 'monthly' && month)) &&
          state.pricingInDollar &&
          state.pricingInRupee &&
          state.totalAmount &&
          state.nextBilling */}
              {
                <button
                  className='form-control btn btn-primary share-btn'
                  onClick={handleSubmit}
                >
                  Save
                </button>
                // ) : (
                //   <button
                //     className='form-control btn btn-primary share-btn'
                //     onClick={handleSubmit}
                //     disabled
                //   >
                //     Save
                //   </button>
              }
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
export default Form;
