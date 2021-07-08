import React, { useState, useEffect } from "react";
import ShareButtonSection from "./ShareButtonSection";
import Footer from "./Footer";
import CompleteTable from "../table/CompleteTable";
import axios from "axios";

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
