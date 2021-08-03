import React, { useState, useRef } from 'react';
import Logo from '../../assets/images/eoke_logo.svg';
import NotificationIcon from '../../assets/images/bell.svg';
import ProfileIcon from '../../assets/images/user-icon.svg';
import FeedbackIcon from '../../assets/images/feedback.svg';
import LogoutIcon from '../../assets/images/Logout_icon.svg';
import { Redirect, useHistory } from 'react-router-dom';
import './NavBar.css';
import Feedback from '../admin/Feedback';
import { OverlayTrigger, Popover } from 'react-bootstrap';

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

  const anchorRef = useRef(null);

  return (
    <div>
      <div className='navbar navbar-dark sticky-top  p-0 shadow header_nav'>
        <div className='row'>
          <a className='navbar-brand col-md-6 px-4' href='/admin'>
            <img src={Logo} alt='Evoke Technologies' />
          </a>
          <h3>Software Management System </h3>
        </div>

        <ul className='navbar-nav px-3'>
          <li className='notification-btn'>
            <div clasName='nav-menu-icon'>
              <img src={NotificationIcon} alt='NoticicationIcon' />
            </div>
          </li>
          <li className='vertical-line'></li>

          <li className='nav-item text-nowrap' ref={anchorRef}>
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
                        <img src={FeedbackIcon} /> <span>Provide Feedback</span>
                      </div>
                      <div className='menu-list-item' onClick={handleLogout}>
                        <img src={LogoutIcon} /> <span>Logout</span>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover>
              }
            >
              <div clasName='nav-menu-icon'>
                <img src={ProfileIcon} alt='ProfileIcon' />
              </div>
            </OverlayTrigger>
          </li>
        </ul>
        <Feedback isOpen={feedback} closeModal={() => setFeedback(false)} />
      </div>
    </div>
  );
};

export default Header;
