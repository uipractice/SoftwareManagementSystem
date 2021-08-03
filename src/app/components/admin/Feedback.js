import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function Feedback({ isOpen, closeModal }) {
  return (
    <Modal
      centered
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      onHide={() => closeModal(false)}
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
            // onChange={handleInputChange}
            name='deleteReason'
          />
          <Button
            onClick={() => closeModal(false)}
            autoFocus
            className='feedback-submit'
          >
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Feedback;
