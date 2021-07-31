import React, { Component } from 'react';
import './Container.css';
import { Modal } from 'react-bootstrap';
import Form from './Form';

export class DashboardHeader extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true });
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.toggleScrollLock();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };

  render() {
    return (
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3'>
        <h5 className='project-head'>LICENSING DETAILS</h5>

        <div className='btn-toolbar mb-2 mb-md-0'>
          <button
            type='button'
            className='btn work_btn work_btn_blue center modal-button'
            ref={this.buttonRef}
            onClick={this.showModal}
          >
            + ADD SOFTWARE TOOL
          </button>

          {this.state.isShown && (
            <Modal
              centered
              size='lg'
              style={{ borderRadius: '0 !important' }}
              show={this.state.isShown}
              onHide={this.closeModal}
            >
              <Modal.Header closeButton className='modal-area'>
                <h3>Add Tool/Software</h3>
              </Modal.Header>
              <Modal.Body className='modal-body'>
                <Form closeModal={this.closeModal} />
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardHeader;
