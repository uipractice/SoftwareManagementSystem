import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import Footer from '../NavBar/Footer';
import CompleteTable from '../table';
import axios from 'axios';
import Header from '../NavBar/Header';
import { getApiUrl } from '../utils/helper';

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    axios(getApiUrl(`softwareInfo`))
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
        // console.log("respose data", res.data)
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className='container-fluid' style={{ height: 'calc(100vh - 65px)' }}>
        {loading ? (
          <div class='d-flex justify-content-center align-items-center h-100'>
            <span className='loader' />
          </div>
        ) : (
          <div className='row'>
            <div className='col-md-12 ms-sm-auto col-lg-12'>
              <DashboardHeader />
              <CompleteTable data={data} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
