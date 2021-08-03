import React from 'react';
import Feedback from '../admin/Feedback';

export default function Footer() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='footer'>
      <ul>
        <li>
          <p>Evoke Technologies Pvt Ltd © 2021 All Rights Reserved</p>
        </li>
        <li>
          <a href='#' onClick={() => setOpen(true)}>
            Provide Feedback
          </a>
        </li>
        <Feedback isOpen={open} closeModal={() => setOpen(false)} />
      </ul>
    </div>
  );
}
