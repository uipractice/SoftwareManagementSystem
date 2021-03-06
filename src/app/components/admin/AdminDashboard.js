import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import Footer from '../NavBar/Footer';
import CompleteTable from '../table';
import axios from 'axios';
import Header from '../NavBar/Header';
import { getApiUrl } from '../utils/helper';
import { superAdmin } from '../constants/constants';
import { getUser } from "../utils/userDetails";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [sortType,setSortType]=useState(false)

  const getSoftwareInfo =(sortType)=>{
    axios(getApiUrl(`softwareInfo`))
    .then((res) => {
      setData(res.data);
      setIsLoading(false);
      setSortType(sortType)
    })
    .catch((err) => {
      setIsLoading(false);
      console.log(err);
    });
  }

  useEffect(() => {
    getSoftwareInfo(sortType);
  }, []);
  // useEffect(() => {
 
  //   if(data.length>0){
  //     console.log("data",data)
  //     setIsLoading(false);
  //   }
   
  // }, [data]);
  // useEffect(() => {
   
  //   if(!loading){
  //     console.log("loading",loading)
  //     setSortType(sortType)
  //   }
   
  // }, [loading]);
  const addToolstatus=(value)=>{
    if(value){
      getSoftwareInfo(value);
    }
  }

  return (
    <div>
      <Header />
      <div className='container-fluid' style={{ height: 'calc(100vh - 65px)' }}>
        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-100'>
            <span className='loader' />
          </div>
        ) : (
          <div className='row'>
            <div className='col-md-12 ms-sm-auto col-lg-12'>
            {JSON.parse(getUser()).role=== superAdmin && 
              <DashboardHeader  getAddToolStatus={addToolstatus}/>}
              <CompleteTable data={data} sortByDateCreated={sortType} getAddToolStatus={addToolstatus}/>
              
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
