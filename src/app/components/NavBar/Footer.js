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
      const feedback = {
        feedbackText,
      };
      axios
        .post(getApiUrl(`softwareInfo/feebackMail`), feedback)
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
  const [feedbackText, setFeedbackText] = React.useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g,'');
    setFeedbackText(value);
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
          closeModal={(e, closeClick) => {
            setFeedbackText('');
            handleClose(e, closeClick);
          }}
          handleInputChange={(e) => handleInputChange(e)}
          feedbackText={feedbackText}
        />
      </ul>
    </div>
  );
}
