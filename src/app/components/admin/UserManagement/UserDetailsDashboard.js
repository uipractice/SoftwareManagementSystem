// common imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../utils/helper';
import Header from '../../NavBar/Header';
import Footer from '../../NavBar/Footer';
import UserTable from '../UserManagement/UserTable';
import AddUserModal from './AddUserModal';
import { useHistory } from 'react-router-dom';
import './UserDetails.css';
import Arrow from '../../../assets/images/Arrow.svg';
import UserManagement from '../../../assets/images/UserManagement.png';

const UserDetailsDashboard = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const history = useHistory();
  const openModal = () => {
    setShowModal(true);
  };
  const getUserDetails = () => {
    axios
      .get(getApiUrl(`users`))
      .then((res) => {
        setUserDetails(res);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUpdatedData = () => {
    setShowModal(false);
    setEditModal(false);
    getUserDetails();
  };

  return (
    <div>
      <Header title={'USER MANAGEMENT'} />
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mb-3 userDetail'>
        <div
          type='button'
          onClick={() => history.push('/admin')}
        >
          <img src={Arrow} alt='User' />
         <img src={UserManagement} alt='User Management' style ={{paddingLeft:'10px'}}/>
        </div>
        <button
          type='button'
          className='btn work_btn work_btn_blue center modal-button'
          onClick={() => openModal()}
        >
          Add User
        </button>
      </div>
      {showModal && (
        <AddUserModal
          isOpen={showModal}
          closeModal={() => {
            setShowModal(false);
          }}
          updateToolStatus={() => getUpdatedData()}
        />
      )}
      {editModal && (
        <AddUserModal
          isOpen={editModal}
          updateToolStatus={() => getUpdatedData()}
          updatedData={editData}
          closeModal={() => setEditModal(false)}
        />
      )}
      {userDetails && userDetails.data && userDetails.data.length > 0 && (
        <UserTable
          data={userDetails.data}
          getEditForm={(data) => {
            setEditModal(true);
            setEditData(data);
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default UserDetailsDashboard;
