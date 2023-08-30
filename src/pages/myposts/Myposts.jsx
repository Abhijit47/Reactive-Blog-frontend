import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { AuthContext } from '../../App';
import { toast } from 'react-hot-toast';
import { HashLoader } from 'react-spinners';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
  MDBCardSubTitle,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBTypography,
} from 'mdb-react-ui-kit';

const Myposts = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(AuthContext);

  // fecth current user posts
  useEffect(() => {
    const API_URL = `${process.env.REACT_APP_MY_POST_URL}`;

    let config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(API_URL, config);
        setIsLoading(true);
        setData(res.data.data);
        setIsLoading(false);
      } catch (err) {
        toast.error(err.response.data.message, {
          duration: 2500,
          className: 'bg-danger text-light',
          position: 'bottom-right',
        });
      }
    };
    getUserData();

    return getUserData;
  }, []);

  // hold the current user state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    // console.log({ user, token });
    if (user !== null && token !== null && !state.isAuthenticated) {
      // dispacth and action to set the user data in state
      dispatch({
        type: 'USER',
        payload: { id: user.id, name: user.name, token: token },
      });
    }
  }, [state, dispatch]);

  return (
    <>
      {isLoading ? (
        <MDBContainer className='hstack justify-content-center mt-5 text-primary'>
          <HashLoader color='#3b71ca' />
        </MDBContainer>
      ) : (
        <>
          {_.isEmpty(data) ? (
            <MDBContainer className='vstack align-items-center mt-5 text-primary'>
              <MDBTypography variant='h2'>
                No posts available at this moment!
              </MDBTypography>
              <MDBTypography tag={'p'}>
                Please create your own post!!!
                <small className='d-block text-center text-capitalize mt-4'>
                  <Link to={'/newpost'} className='btn btn-small'>
                    create post
                  </Link>
                </small>
              </MDBTypography>
            </MDBContainer>
          ) : (
            <MDBRow className='gx-0 p-3 gap-lg-2 gap-md-3 gap-3 justify-content-center'>
              {data?.reverse().map((post, i) => {
                return (
                  <MDBCol lg={5} md={8} sm={10} className='col-12' key={i + 1}>
                    <MDBCard shadow='5' alignment='center' className='m-auto'>
                      <MDBCardHeader>Featured</MDBCardHeader>
                      <MDBCardBody>
                        <MDBCardTitle className='text-capitalize'>
                          {post.title}
                        </MDBCardTitle>
                        <MDBCardText className='text-capitalize lh-base'>
                          {post.body}
                        </MDBCardText>
                        <MDBBtn href='#'>See more</MDBBtn>
                      </MDBCardBody>
                      <MDBCardSubTitle>{post.postedBy.name}</MDBCardSubTitle>
                      <MDBCardFooter className='text-muted border border-1 border-top  border-primary'>
                        {new Date(post.created_At).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </MDBCardFooter>
                    </MDBCard>
                  </MDBCol>
                );
              })}
            </MDBRow>
          )}
        </>
      )}
    </>
  );
};

export default Myposts;
