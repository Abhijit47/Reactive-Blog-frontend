import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../App';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Dashboard = () => {
  const { state, dispatch } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('user'));

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
    }
  }, [state, dispatch]);

  return (
    <div className='vh-100' style={{ backgroundColor: '#9de2ff' }}>
      <MDBContainer fluid tag={'div'}>
        <MDBRow tag={'div'} className='justify-content-center'>
          <MDBCol tag={'div'} md={9} lg={8} xxl={5} xl={5} className='mt-5'>
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className='p-4'>
                <div className='d-flex text-black'>
                  <div className='flex-shrink-0'>
                    <MDBCardImage
                      style={{ width: '180px', borderRadius: '10px' }}
                      src='https://placehold.co/600x400'
                      alt='Generic placeholder image'
                      className='object-cover object-center h-100'
                      fluid
                    />
                  </div>
                  <div className='flex-grow-1 ms-3'>
                    <MDBCardTitle className='text-capitalize'>
                      {user ? user.name : ''}
                    </MDBCardTitle>
                    <MDBCardText>Senior Journalist</MDBCardText>

                    <div
                      className='d-flex justify-content-start rounded-3 p-2 mb-2'
                      style={{ backgroundColor: '#efefef' }}>
                      <div>
                        <p className='small text-muted mb-1'>Articles</p>
                        <p className='mb-0'>41</p>
                      </div>
                      <div className='px-3'>
                        <p className='small text-muted mb-1'>Followers</p>
                        <p className='mb-0'>976</p>
                      </div>
                      <div>
                        <p className='small text-muted mb-1'>Rating</p>
                        <p className='mb-0'>8.5</p>
                      </div>
                    </div>
                    <div className='d-flex pt-1'>
                      <MDBBtn outline className='me-1 flex-grow-1'>
                        Chat
                      </MDBBtn>
                      <MDBBtn className='flex-grow-1'>Follow</MDBBtn>
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Dashboard;
