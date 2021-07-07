import React, { Component } from "react";
import Modal from "./modal/Modal";
import "./modal/Container.css";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export class ShareModalContainer extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.toggleScrollLock();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };

  // const [alignment, setAlignment] = React.useState('left');
  //   const handleAlignment = (event, newAlignment) => {
  //       setAlignment(newAlignment);
  //   };

  render() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mb-3">
        <ToggleButtonGroup
          // value={alignment}
          exclusive
          // onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned" className="Mui-selected">
            Client Project
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            Internal Project
          </ToggleButton>
        </ToggleButtonGroup>

        <div className="btn-toolbar mb-2 mb-md-0">
          <button
            type="button"
            className="btn btn-light work_btn work_btn_blue center modal-button"
            ref={this.buttonRef}
            onClick={this.showModal}
          >
            SHARE PROJECT FORM
          </button>

          {this.state.isShown ? (
            <Modal
              modalRef={(n) => (this.modal = n)}
              buttonRef={(n) => (this.closeButton = n)}
              closeModal={this.closeModal}
              onKeyDown={this.onKeyDown}
              onClickOutside={this.onClickOutside}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ShareModalContainer;
