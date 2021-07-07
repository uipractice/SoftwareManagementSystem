import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "../../assets/images/eoke_logo.svg";
import Modal from "react-modal"; //why you removed this one?
import Footer from "../admin/Footer";

import axios from "axios";

import { useLocation, useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function ViewForm() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestoreModalOpen, setRestoreIsModalOpen] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const location = useLocation(); 
  const {
    projectNameByIT,
    projectManager,
    email,
    practice,
    status,
    id,
    deleteReason,
    reshareReason,
    securityMeasure,
    informIT,
    workStationSelected,
    devTypeSelected,
    allowedWebsite,
    isNDAsigned,
    isGDPRcompliance,
    isCyberSecConducted,
    securityBreach,
    isDisasterInsuCovered,
    disasterDetails,
    showInsuranceDetails,
    isIsolatedEnvReq,
    isolationDetails,
    showIsolatedDetails,
    isDLPreq,
    isClientEmailProvided,
  } = location.state;



  const[totalState, setTotalState] = useState({
    projectNameByITIS:projectNameByIT,
    projectManager,
    email,
    practice,
    status,
    id,
    deleteReason,
    securityMeasure,
    informIT,
    workStationSelected,
    devTypeSelected,
    allowedWebsite,
    isNDAsigned,
    isGDPRcompliance,
    isCyberSecConducted,
    securityBreach,
    isDisasterInsuCovered,
    disasterDetails,
    showInsuranceDetails,
    isIsolatedEnvReq,
    isolationDetails,
    showIsolatedDetails,
    isDLPreq,
    isClientEmailProvided,
    reshareReason
  })

  function reshareReasonInput(evt) {
    setTotalState({
      ...totalState,
      reshareReason: evt.target.value,
    });
  }

  function restoreReasonInput(evt) {
    setTotalState({
      ...totalState,
      restoreReason: evt.target.value,
    });
  }

  const history = useHistory();

  const handleApprove = () => {
    totalState.status = "Approved";
    axios
      .post("http://localhost:5000/clientInfo/approvStatus/" + id, totalState)
      .then((res) => {
        console.log(res.data);
        toast.success("Record Approved !", {
          autoClose: 1800,
        });
      })
      .catch((err) => console.log(err.response));

    setTimeout(() => {
      history.push("/admin");
    }, 2000);
  };


  const handleRestore = (e) => {
    e.preventDefault();
    totalState.status = "Submitted";
    axios
      .post("http://localhost:5000/clientInfo/restoreProject/" + id, totalState)
      .then((res) => {
        console.log(totalState);
        toast.success("Record is Restored !", {
          autoClose: 1800,
        });
        setRestoreIsModalOpen(false);
      })
      .catch((err) => console.log(err.response));

    // setTimeout(() => {
    //   history.push("/admin");
    // }, 2000);
  };

  const handleReshare = (e) => {
    e.preventDefault();
    totalState.status = "Pending";
    axios
      .post("http://localhost:5000/clientInfo/mailReshare/" + id, totalState)
      .then((res) => {
        console.log(res.data);
        toast.success("Record is Re-Shared !", {
          autoClose: 1800,
        });
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err.response));

    // setTimeout(() => {
    //   history.push("/admin");
    // }, 2000);
  };

  const handleReminder = () => {
    axios
      .post("http://localhost:5000/clientInfo/mailReminder/" + id, totalState)
      .then((res) => {
        console.log(res.data);
        toast.success("A Reminder mail has been triggered !", {
          autoClose: 1800,
        });
      })
      .catch((err) => console.log(err.response));

      setTimeout(() => {
        history.push("/admin");
      }, 2000);
  };




  return (
    <div >
      <div className="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow header_nav">
        <div className="row">
          <a
            className="navbar-brand col-md-6 px-4"
            href="http://localhost:3000/admin"
          >
            <img src={Logo} alt="Evoke Logo" />
          </a>
          <h3>Project Information System </h3>
        </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <button></button>
          </li>
        </ul>
      </div>

      <div>
        <Modal
          isOpen={isRestoreModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          className="modalDesign deleteModal"
        >
          <h2>Restore the project</h2>
          <button
            className="_modal-close"
            onClick={() => {
              setRestoreIsModalOpen(false);
            }}
          >
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <form>
            <p >Please enter why you want to restore the record.</p>
            <textarea
              type="text"
              autoFocus={true}
              style={{ color: "black", marginTop: "20px", marginBottom: "60px" }}
              onChange={restoreReasonInput}
              name="restoreReason"
            />
            

            <div className="row">
              <div className="col-md-6 text-right padding0">
                <button
                  className="form-control btn btn-primary"
                  onClick={() => {
                    setRestoreIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6">
                {totalState.restoreReason ? (
                  <button
                    onClick={handleRestore}
                    className="form-control btn btn-primary delete-btn"
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    className="form-control btn btn-primary delete-btn"
                    disabled
                  >
                    Reshare
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          className="modalDesign deleteModal"
        >
          <h2>Request the re-submit the form</h2>
          <button
            className="_modal-close"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <form>
            <p >Please enter the which data is incompleted.</p>
            <textarea
              type="text"
              autoFocus={true}
              style={{ color: "black", marginTop: "20px", marginBottom: "60px" }}
              onChange={reshareReasonInput}
              name="reshareReason"
            />
            
            <div className="row">
              <div className="col-md-6 text-right padding0">
                <button
                  className="form-control btn btn-primary"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6">
                {totalState.reshareReason ? (
                  <button
                    onClick={handleReshare}
                    className="form-control btn btn-primary delete-btn"
                  >
                    Reshare
                  </button>
                ) : (
                  <button
                    className="form-control btn btn-primary delete-btn"
                    disabled
                  >
                    Reshare
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      </div>

      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <div
              style={{ width: "700px" }}
              className="project-details-form formView"
            >
              <h2> Project Details </h2>

              {/* todo */}
              <button
                className="modal-closeBtn"
                onClick={() => history.push("/admin")}
              >
                <svg className="_modal-close-icon" viewBox="0 0 40 40">
                  <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                </svg>
              </button>

              {status !== "Pending" ? (
                <Form>
                  <Form.Group style={{ marginBottom: "40px" }}>
                    {totalState.deleteReason && (
                      <div>
                        <Form.Label style={{ color: "red", marginTop: "20px" }}>
                          This project has been Deleted bacause
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={deleteReason}
                          readOnly={true}
                        />
                      </div>
                    )}

                    {totalState.restoreReason && (
                      <div>
                        <Form.Label style={{ color: "blue", marginTop: "40px" }}>
                          This project has been Restored back bacause
                        </Form.Label>

                        <Form.Control
                          type="text"
                          value={totalState.restoreReason}
                          readOnly={true}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>Name of the project or client</Form.Label>
                    <Form.Control
                      type="text"
                      value={totalState.projectNameByIT}
                      readOnly={true}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>Security measures from client side</Form.Label>
                    <Form.Control
                      type="text"
                      value={securityMeasure}
                      readOnly={true}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Information to IT at the time of project kick-off
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={informIT}
                      readOnly={true}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Work stations type provided in Evoke{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button
                        size="sm"
                        style={{ width: "100px" }}
                        ref={inputRef}
                      >
                        {workStationSelected}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label> Development type </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button
                        size="sm"
                        style={{ width: "auto" }}
                        className="dev-btn"
                      >
                        {devTypeSelected}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>Websites need to be allowed</Form.Label>
                    <Form.Control
                      type="text"
                      value={allowedWebsite}
                      readOnly={true}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      NDA/DPA (Data Privacy Agreement) signed ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button size="sm" style={{ width: "80px" }}>
                        {isNDAsigned}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Did all the project related documents (security, GDPR
                      complaiance and MSA) are collected from client ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button size="sm" style={{ width: "80px" }}>
                        {isGDPRcompliance}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Cyber security induction meeting conducted with client as
                      well as in house (importance of data security to followed
                      by all users) ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button size="sm" style={{ width: "80px" }}>
                        {isCyberSecConducted}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Any project risks identified in the course of interims of
                      security breach or calamities ?
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={securityBreach}
                      readOnly={true}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Insurance coverage in case of disater issues ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button
                        size="sm"
                        style={{
                          width: "80px",
                          marginBottom: "20px",
                        }}
                      >
                        {isDisasterInsuCovered}
                      </Button>

                      {showInsuranceDetails === "true" ? (
                        <div>
                          <Form.Text>
                            {" "}
                            Details for insurance company coverage terms and
                            insurance company spoc
                          </Form.Text>
                          <Form.Control
                            type="text"
                            value={disasterDetails}
                            readOnly={true}
                          />
                        </div>
                      ) : null}
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      {" "}
                      Does client need any isolated environment requirement ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button
                        size="sm"
                        style={{ width: "80px", marginBottom: "20px" }}
                      >
                        {isIsolatedEnvReq}
                      </Button>

                      {showIsolatedDetails === "true" ? (
                        <div>
                          <Form.Text>
                            {" "}
                            Details of physical isolation of network, physical
                            isolation for workspace, DLP etc
                          </Form.Text>
                          <Form.Control
                            type="text"
                            value={isolationDetails}
                            readOnly={true}
                          />
                        </div>
                      ) : null}
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Does client require DLP/Encryption enabled laptops for
                      their users ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Button size="sm" style={{ width: "80px" }}>
                        {isDLPreq}
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "40px" }}>
                    <Form.Label>
                      Is client providing Email services to user for regular
                      business communication ?{" "}
                    </Form.Label>
                    <Form.Group style={{ marginBottom: "60px" }}>
                      <Button size="sm" style={{ width: "80px" }}>
                        {isClientEmailProvided}
                      </Button>
                    </Form.Group>
                  </Form.Group>
                </Form>
              ) : (
                <span>
                  <Form.Group style={{ marginTop: "150px" }}>
                    <Form.Label>
                      The project details has not been Submitted by the{" "}
                      <b> {projectManager} </b> yet. <br />
                      <br />
                      Would you like to send a gentel reminder?
                    </Form.Label>
                  </Form.Group>

                  <Button
                    className="reshare"
                    onClick={() => history.push("/admin")}
                    ref={inputRef}
                    style={{
                      marginBottom: "90px",
                      marginTop: "80px",
                      marginRight: "15px",
                      width: "130px",
                    }}
                  >
                    {" "}
                    Close
                  </Button>

                  <Button
                    className="reshare"
                    ref={inputRef}
                    style={{
                      marginBottom: "90px",
                      marginTop: "80px",
                      marginRight: "15px",
                      width: "130px",
                    }}
                    onClick={() => {
                      handleReminder();
                    }}
                  >
                    {" "}
                    Reminder
                  </Button>
                </span>
              )}

              {status === "Submitted" ? (
                <Button
                  onClick={() => {
                    
                    setIsModalOpen(true);

                  }}
                  className="reshare"
                  style={{
                    marginBottom: "40px",
                    marginRight: "15px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Reshare
                </Button>
              ) : null}

              {status === "Submitted" ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApprove();
                  }}
                  className="approve"
                  style={{
                    marginBottom: "40px",
                    marginRight: "15px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Approve
                </Button>
              ) : null}

              {status === "Deleted" ? (
                <Button
                  className="reshare"
                  onClick={() => history.push("/admin")}
                  ref={inputRef}
                  style={{
                    marginBottom: "70px",
                    marginRight: "15px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Close
                </Button>
              ) : null}

              {status === "Deleted" ? (
                <Button
                  onClick={() => setRestoreIsModalOpen(true)}
                  style={{
                    marginBottom: "70px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Restore
                </Button>
              ) : null}

              {status === "Approved" ? (
                <Button
                  className="reshare"
                  onClick={() => history.push("/admin")}
                  ref={inputRef}
                  style={{
                    marginBottom: "70px",
                    //  marginTop: "30px",
                    marginRight: "15px",
                    width: "130px",
                  }}
                >
                  {" "}
                  Close
                </Button>
              ) : null}

              {/* {status === "Hidden" ? (
                <input ref={inputRef} type="text" />
              ) : null} */}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default ViewForm;
