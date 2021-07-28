import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Footer(){
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

        return(
            <div className="footer">
                <ul>
                    <li><p>Evoke Technologies Pvt Ltd © 2021 All Rights Reserved</p></li>
                    <li><a href="#" onClick={handleClickOpen}>Provide Feedback</a></li>
                    <Dialog
                        open={open}
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
                            name="deleteReason"
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
                </ul>
            </div>
        );

}
