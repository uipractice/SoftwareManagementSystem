import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import moment from 'moment';
// Helpers
import { getApiUrl } from '../utils/helper';

toast.configure();

// default fotm data
const defaultFormData = {
  softwareName: '',
  softwareType: 'software',
  team: '',
  owner: '',
  billingCycle: 'monthly',
  nextBilling: moment().add(1, 'month').format('YYYY-MM-DD'),
  billingDetails: [], // pricingInDollar pricingInRupee billingMonth nextBilling
};

// component to render the form
const Form = ({ isOpen, closeModal, rowData, isEdit = false }) => {
  const inputRef = useRef(null);
  const [state, setState] = useState({});
  const [billingDetails, setBillingDetails] = useState({
    pricingInDollar: '',
    pricingInRupee: '',
    billingMonth: moment().format('MMMM').toLowerCase(),
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
      setBillingDetails({
        ...rowData?.billingDetails?.[rowData.billingDetails.length - 1],
        ...(rowData?.billingCycle === 'monthly' && {
          billingMonth: moment(rowData.nextBilling)
            .format('MMMM')
            .toLowerCase(),
        }),
      });
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
    if (key === 'billingDetails') {
      const value = priceSection ? e.target.value.replace(/[^0-9]/g, "") : e.target.value;
      setBillingDetails({
        ...billingDetails,
        [e.target.name]: value
      });
    } else
      setState({
        ...state,
        [e.target.name]: e.target.value,
        ...(e.target.name === 'billingCycle' && {
          nextBilling: moment()
            .add(1, `${e.target.value === 'monthly' ? 'month' : 'year'}`)
            .format('YYYY-MM-DD'),
        }),
      });
  }

  /**
   * Resetting the billing details.
   *
   * @param {object} e contains event object.
   * @return null.
 */
  const handleReset = (e) => {
    e.preventDefault();
    setState({});
    setBillingDetails({});
  };

  /**
   * Displays the modal.
   *
   * @param {object} e contains event object.
   * @return null.
 */
  const handleSubmit = (e) => {
    e.preventDefault();
    state.billingDetails.push({
      ...billingDetails,
      nextBilling: state.nextBilling,
      createdAt: moment().format('YYYY-MM-DD'),
    });
    axios
      .post(
        `${
          isEdit
            ? getApiUrl(`softwareInfo/update/${rowData?._id}`)
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
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast.error('Data Saved FAILED !', {
            autoClose: 2000,
          });
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
                defaultValue={state?.owner}
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

            <div className='form-group col-md-3'>
              <label htmlFor='billingMonth'>For the month of</label>
              <select
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails')}
                name='billingMonth'
                value={billingDetails?.billingMonth}
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
                <option value='september'>September</option>
                <option value='october'>October</option>
                <option value='november'>November</option>
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
                value={state?.nextBilling}
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='pricingInDollar'>Pricing in $</label>
              <NumberFormat
                thousandsGroupStyle="thousand"
                prefix="$ "
                decimalSeparator="."
                displayType="input"
                type="text"
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                name='pricingInDollar'
                value={billingDetails?.pricingInDollar}
                thousandSeparator={true}
                allowNegative={true} 
              />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='pricingInRupee'>Pricing in ₹</label>
              <NumberFormat
                thousandsGroupStyle="thousand"
                value={billingDetails?.pricingInRupee}
                prefix="₹ "
                decimalSeparator="."
                displayType="input"
                type="text"
                name='pricingInRupee'
                className='form-control'
                onChange={(e) => handleOnChange(e, 'billingDetails', true)}
                thousandSeparator={true}
                allowNegative={true} 
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
