import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import _ from 'lodash';
import { ClockLoader } from 'react-spinners';
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCardSubTitle,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from 'mdb-react-ui-kit';

const SinglePost = () => {
  const [onePost, setOnePost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // fetch one post
  useEffect(() => {
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const getOnePost = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_GET_ONE_POST_URL}/${id}`,
          config
        );
        setIsLoading(true);
        setOnePost(res.data.data);
        setIsLoading(false);
      } catch (err) {
        toast.error(err.response.data.message, {
          duration: 1000,
          position: 'bottom-left',
          className: 'bg-danger text-light',
        });
        navigate(`${state.isAuthenticated ? '/allposts' : '/'}`);
      }
    };
    getOnePost();

    return getOnePost;
  }, [id, navigate, state.isAuthenticated]);

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

  const handleNavigate = () => {
    navigate('/allposts');
  };

  // check if data is empty array or not
  if (_.isEmpty(onePost))
    return (
      <MDBContainer className='hstack justify-content-center mt-5 text-primary'>
        <ClockLoader color='#3b71ca' size={100} />
      </MDBContainer>
    );

  return (
    <>
      {isLoading ? (
        <MDBContainer className='hstack justify-content-center mt-5 text-primary'>
          <ClockLoader color='#3b71ca' size={100} />
        </MDBContainer>
      ) : (
        <MDBContainer className='mt-5'>
          <MDBCard shadow='5' background='secondary'>
            <MDBCardHeader>
              <MDBCardTitle className='text-capitalize'>
                {onePost.title}
              </MDBCardTitle>
              <MDBCardSubTitle>{onePost.postedBy.name}</MDBCardSubTitle>
            </MDBCardHeader>
            <MDBRow className=''>
              <MDBCol lg={12}>
                <MDBCardImage
                  src='https://placehold.co/1920x350'
                  className='img-fluid'
                />
              </MDBCol>
            </MDBRow>
            <MDBCardBody>
              <MDBCardSubTitle className='text-capitalize'>
                {onePost.body}
              </MDBCardSubTitle>
              <MDBListGroup flush='true' className=' mt-2'>
                {onePost?.comments.map((comment, i) => {
                  return (
                    <MDBListGroupItem key={i + 1}>
                      <MDBBadge pill>{`${comment.postedBy.name}`}</MDBBadge>
                      &nbsp;:&nbsp;
                      <MDBBadge
                        pill
                        color='light'
                        className='text-dark text-capitalize'>{`${comment.comment}`}</MDBBadge>
                    </MDBListGroupItem>
                  );
                })}
              </MDBListGroup>
              <MDBContainer
                tag={'div'}
                className='hstack justify-content-center mt-3'>
                <MDBBtn
                  tag={'button'}
                  rounded
                  rippleColor='light'
                  rippleCentered
                  rippleDuration={300}
                  rippleRadius={65}
                  type='button'
                  onClick={handleNavigate}>
                  Go Back
                </MDBBtn>
              </MDBContainer>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      )}
    </>
  );
};

export default SinglePost;
