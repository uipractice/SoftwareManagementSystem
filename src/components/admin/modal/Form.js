import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Container.css";
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function Form({ closeModal }) {

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);


  const [state, setState] = useState({
    softwareName: "",
    teamName: "",
    type: "",
    owner: "",
    billingCycle: "",
    pricingInDollar: "",
    pricingInRupee: "",
    totalAmount: "",
    nextBilling: "",
    timeline: "",
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
      softwareName: "",
      teamName: "",
      type: "",
      owner: "",
      pricingInDollar: "",
      pricingInRupee: "",
      totalAmount: "",
    });
  };



  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form>
      <div className="row">
      <div className="form-group col-md-3">
          <label htmlFor="type">Select Type</label>
          <select
            ref={inputRef}
            className="form-control"
            onChange={handleOnChange}
            name="type"
            value={state.type}
          >
          <option value="Software">Software</option>
          <option value="Certificate">Certificate</option>
          <option value="Domain">Domain</option>
          </select>
        </div>
        <div className="form-group col-md-5">
          <label htmlFor="softwareName">Tool/Software</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="softwareName"
            value={state.softwareName}
          />
        </div>
        <div className="form-group col-md-4">
          <label htmlFor="teamName">Team</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="teamName"
            value={state.teamName}
          />
        </div>
      </div>

      <div class="row">
        <div className="form-group col-md-5">
        <label htmlFor="type">User/Owner</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="owner"
            value={state.owner}
          />
        </div>
        <div className="form-group col-md-4">
        <label htmlFor="billingCycle">Billing Cycle</label>
          <ToggleButtonGroup type="radio" name="options" defaultValue={1} className="mb-2">
            <ToggleButton value={1}> Monthly</ToggleButton>
            <ToggleButton value={2}> Yearly</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="form-group col-md-3">
          <label>For the month of</label>
          <select
          className="form-control"
          onChange={handleOnChange}
          name="month"
          value=""
        >
          <option value=""></option>
          <option value="QA Practice">QA Practice</option>
          <option value="Oracle Practice">Oracle Practice</option>
          <option value="Java Practice">Java Practice</option>
          <option value="Microsoft Practice">Microsoft Practice</option>
          <option value="Other">Other Practice</option>
        </select>
        </div>
      </div>
      <div className="row">
      <div className="form-group col-md-3">
      <label htmlFor="pricingInDollar">Pricing in $</label>
        <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="pricingInDollar"
            value={state.pricingInDollar}
          />
      </div>
      <div className="form-group col-md-3">
      <label htmlFor="pricingInRupee">Pricing in ₹</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="pricingInRupee"
            value={state.pricingInRupee}
          />
        </div>
        <div className="form-group col-md-3">
        <label htmlFor="totalAmount">Total Amount</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="totalAmount"
            value={state.totalAmount}
          />
        </div>
        <div className="form-group col-md-3">
        <label htmlFor="nextBilling">Next Billing Date</label>
          <input
            type="date"
            className="form-control"
            onChange={handleOnChange}
            name="nextBilling"
            value={state.nextBilling}
          />
        </div>
      </div>
      
      <div className="form-group row share">
        <div className="col-md-6"></div>
        <div className="col-md-6 text-right">
          <button
            className="form-control btn btn-primary"
            onClick={handleReset}
          >
            Reset
          </button>

          {state.projectNameByIT &&
          state.projectManager &&
          state.email &&
          state.practice ? (
            <button
              className="form-control btn btn-primary share-btn"
              onClick={handleSubmit}
            >
              Share
            </button>
          ) : (
            <button
              className="form-control btn btn-primary share-btn"
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
