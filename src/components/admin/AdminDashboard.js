import React, { useState, useEffect } from "react";
import RowHeaderValue from "./RowHeaderValue";
import ShareButtonSection from "./ShareButtonSection";
import Footer from "./Footer";
import CompleteTable from "../table/CompleteTable";
import axios from "axios";
import IconSubmitted from "../../assets/images/Icon_submitted.svg";
import IconPending from "../../assets/images/Icon_Pending.svg";
import IconApproved from "../../assets/images/Icon_approved.svg";
import IconProjects from "../../assets/images/Icon_Projects.svg";

import Logo from "../../assets/images/eoke_logo.svg";
// import User from "../../assets/images/user.svg"

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
  const [totalCount, setTotalCount] = useState("");
  const [pendingCount, setPendingCount] = useState("");
  const [approvedCount, setApprovedCount] = useState("");
  const [submittedCount, setSubmittedCount] = useState("");

  useEffect(() => {
    axios("http://localhost:5000/clientInfo/")
      .then((res) => {

        setData(res.data);
        // console.log("respose data", res.data)

        setTotalCount(res.data.length);
        setPendingCount(
          res.data.reduce(function (n, person) {
            return n + (person.status === "Pending");
          }, 0)
        );

        setSubmittedCount(
          res.data.reduce(function (n, person) {
            return n + (person.status === "Submitted");
          }, 0)
        );

        setApprovedCount(
          res.data.reduce(function (n, person) {
            return n + (person.status === "Approved");
          }, 0)
        );
      })
      .catch((err) => console.log(err));
  }, []);


  return (
    <div>
      <div className="navbar navbar-dark sticky-top  p-0 shadow header_nav">
        <div className="row">
          <a className="navbar-brand col-md-6 px-4" href="#/">
            <img src={Logo} alt="Evoke Technologies" />
          </a>
          <h3>Project Information System </h3>
        </div>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <button onClick={handleLogout}></button>
          </li>
        </ul>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 ms-sm-auto col-lg-12">
            <ShareButtonSection />

            <div className="row">
              <RowHeaderValue
                projectStatus="Projects"
                iconImg={IconProjects}
                className="totalCount"
                count={totalCount}
              />
              <RowHeaderValue
                projectStatus="Submitted"
                iconImg={IconSubmitted}
                className="submitCount"
                count={submittedCount}
              />
              <RowHeaderValue
                projectStatus="Approved"
                iconImg={IconApproved}
                className="completCount"
                count={approvedCount}
              />
              <RowHeaderValue
                projectStatus="Pending"
                iconImg={IconPending}
                className="pendingCount"
                count={pendingCount}
              />
            </div>

            <CompleteTable data={data} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
