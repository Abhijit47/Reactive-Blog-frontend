import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HashLoader } from 'react-spinners';
import _ from 'lodash';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBTypography,
} from 'mdb-react-ui-kit';
import { AuthContext } from '../../App';

const NewPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(AuthContext);
  let titleRef = useRef('');
  let contentRef = useRef('');

  const navigate = useNavigate();

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
    }
  }, [state, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      _.isEmpty(titleRef.current.value) ||
      _.isEmpty(contentRef.current.value)
    ) {
      return toast.error('Please add some content', {
        duration: 1200,
        position: 'top-center',
        className: 'bg-danger text-light',
      });
    }

    // create a post obj
    const post = {
      title: titleRef.current.value,
      body: contentRef.current.value,
    };

    // define a config
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    // make an axios post request
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_CREATE_ONE_POST_URL}`,
        post,
        config
      );
      // check if post is created or not
      if (res.status === 201) {
        titleRef = '';
        contentRef = '';
        toast.success(res.data.message, {
          duration: 1200,
          position: 'top-center',
          className: 'bg-success text-light',
        });
        setIsLoading(false);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        duration: 1200,
        position: 'top-center',
        className: 'bg-danger text-light',
      });
      titleRef = '';
      contentRef = '';
      navigate('/newpost');
    }
  };

  return (
    <>
      {isLoading ? (
        <MDBContainer className='hstack justify-content-center mt-5 text-primary'>
          <HashLoader color='#3b71ca' />
        </MDBContainer>
      ) : (
        <MDBContainer
          fluid
          style={{ backgroundColor: '#54b4d3' }}
          className='bg-gradient'>
          <MDBRow className='d-flex justify-content-center align-items-center'>
            <MDBCol lg='8' className='my-5'>
              <MDBTypography
                variant='h1'
                className='text-white mb-4 text-center'>
                Create your new post
              </MDBTypography>

              <form onSubmit={handleSubmit}>
                <MDBCard>
                  <MDBCardBody className='px-4'>
                    <MDBRow className='align-items-center pt-4 pb-3'>
                      <MDBCol md='3' className=''>
                        <h6 className='mb-2'>Title</h6>
                      </MDBCol>

                      <MDBCol md='9' className=''>
                        <MDBInput
                          label='Title'
                          size='lg'
                          name='title'
                          id='text'
                          type='text'
                          minLength={5}
                          ref={titleRef}
                        />
                      </MDBCol>
                    </MDBRow>

                    <hr className='mx-n3' />

                    <MDBRow className='align-items-center pt-4 pb-3'>
                      <MDBCol md='3' className=''>
                        <h6 className='mb-2'>Content</h6>
                      </MDBCol>

                      <MDBCol md='9' className=''>
                        <MDBTextArea
                          label='Content'
                          id='content'
                          name='content'
                          minLength={5}
                          maxLength={1024}
                          rows={3}
                          inputRef={contentRef}
                        />
                      </MDBCol>
                    </MDBRow>

                    <hr className='mx-n3' />

                    <MDBContainer className='hstack justify-content-center'>
                      <MDBBtn className='my-4' size='md' type='submit' rounded>
                        Create post
                      </MDBBtn>
                    </MDBContainer>
                  </MDBCardBody>
                </MDBCard>
              </form>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}
    </>
  );
};

export default NewPost;
