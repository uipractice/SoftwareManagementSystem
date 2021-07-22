import React, { useState, useEffect } from "react";
import ShareButtonSection from "./ShareButtonSection";
import Footer from "./Footer";
import CompleteTable from "../table/CompleteTable";
import axios from "axios";
import NotificationIcon from "../../assets/images/bell.svg";
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Logo from "../../assets/images/eoke_logo.svg";

import { Redirect, useHistory } from "react-router-dom";

export default function AdminDashboard() {
  function handleLogout() {
    sessionStorage.removeItem("auth-token");
    checkAuth();
  }

  const history = useHistory();

  const checkAuth = () => {
    if (!sessionStorage.getItem("auth-token")) {
      history.push("/");
    } else {
      const authToken = "123456abcdef";
      if (sessionStorage.getItem("auth-token") === authToken) {
        return <Redirect to="/admin_dashboard" />;
      } else {
        history.push("/");
      }
    }
  };
  checkAuth();

  const [data, setData] = useState([]);

  useEffect(() => {
    axios("http://localhost:5000/clientInfo/")
      .then((res) => {
        setData(res.data);
        // console.log("respose data", res.data)
      })
      .catch((err) => console.log(err));
  }, []);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <div className="navbar navbar-dark sticky-top  p-0 shadow header_nav">
        <div className="row">
          <a className="navbar-brand col-md-6 px-4" href="#/">
            <img src={Logo} alt="Evoke Technologies" />
          </a>
          <h3>Software Assets Management </h3>
        </div>

        <ul className="navbar-nav px-3">
          <li className="notification-btn"><Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <img src={NotificationIcon} alt="notification" />
        </Button></li>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>Lorem ipsum dolur sitLorem ipsum dolur sitLorem ipsum dolur sit</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
          <li className="nav-item text-nowrap">
            <button onClick={handleLogout}></button>
          </li>
        </ul>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 ms-sm-auto col-lg-12">

            <ShareButtonSection />

            <CompleteTable data={data} />

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
