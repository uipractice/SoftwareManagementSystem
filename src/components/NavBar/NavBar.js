import React from "react";
import Logo from "../../assets/images/eoke_logo.svg";
import { Redirect, useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import NotificationIcon from "../../assets/images/bell.svg";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import "./NavBar.css"

const NavBar = ({validate}) => {
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

  if(validate){
    checkAuth();
  }

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleToggleLogout = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }
    setOpen(false);
    setFeedback(false);
  };
  
  const [feedback, setFeedback] = React.useState(false);
  const handleClickOpen = () => {
    setFeedback(!feedback);
    // setFeedback("");
  };
  const prevOpenfeedback = React.useRef(feedback);
  React.useEffect(() => {
    if (prevOpenfeedback.current === true && feedback === false) {
      anchorRef.current.focus();
    }
    prevOpenfeedback.current = feedback;
  }, [feedback]);

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
          <a className="navbar-brand col-md-6 px-4" href="/admin">
            <img src={Logo} alt="Evoke Technologies" />
          </a>
          <h3>Software Management System </h3>
        </div>

        <ul className="navbar-nav px-3">
        <li className="notification-btn"><Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          // onClick={handleToggle}
        >
          <img src={NotificationIcon} alt="notification" />
        </Button>
        {/* <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
        </Popper> */}
        </li>
        
          <li className="nav-item text-nowrap">
            <Button
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="false"
               onClick={handleToggleLogout}
            >
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      <MenuItem className="myprofile" onClick={handleLogout}>My profile</MenuItem>
                      <MenuItem className="feedback" onClick={handleClickOpen}>Provide Feedback</MenuItem>
                      <Dialog
                        open={feedback}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        className="feedback-modal"
                    >
                        <DialogTitle id="alert-dialog-title">{"Feedback"}</DialogTitle>
                        <Button onClick={handleClose} color="primary" className="feedback-close">
                            <svg className="_modal-close-icon" viewBox="0 0 40 40">
                                <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                            </svg>
                        </Button>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <h3>Hello Friends</h3>
                            <p>Your review will help us go give you the better experience</p>
                            <textarea
                            type="text"
                            autoFocus={true}
                            style={{ color: "black" }}
                            // onChange={handleInputChange}
                            name="feedbackReason"
                            />
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        {/* <Button onClick={handleClose} color="primary">
                            Disagree
                        </Button> */}
                        <Button onClick={handleClose} color="primary" autoFocus className="feedback-submit">
                            Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                      <MenuItem className="logout" onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;