import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function Feedback({ isOpen, closeModal, feedbackText, handleInputChange }) {
  return (
    <Modal
      centered
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      onHide={(e) => closeModal(e, true)}
      className='feedback-modal'
    >
      <Modal.Header closeButton className='modal-area'>
        <h3>Feedback</h3>
      </Modal.Header>
      <Modal.Body>
        <div className='py-2'>
          <h3>Hello Friends</h3>
          <p>Your review will help us go give you the better experience</p>
          <textarea
            type='text'
            autoFocus={true}
            style={{ color: 'black' }}
            onChange={(e) => handleInputChange(e)}
            name='deleteReason'
          />
          <Button
            onClick={(e) => closeModal(e, false)}
            autoFocus
            className='feedback-submit'
            disabled={feedbackText === ''}
          >
            Send
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Feedback;
