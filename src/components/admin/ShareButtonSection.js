import React, { Component } from 'react';
import Modal from './modal/Modal';
import './modal/Container.css';

export class ShareModalContainer extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
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
              modalRef={(n) => (this.modal = n)}
              buttonRef={(n) => (this.closeButton = n)}
              closeModal={this.closeModal}
              onKeyDown={this.onKeyDown}
              onClickOutside={this.onClickOutside}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ShareModalContainer;
