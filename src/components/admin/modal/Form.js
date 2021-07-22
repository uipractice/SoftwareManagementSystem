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
    projectNameByIT: "",
    projectManager: "",
    email: "",
    practice: "",
    status: "Pending",
    deleteReason: "",
    restoreReason: "",
    reshareReason: "",
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
      projectNameByIT: "",
      projectManager: "",
      email: "",
      practice: "",
    });
  };

  function ValidateEmail(inputText) {
    const mailformat = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    // const mailformat = /^\w+@evoketechnologies.com/;
    if (inputText.match(mailformat)) {
      return true;
    } else {
      toast.error("Invalid email ID !", {
        autoClose: 1800,
      });
      return false;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (ValidateEmail(state.email))  {
      axios
            .post("http://localhost:5000/clientInfo/email", state)
            .then((res) => {
              if (res.data === "success") {
                closeModal();
                toast.success("Data Saved Successfully !", {
                  autoClose: 2000,
                });
                console.log(state);

                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else {
                toast.error("Data Saved FAILED !", {
                  autoClose: 2000,
                });
                console.log(state);
              }
            })

            .catch((err) => console.log(err.response));
      }
  }

   

  return (
    <form>
      <div className="row">
        <div className="form-group col-md-5">
          <label htmlFor="projectNameByIT">Tool/Software</label>
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            onChange={handleOnChange}
            name="projectNameByIT"
            value={state.projectNameByIT}
          />
        </div>

        <div className="form-group col-md-4">
          <label htmlFor="projectManager">Team</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="projectManager"
            value={state.projectManager}
          />
        </div>

        <div className="form-group col-md-3">
          <label htmlFor="Type">Type</label>
          <input 
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="Type"
            value=""
          />
        </div>
      </div>

      <div class="row">
        <div className="form-group col-md-5">
          <label>User/Owner</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="email"
            value={state.email}
          />
        </div>
        <div className="form-group col-md-4">
          <label>Billing Cycle</label>
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
      <div className="form-group col-md-6">
        <label>Practice Name </label>
        <select
          className="form-control"
          onChange={handleOnChange}
          name="practice"
          value={state.practice}
        >
          <option value=""></option>
          <option value="QA Practice">QA Practice</option>
          <option value="Oracle Practice">Oracle Practice</option>
          <option value="Java Practice">Java Practice</option>
          <option value="Microsoft Practice">Microsoft Practice</option>
          <option value="Other">Other Practice</option>
        </select>
      </div>
      <div className="form-group col-md-6">
          <label htmlFor="projectManager">Other Practice</label>
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
            name="other practice"
            value=''
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
              Share
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
export default Form;
