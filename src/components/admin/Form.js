import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function Form({ closeModal }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [state, setState] = useState({
    softwareName: '',
    teamName: '',
    selectType: '',
    owner: '',
    billingCycle: '',
    pricingInDollar: '',
    pricingInRupee: '',
    totalAmount: '',
    nextBilling: '',
    timeline: '',
    // deleteReason: "",
    // restoreReason: "",
    // reshareReason: "",
  });

  function handleOnChange(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  const handleReset = (e) => {
    e.preventDefault();
    setState({
      softwareName: '',
      teamName: '',
      selectType: '',
      owner: '',
      pricingInDollar: '',
      pricingInRupee: '',
      totalAmount: '',
      month: '',
    });
  };

  function handleSubmit(e) {
    console.log('data', state);
    e.preventDefault();
    const formData = {
      softwareName: state.softwareName,
      teamName: state.teamName,
      selectType: state.selectType,
      owner: state.owner,
      billingCycle: state.billingCycle,
      pricingInDollar: state.pricingInDollar,
      pricingInRupee: state.pricingInRupee,
      totalAmount: state.totalAmount,
      nextBilling: state.nextBilling,
      // timeline: state.timeline,
      month: state.month,
    };
    axios
      .post(`http://localhost:5000/softwareInfo/addNewSoftware`, formData)
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
    <form>
      <div className='row'>
        <div className='form-group col-md-3'>
          <label htmlFor='selectType'>Select Type</label>
          <select
            ref={inputRef}
            className='form-control'
            onChange={handleOnChange}
            name='selectType'
            value={state.selectType}
          >
            <option value=''></option>
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
            value={state.softwareName}
          />
        </div>
        <div className='form-group col-md-4'>
          <label htmlFor='teamName'>Team</label>
          <input
            type='text'
            className='form-control'
            onChange={handleOnChange}
            name='teamName'
            value={state.teamName}
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
            value={state.owner}
          />
        </div>
        <div className='form-group col-md-4'>
          <label htmlFor='billingCycle'>Billing Cycle</label>
          <ToggleButtonGroup
            type='radio'
            name='options'
            defaultValue={'monthly'}
            className='mb-2'
            onChange={(val) => setState({ ...state, billingCycle: val })}
          >
            <ToggleButton value={'monthly'}>Monthly</ToggleButton>
            <ToggleButton value={'yearly'}>Yearly</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className='form-group col-md-3'>
          <label htmlFor='month'>For the month of</label>
          <select
            className='form-control'
            onChange={handleOnChange}
            name='month'
            value={state.month}
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
      </div>
      <div className='row'>
        <div className='form-group col-md-3'>
          <label htmlFor='pricingInDollar'>Pricing in $</label>
          <input
            type='number'
            className='form-control'
            onChange={handleOnChange}
            name='pricingInDollar'
            value={state.pricingInDollar}
          />
        </div>
        <div className='form-group col-md-3'>
          <label htmlFor='pricingInRupee'>Pricing in ₹</label>
          <input
            type='number'
            className='form-control'
            onChange={handleOnChange}
            name='pricingInRupee'
            value={state.pricingInRupee}
          />
        </div>
        <div className='form-group col-md-3'>
          <label htmlFor='totalAmount'>Total Amount</label>
          <input
            type='number'
            className='form-control'
            onChange={handleOnChange}
            name='totalAmount'
            value={state.totalAmount}
          />
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
          {/* <TextField
            id="date"
            label="Next Billing Date"
            type="date"
            defaultValue="2017-05-24"
            className="form-control"
            InputLabelProps={{
              shrink: true,
            }}
          /> */}
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

          {state.softwareName &&
          state.teamName &&
          state.selectType &&
          state.owner &&
          // state.billingCycle &&
          state.month &&
          state.pricingInDollar &&
          state.pricingInRupee &&
          state.totalAmount &&
          state.nextBilling ? (
            <button
              className='form-control btn btn-primary share-btn'
              onClick={handleSubmit}
            >
              Save
            </button>
          ) : (
            <button
              className='form-control btn btn-primary share-btn'
              onClick={handleSubmit}
              disabled
            >
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
export default Form;
