// common
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
// assets
import Logo from '../../assets/images/eoke_logo.svg';
import NotificationIcon from '../../assets/images/bell.svg';
import ProfileIcon from '../../assets/images/user-icon.svg';
import FeedbackIcon from '../../assets/images/feedback.svg';
import LogoutIcon from '../../assets/images/Logout_icon.svg';
// components
import Feedback from '../admin/Feedback';
// css
import './NavBar.css';
// helpers
import { getApiUrl } from '../utils/helper';

const Header = ({ validate }) => {
  function handleLogout() {
    sessionStorage.removeItem('auth-token');
    checkAuth();
  }

  const history = useHistory();

  const checkAuth = () => {
    if (!sessionStorage.getItem('auth-token')) {
      history.push('/');
    } else {
      const authToken = '123456abcdef';
      if (sessionStorage.getItem('auth-token') === authToken) {
        return <Redirect to='/admin_dashboard' />;
      } else {
        history.push('/');
      }
    }
  };

  if (validate) {
    checkAuth();
  }
  const [feedback, setFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = React.useState('');

  /**
   * Setting modal close state and call api to send the mail.
   *
   * @param {Object} event current event object.
   * @param {Boolean} closeClick contains boolean to defined the close click.
   * @return {null}
   */
  const handleSubmit = (e, closeClick) => {
    setFeedback(false);
    if (!closeClick) {
      const feedback = {
        feedbackText,
      };
      axios
        .post(getApiUrl(`softwareInfo/feedbackMail`), feedback)
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
  const handleInputChange = (e) => {
    setFeedbackText(e.target.value.trim());
  };
  return (
    <div>
      <div className='navbar navbar-dark sticky-top  p-0 shadow header_nav'>
        <div className='row'>
          <a className='navbar-brand col-md-6 px-4' href='/#/admin'>
            <img src={Logo} alt='Evoke Technologies' />
          </a>
          <h3>
            <span>e</span>Soft
          </h3>
        </div>

        <ul className='navbar-nav px-3'>
          <li className='notification-btn'>
            <div>
              <img src={NotificationIcon} alt='NoticicationIcon' />
            </div>
          </li>
          <li className='vertical-line'></li>

          <li className='nav-item text-nowrap'>
            <OverlayTrigger
              trigger='click'
              key={'bottom'}
              placement={'bottom'}
              rootClose={true}
              overlay={
                <Popover id={`popover-positioned-${'bottom'}`}>
                  <Popover.Content>
                    <div className='menu-list'>
                      <div
                        className='menu-list-item'
                        onClick={() => setFeedback(true)}
                      >
                        <img src={FeedbackIcon} alt='feedback' />{' '}
                        <span>Provide Feedback</span>
                      </div>
                      <div className='menu-list-item' onClick={handleLogout}>
                        <img src={LogoutIcon} alt='logout' />{' '}
                        <span>Logout</span>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover>
              }
            >
              <div>
                <img src={ProfileIcon} alt='ProfileIcon' />
              </div>
            </OverlayTrigger>
          </li>
        </ul>
        <Feedback
          isOpen={feedback}
          closeModal={(e, closeClick) => {
            setFeedbackText('');
            handleSubmit(e, closeClick);
          }}
          handleInputChange={(e) => handleInputChange(e)}
          feedbackText={feedbackText}
        />
      </div>
    </div>
  );
};

export default Header;
