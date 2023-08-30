import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RiseLoader } from 'react-spinners';
import './Signin.css';
import { AuthContext } from '../../App';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit';

const Signin = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(AuthContext);
  let emailRef = useRef('');
  let passwordRef = useRef('');

  const navigate = useNavigate();

  // for dynamic footer year
  const currentYear = new Date().getFullYear();

  // hold current user state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user !== null && token !== null && !state.isAuthenticated) {
      // dispacth and action to set the user data in state
      dispatch({
        type: 'USER',
        payload: { id: user.id, name: user.name, token: token },
      });
      navigate('/allposts');
    } else {
      navigate('/signin');
    }
  }, [state, dispatch, navigate]);

  const handleCheck = () => {
    if (isChecked === false) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // make an axios post request
    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_SIGNIN_URL}`, user);

      if (res.status === 200) {
        dispatch({
          type: 'LOGIN',
          payload: res.data.data,
        });
        emailRef = '';
        passwordRef = '';
        setIsLoading(true);
        toast.success(res.data.message, {
          duration: 2000,
          className: 'bg-success text-light',
        });
        setIsLoading(false);
        navigate('/allposts');
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        duration: 2000,
        className: 'bg-danger text-light',
      });
      emailRef = '';
      passwordRef = '';
      navigate('/signin');
    }
  };

  return (
    <>
      {isLoading ? (
        <MDBContainer
          tag={'div'}
          className='hstack justify-content-center mt-5'>
          <RiseLoader margin={10} color='#3b71ca' />
        </MDBContainer>
      ) : (
        <MDBContainer fluid className='p-3 h-custom'>
          <MDBRow>
            <MDBCol col='10' md='6' className='m-auto'>
              <img
                src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
                className='img-fluid'
                alt='signin'
              />
            </MDBCol>

            <MDBCol col='4' md='6'>
              <div className='d-flex flex-row align-items-center justify-content-center'>
                <p className='lead fw-normal mb-0 me-3'>Sign in with</p>

                <MDBBtn floating size='md' tag='a' className='me-2'>
                  <MDBIcon fab icon='facebook-f' />
                </MDBBtn>

                <MDBBtn floating size='md' tag='a' className='me-2'>
                  <MDBIcon fab icon='twitter' />
                </MDBBtn>

                <MDBBtn floating size='md' tag='a' className='me-2'>
                  <MDBIcon fab icon='linkedin-in' />
                </MDBBtn>
              </div>

              <div className='divider d-flex align-items-center my-4'>
                <p className='text-center fw-bold mx-3 mb-0'>Or</p>
              </div>

              <form className='mt-5' onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email address'
                  id='email'
                  type='email'
                  autoComplete='on'
                  size='md'
                  ref={emailRef}
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='password'
                  type='password'
                  size='md'
                  ref={passwordRef}
                />
                <div className='d-flex justify-content-between mb-4'>
                  <MDBCheckbox
                    name='flexCheck'
                    value=''
                    id='flexCheckDefault'
                    label='Remember me'
                    size={'md'}
                    defaultChecked={isChecked}
                    onClick={handleCheck}
                  />
                  <a href='!#'>Forgot password?</a>
                </div>

                <MDBContainer className='gx-0 text-center text-md-start mt-4 pt-2'>
                  {isChecked === false ? (
                    <MDBBtn className='mb-0 px-5' size='md' rounded disabled>
                      Login
                    </MDBBtn>
                  ) : (
                    <MDBBtn className='mb-0 px-5' size='md' rounded>
                      Login
                    </MDBBtn>
                  )}

                  <MDBContainer className='gx-0 small fw-bold mt-2 pt-1 mb-2'>
                    Don't have an account?
                    <Link to='/signup' className='link-danger'>
                      Register
                    </Link>
                  </MDBContainer>
                </MDBContainer>
              </form>
            </MDBCol>
          </MDBRow>

          <div className='d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary mt-2'>
            <div className='text-white mb-3 mb-md-0'>
              Copyright © {currentYear}. All rights reserved.
            </div>

            <div>
              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: 'white' }}>
                <MDBIcon fab icon='facebook-f' size='md' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: 'white' }}>
                <MDBIcon fab icon='twitter' size='md' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: 'white' }}>
                <MDBIcon fab icon='google' size='md' />
              </MDBBtn>

              <MDBBtn
                tag='a'
                color='none'
                className='mx-3'
                style={{ color: 'white' }}>
                <MDBIcon fab icon='linkedin-in' size='md' />
              </MDBBtn>
            </div>
          </div>
        </MDBContainer>
      )}
    </>
  );
};

export default Signin;
