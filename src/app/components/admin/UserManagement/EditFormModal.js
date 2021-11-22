import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Modal } from 'react-bootstrap';

import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import Footer from '../../admin/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../admin/NavBar';
import { getApiUrl } from '../../utils/helper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField'

toast.configure();

function EditViewForm({ isOpen, closeModal, data }) {
  
//   function edit(postObj) {
//     return axios
//       .put(getApiUrl(`clientInfo/editAndUpdate/${id}`), postObj)
//       .then((res) => {
//         console.log(res);
//         return res;
//       });
//   }

//   const addAttachment = (fileInput) => {
//     const files = [...fileData];
//     for (const file of fileInput.target.files) {
//       files.push(file);
//     }
//     console.log('files', files);
//     setFileData(files);
//   };

//   function handleSubmitForm() {
//     const postObj = {
//       projectNameByIT,
//       securityMeasure,
//       informIT,
//       allowedWebsite,
//       securityBreach,
//       disasterDetails,
//       isolationDetails,
//       status,
//       NDAsigned,
//       GDPRcompliance,
//       CyberSecConducted,
//       IsolatedEnvReq,
//       DisasterInsuCovered,
//       showInsuranceDetails,
//       showIsolatedDetails,
//       DLPreq,
//       ClientEmailProvided,
//       workStationValue,
//       devTypeValue,
//     };
//     edit(postObj)
//       .then((res) => {
//         toast.success('Form sumbitted successfully !', {
//           autoClose: 1900,
//         });
//         setTimeout(() => {
//           history.push('/dashboard');
//         }, 2000);
//       })
//       .catch((err) => {
//         toast.error('Failed to save the data !', {
//           autoClose: 3000,
//         });
//       });
//     setTimeout(() => {
//       history.push('/dashboard');
//     }, 2000);

//     if (fileData.length) {
//       const formData = new FormData();
//       for (let file of fileData) {
//         formData.append('fileName', file);
//       }
//       axios
//         .post(getApiUrl(`multiple/${id}`), formData)
//         .then((res) => {
//           console.log('Files Uploaded : ', res.data);
//         })
//         .catch((err) => {
//           console.log('Error in Upload : ', err);
//         });
//     }
//   }

  function SubmitButton() {
    if (true
    ) {
      return (
        <Button
          variant='primary'
          className='submit-btn'
          //onClick={() => handleSubmitForm()}
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            width: '130px',
          }}
        >
          Update
        </Button>
      );
    } else {
      return (
        <Button
          disabled
          variant='primary'
          className='submit-btn'
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            width: '130px',
          }}
        >
          {' '}
          Update
        </Button>
      );
    }
  }
  return (
    <Modal
      centered
      //size='md'
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      backdrop='static'
      onHide={() => closeModal()}
      className='modalDesign deleteModal'
    >
      <div className='custom-scroll'>
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <div style={{ width: '700px' }} className='project-details-form'>
                <h2> Project Details </h2>
                <button
                  className='modal-closeBtn'
                 // onClick={() => history.push('/dashboard')}
                >
                  <svg className='_modal-close-icon' viewBox='0 0 40 40'>
                    <path d='M 10,10 L 30,30 M 30,10 L 10,30' />
                  </svg>
                </button>
                <Modal.Body>
                <Form>
                  <Form.Group style={{ marginBottom: '40px' }}>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        //setProjectNameByIT(e.target.value);
                      }}
                     value={data.userName}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: '40px' }}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        // const value = e.target.value.replace(
                        //   /[^a-zA-Z0-9 ]/g,
                        //   ''
                        // );
                        // if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
                        //   setSecurityMeasure(value);
                        // } else {
                        //   setSecurityMeasure((previousState) => '');
                        // }
                      }}
                     value={data.password}
                      autoFocus
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: '40px' }}>
                    <Form.Label>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      value={data.emailId}
                      onChange={(e) => {
                        // const value = e.target.value.replace(
                        //   /[^a-zA-Z0-9 ]/g,
                        //   ''
                        // );
                        // if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
                        //   setInformIT(value);
                        // } else {
                        //   setInformIT((previousState) => '');
                        // }
                      }}
                    />
                  </Form.Group>
                  <Form.Group style={{ marginBottom: '40px' }}>
                    <Form.Label>
                      Contact Number
                    </Form.Label>
                    <Form.Control
                      value={data.contactNumber}
                      onChange={(e) => {
                        // const value = e.target.value.replace(
                        //   /[^a-zA-Z0-9 ]/g,
                        //   ''
                        // );
                        // if (value.match(/[a-zA-Z0-9]+([\s]+)*$/)) {
                        //   setInformIT(value);
                        // } else {
                        //   setInformIT((previousState) => '');
                        // }
                      }}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginBottom: '40px' }}>
                    <Form.Label>Team * </Form.Label>
          <Autocomplete
            options={[
              { label: 'BI Team', value: 1 },
              { label: 'Big Data Team', value: 2 },
              { label: 'Block Chain Team', value: 3 },
              { label: 'BPM Team', value: 4 },
              { label: 'BPO Team', value: 5 },
              { label: 'Data Science Team', value: 6 },
              { label: 'Delivery Team', value: 7 },
              { label: 'Java Team', value: 8 },
              { label: 'Microsoft Team', value: 9 },
              { label: 'Mobility Team', value: 10 },
              { label: 'Open Source Team', value: 11 },
              { label: 'Oracle Team', value: 12 },
              { label: 'Pega Team', value: 13 },
              { label: 'QA Team', value: 14 },
              { label: 'RPA Team', value: 15 },
              { label: 'Sales Force Team', value: 16 },
              { label: 'Service Now Team', value: 17 },
              { label: 'Support Team', value: 18 },
              { label: 'UI Team', value: 19 },
              { label: 'Other', value: 20 },
            ]}
            value={data.team}
            name="team"
            getOptionLabel={(option) => data.team && option.label ? option.label : option}
            getOptionSelected={(option, value) => option.value === value.value}
            // onChange={(event, value) => handleOnDropdownChange('team', value)}
            renderInput={(params) => 
              <TextField {...params} variant='outlined' name="team"/>
            }
          />
        </Form.Group>
        <Form.Group style={{ marginBottom: '40px' }}>
          <Form.Label>Status * </Form.Label>
          <Autocomplete
            options={[
              { label: 'Active', value: 1 },
              { label: 'InActive', value: 2 },
            ]}
            name='status'
            value={data ? data.status : ''}
            getOptionLabel={(option) => data.status && option.label ? option.label : option}
            getOptionSelected={(option, value) => option.value === value.value}
           // onChange={(event, value) => handleOnDropdownChange('status', value)}
            renderInput={(params) => (
              <TextField {...params} variant='outlined' name="status"/>
            )}
          />
           </Form.Group>
          <Form.Group style={{ marginBottom: '40px' }}>
          <Form.Label>Role * </Form.Label>
          <Autocomplete
            options={[
                { label: 'Admin', value: 1 },
                { label: 'SuperAdmin', value: 2 },
                { label: 'Guest', value: 3 },
              ]}
            name='role'
            value={data ? data.role : ''}
            getOptionLabel={(option) => data.role && option.label ? option.label : option}
            getOptionSelected={(option, value) => option.value === value.value}
           // onChange={(event, value) => handleOnDropdownChange('status', value)}
            renderInput={(params) => (
              <TextField {...params} variant='outlined' name="role"/>
            )}
          />
         </Form.Group>
                  
                  <Button
                    onClick={() => window.location.reload()}
                    className='reshare'
                    style={{
                      marginTop: '20px',
                      marginBottom: '20px',
                      marginRight: '15px',
                      width: '130px',
                    }}
                  >
                    {' '}
                    Reset
                  </Button>

                  <SubmitButton />
                </Form>
                </Modal.Body>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Footer /> */}
    </Modal>
  );
}

export default EditViewForm;
