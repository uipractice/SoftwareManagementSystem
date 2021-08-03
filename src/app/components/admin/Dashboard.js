import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import Footer from '../NavBar/Footer';
import CompleteTable from '../table';
import axios from 'axios';
import Header from '../NavBar/Header';

export default function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios('http://localhost:5000/softwareInfo/')
      .then((res) => {
        setData(res.data);
        // console.log("respose data", res.data)
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Header />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12 ms-sm-auto col-lg-12'>
            <DashboardHeader />
            <CompleteTable data={data} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
