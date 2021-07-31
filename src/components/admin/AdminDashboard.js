import React, { useState, useEffect } from 'react';
import ShareButtonSection from './ShareButtonSection';
import Footer from './Footer';
import CompleteTable from '../table/CompleteTable';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

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
      <NavBar />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12 ms-sm-auto col-lg-12'>
            <ShareButtonSection />
            <CompleteTable data={data} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
