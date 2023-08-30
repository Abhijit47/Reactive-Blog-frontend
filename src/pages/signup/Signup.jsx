import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import RegisterSVG from '../../components/svgs/RegisterSVG';
import { toast } from 'react-hot-toast';
import { DotLoader } from 'react-spinners';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
  MDBTypography,
} from 'mdb-react-ui-kit';

const Signup = () => {
  const [isChecked, setIsCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const confPasswordRef = useRef('');
  const navigate = useNavigate();

  const handleCheck = () => {
    if (!isChecked) {
      setIsCheck(true);
    } else {
      setIsCheck(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!_.isEqual(passwordRef.current.value, confPasswordRef.current.value)) {
      return toast.error("Passwords are doesn't match", {
        duration: 1500,
        position: 'top-center',
        className: 'bg-danger text-light',
      });
    }

    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // axios call to send data to backend
    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_SIGNUP_URL}`, data);

      if (res.status === 201) {
        toast.success(res.data.message, {
          duration: 1500,
          position: 'top-center',
          className: 'bg-success text-light',
        });
        navigate('/signin');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        duration: 1500,
        position: 'bottom-right',
        className: 'bg-danger text-light',
      });
      navigate('/signup');
    }
  };

  return (
    <>
      {isLoading ? (
        <MDBContainer
          tag={'div'}
          className='hstack justify-content-center mt-5'>
          <DotLoader margin={10} color='#3b71ca' />
        </MDBContainer>
      ) : (
        <MDBContainer fluid>
          <MDBCard
            className='text-black m-1 mt-3'
            style={{ borderRadius: '25px' }}>
            <MDBCardBody className='shadow-4-strong'>
              <MDBRow className='justify-content-center'>
                <MDBCol md='10' lg='6' className='order-2 order-lg-1'>
                  <MDBTypography className='text-center h1 fw-bold mb-3 mx-1 mx-md-4 mt-4'>
                    Sign up
                  </MDBTypography>

                  <MDBRow className='justify-content-center'>
                    <MDBCol lg={10} md={10} sm={11} className='col-12'>
                      <form onSubmit={handleSubmit} className='p-2'>
                        <MDBContainer className='gx-0 hstack mb-4'>
                          <MDBIcon fas icon='user me-3' size='lg' />
                          <MDBInput
                            label='Your Name'
                            id='name'
                            type='text'
                            name='name'
                            placeholder='Enter your name'
                            autoComplete='on'
                            ref={nameRef}
                          />
                        </MDBContainer>

                        <MDBContainer className='gx-0 hstack mb-4'>
                          <MDBIcon fas icon='envelope me-3' size='lg' />
                          <MDBInput
                            label='Your Email'
                            id='email'
                            type='email'
                            name='email'
                            placeholder='Enter your email'
                            autoComplete='on'
                            ref={emailRef}
                          />
                        </MDBContainer>

                        <MDBContainer className='gx-0 hstack mb-4'>
                          <MDBIcon fas icon='lock me-3' size='lg' />
                          <MDBInput
                            label='Password'
                            id='password'
                            type='password'
                            name='password'
                            placeholder='Enter your password'
                            ref={passwordRef}
                          />
                        </MDBContainer>

                        <MDBContainer className='gx-0 hstack mb-4'>
                          <MDBIcon fas icon='key me-3' size='lg' />
                          <MDBInput
                            label='Repeat your password'
                            id='confpassword'
                            type='password'
                            name='cpassword'
                            placeholder='Enter your confirm password'
                            ref={confPasswordRef}
                          />
                        </MDBContainer>

                        <MDBContainer className='gx-0 mb-4'>
                          <MDBCheckbox
                            name='checkbox'
                            value=''
                            id='checkbox'
                            label='Subscribe to our newsletter'
                            defaultChecked={isChecked}
                            onClick={handleCheck}
                          />
                        </MDBContainer>

                        <MDBContainer className='hstack justify-content-center'>
                          {!isChecked ? (
                            <MDBBtn className='mb-4' size='md' disabled>
                              Register
                            </MDBBtn>
                          ) : (
                            <MDBBtn className='mb-4' size='md'>
                              Register
                            </MDBBtn>
                          )}
                        </MDBContainer>
                      </form>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>

                <MDBCol
                  md='10'
                  lg='6'
                  className='order-1 order-lg-2 d-flex align-items-center'>
                  <RegisterSVG />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      )}
    </>
  );
};

export default Signup;
