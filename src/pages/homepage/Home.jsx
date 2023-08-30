import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import _ from 'lodash';
import { RiseLoader } from 'react-spinners';
import { formatTimeAgo } from '../../utils/DateFunction';
import { AuthContext } from '../../App';
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRipple,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import { useContext } from 'react';

const Home = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(AuthContext);

  // fetch the api data
  useEffect(() => {
    const API_URL = `${process.env.REACT_APP_HOME_URL}`;
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(API_URL);
        setIsLoading(true);
        setData(res.data.data);
        setIsLoading(false);
      } catch (err) {
        toast.error(err.response.data.message, {
          duration: 1000,
          position: 'bottom-left',
          className: 'bg-danger text-light',
        });
      }
    };
    getData();
    return getData;
  }, []);

  // hold the current user state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user !== null && token !== null && !state.isAuthenticated) {
      // dispacth and action to set the user data in state
      dispatch({
        type: 'USER',
        payload: { id: user.id, name: user.name, token: token },
      });
      // navigate('/allposts');
    } else {
      // dispatch({ type: 'LOGOUT' });
      // navigate('/');
    }
  }, [state.isAuthenticated, dispatch]);

  return (
    <>
      {isLoading ? (
        <MDBContainer
          tag={'div'}
          className='hstack justify-content-center mt-5'>
          <RiseLoader margin={10} color='#3b71ca' />
        </MDBContainer>
      ) : (
        <MDBContainer tag={'div'} fluid className='p-3 mt-1 gx-0'>
          {/* search bar */}
          <MDBRow tag={'div'} className='justify-content-center py-4 gx-0'>
            <MDBCol
              tag={'div'}
              lg={6}
              md={6}
              sm={11}
              className='col-12 shadow-4-strong'>
              <MDBInput
                label='Search post'
                id='search'
                name='search'
                type='search'
                className='form-control'
                placeholder='Type query'
                aria-label='Search'
                onChange={(e) => setQuery(e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          {/* all posts */}
          <MDBRow
            tag={'div'}
            className='gap-lg-2 gap-md-3 gap-sm-2 gap-3 gx-0 justify-content-center'>
            {data
              .filter((post) => {
                return (
                  _.isEmpty(query) ||
                  post.postedBy.name
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                  post.title.toLowerCase().includes(query.toLowerCase())
                );
              })
              ?.reverse()
              .map((post, i) => {
                return (
                  <MDBCol
                    lg={11}
                    md={11}
                    sm={9}
                    className='col-12 mb-4'
                    key={i + 1}>
                    <MDBCard tag={'div'} border='secondary' shadow='4'>
                      <MDBRow tag={'div'} className='g-0'>
                        {/* card image */}
                        <MDBCol
                          tag={'div'}
                          lg={2}
                          md={4}
                          sm={12}
                          className='col-12'>
                          <MDBRipple
                            rippleTag='a'
                            rippleCentered
                            rippleDuration={1200}
                            rippleColor='light'
                            className='h-100'>
                            <div className='bg-image hover-overlay hover-zoom h-100'>
                              <MDBCardImage
                                src='https://placehold.co/500x600'
                                alt={`${post.title}`}
                                overlay
                                fluid
                                className='h-100 w-100 object-fit-cover object-cover shadow-3-strong'
                              />
                              <div
                                className='mask overlay'
                                style={{
                                  backgroundColor: 'rgba(57, 192, 237, 0.2)',
                                }}></div>
                            </div>
                          </MDBRipple>
                        </MDBCol>
                        <MDBCol
                          tag={'div'}
                          lg={10}
                          md={8}
                          sm={12}
                          className='col-12'>
                          <MDBCardBody tag={'div'}>
                            <MDBCardTitle
                              tag={'h5'}
                              className='text-capitalize user-select-auto'>
                              {_.size(post.title) > 20
                                ? `${post.title.substr(0, 20)} ...`
                                : post.title}
                            </MDBCardTitle>
                            <MDBCardText
                              tag={'p'}
                              className='text-capitalize user-select-auto'>
                              {_.size(post.body) > 230 ? (
                                <>
                                  {`${post.body.substr(0, 230)} ...`}
                                  <Link to={'/signin'}>
                                    <small className='text-capitalize'>
                                      see more
                                    </small>
                                  </Link>
                                </>
                              ) : (
                                post.body
                              )}
                            </MDBCardText>
                            <hr />

                            {/* Add comment functionality */}
                            <MDBRow
                              tag={'div'}
                              className='gx-0 justify-content-center p-1'>
                              {/* see comments */}
                              <MDBCol
                                tag={'div'}
                                lg={3}
                                md={9}
                                sm={11}
                                className='text-center col-12 mb-lg-0 mb-3'>
                                <MDBContainer
                                  tag={'div'}
                                  className='vstack align-items-center'>
                                  <MDBTypography
                                    tag={'p'}
                                    className='mt-2 mb-0'>
                                    Comments
                                  </MDBTypography>
                                  <div className='hstack justify-content-center gap-1'>
                                    <MDBBadge tag={'small'} pill>
                                      {!_.isEmpty(post.comments)
                                        ? post.comments
                                            .slice(-1)[0]
                                            .postedBy.name.split(' ')[0]
                                        : ''}
                                    </MDBBadge>
                                    <small className='text-capitalize'>
                                      {!_.isEmpty(post.comments) ? (
                                        <>
                                          {_.size(
                                            post.comments.slice(-1)[0].comment
                                          ) > 10
                                            ? `${post.comments
                                                .slice(-1)[0]
                                                .comment.substr(0, 10)} ...`
                                            : post.comments.slice(-1)[0]
                                                .comment}
                                        </>
                                      ) : (
                                        'Not yet'
                                      )}
                                    </small>
                                  </div>
                                  <Link to={'/signin'}>
                                    <small className='text-capitalize'>
                                      See all comments
                                    </small>
                                  </Link>
                                </MDBContainer>
                              </MDBCol>
                              {/* comment input */}
                            </MDBRow>
                          </MDBCardBody>

                          {/* card footer */}
                          <MDBCardFooter>
                            <MDBContainer className='hstack justify-content-between'>
                              <MDBCardSubTitle>
                                <small className='text-muted text-capitalize'>
                                  {post.postedBy === null
                                    ? ''
                                    : post.postedBy.name}
                                </small>
                              </MDBCardSubTitle>
                              <MDBCardSubTitle>
                                <small className='text-muted'>
                                  {formatTimeAgo(new Date(post.created_At))}
                                </small>
                              </MDBCardSubTitle>
                            </MDBContainer>
                          </MDBCardFooter>
                        </MDBCol>
                      </MDBRow>
                    </MDBCard>
                  </MDBCol>
                );
              })}
          </MDBRow>
        </MDBContainer>
      )}
    </>
  );
};

export default Home;
