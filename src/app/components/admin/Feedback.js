import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function Feedback({ isOpen, closeModal, handleInputChange,  feedbackText }) {
  const feedBackText = /[a-zA-Z0-9]+([\s]+)*$/;
  return (
    <Modal
      centered
      style={{ borderRadius: '0 !important' }}
      show={isOpen}
      backdrop='static'
      onHide={(e) => closeModal(e, true)}
      className='feedback-modal'
    >
      <Modal.Header closeButton className='modal-area'>
        <h3>Feedback</h3>
      </Modal.Header>
      <Modal.Body>
        <div className='py-2'>
          <h3>Hello Friends</h3>
          <p>Your review will help us to provide you better experience</p>
          <textarea
            type='text'
            autoFocus={true}
            style={{ color: 'black' }}
            onChange={(e) => handleInputChange(e)}
            name='deleteReason'
            value={feedbackText}
          />
          <Button
            onClick={(e) => closeModal(e, false)}
            autoFocus
            className='feedback-submit'
            disabled={!feedbackText.match(feedBackText)}
          >
            Send
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Feedback;
