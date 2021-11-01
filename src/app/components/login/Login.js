import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import '../../../index.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthServices from '../../services/AuthServices'

toast.configure();

function Login() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [user, setUser] = React.useState({
    userName: "",
    password: "",
  });

  const history = useHistory();

  function handleCredentials(evt) {
    setUser({
      ...user,
      [evt.target.name]: evt.target.value,
    });
  }

 
  function handleLogin(e) {
    e.preventDefault();
    setUser({
      ...user,
      userName: "",
      password: "",
    });
    AuthServices.login(user)
      .then((res) => {
        if (res.data.accessToken) {
          const token = "123456abcdef";
          sessionStorage.setItem("auth-token", token);
          history.push("/admin");
        } else {
          toast.error(res.data.message + ` ${"!!"}`, {
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.log("login", error);
        setUser({
          ...user,
          userName: "",
          password: "",
        });
      });
  }

  function SubmitButton() {
    if (user.userName && user.password) {
      return (
        <button className='btn btn-primary btn_blue w-100p' type='submit'>
          SIGN IN
        </button>
      );
    } else {
      return (
        <button className='btn btn-primary btn_blue w-100p' disabled>
          SIGN IN
        </button>
      );
    }
  }

  return (
    <div className='container-fluid nopad'>
      <div className='container_login'>
        <div className='wrap_login'>
          <form className='login_form' onSubmit={handleLogin}>
            <div className='form_main'>
              <div className='login-form-title '>
                <h3>Sign in</h3>
                <p>
                  Welcome to{' '}
                  <span className='esoftColor'>
                    <span>e</span>Soft
                  </span>
                </p>
              </div>

              <div className='validate-input m-b-20'>
                <label className='form-label'>Username</label>
                <input
                  ref={inputRef}
                  type='text'
                  className='form-control'
                  onChange={handleCredentials}
                  name='userName'
                  value={user.userName}
                />
              </div>

              <div className='validate-input m-b-40'>
                <label className='form-label'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  onChange={handleCredentials}
                  name='password'
                  value={user.password}
                />
              </div>

              <div className='col-md-12 form_btn_group'>
                <SubmitButton />
              </div>
            </div>
          </form>

          <div className='login_more'></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
