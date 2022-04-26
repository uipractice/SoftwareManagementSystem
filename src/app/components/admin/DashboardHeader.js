import React, { useState } from 'react';
import './Container.css';
import Form_new from './Form_new';

export function DashboardHeader({getAddToolStatus}) {
  const [isShown, setIsShown] = useState(false);
  const showModal = () => {
    setIsShown(true);
  };
  const closeModal = () => {
    setIsShown(false);
  };
  const updateSatus=(value)=>{
    getAddToolStatus(value)
    
  }

  return (
    <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3'>
      <h5 className='project-head'>LICENSING DETAILS</h5>

      <div className='btn-toolbar mb-2 mb-md-0'>
        <button
          type='button'
          className='btn work_btn work_btn_blue center modal-button'
          onClick={showModal}
        >
          ADD TOOL/SOFTWARE
        </button>

        {isShown && <Form_new type={'new'} isOpen={isShown} closeModal={closeModal}  updateToolStatus={updateSatus}/>}
      </div>
    </div>
  );
}

export default DashboardHeader;
