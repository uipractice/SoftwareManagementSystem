import React, { useState } from 'react';
import './Container.css';
import Form from './Form';

export function DashboardHeader() {
  const [isShown, setIsShown] = useState(false);
  const showModal = () => {
    setIsShown(true);
  };
  const closeModal = () => {
    setIsShown(false);
  };

  return (
    <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3'>
      <h5 className='project-head'>LICENSING DETAILS</h5>

      <div className='btn-toolbar mb-2 mb-md-0'>
        <button
          type='button'
          className='btn work_btn work_btn_blue center modal-button'
          onClick={showModal}
        >
          ADD SOFTWARE/TOOL
        </button>

        {isShown && <Form isOpen={isShown} closeModal={closeModal} />}
      </div>
    </div>
  );
}

export default DashboardHeader;
