import React from 'react';
import Feedback from '../admin/Feedback';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// helpers
import { getApiUrl } from '../utils/helper';

export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  /**
   * Setting modal close state and call api to send the mail.
   *
   * @param {Object} event current event object.
   * @param {Boolean} closeClick contains boolean to defined the close click.
   * @return {null}
   */
  const handleClose = (event, closeClick) => {
    setOpen(false);
    if (!closeClick) {
      axios
        .post(getApiUrl(`softwareInfo/feedbackMail`))
        .then((res) => {
          console.log(res.data);
          toast.success('A Reminder mail has been triggered !', {
            autoClose: 1800,
          });
        })
        .catch((err) => console.log(err.response));

      setTimeout(() => {
        history.push('/admin');
      }, 2000);
    }
  };

  return (
    <div className='footer'>
      <ul>
        <li>
          <p>Evoke Technologies Pvt Ltd © 2021 All Rights Reserved</p>
        </li>
        <li>
          <button className='link-btn' onClick={() => setOpen(true)}>
            Provide Feedback
          </button>
        </li>
        <Feedback
          isOpen={open}
          closeModal={(e, closeClick) => handleClose(e, closeClick)}
        />
      </ul>
    </div>
  );
}
