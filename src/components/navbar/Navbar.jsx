import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import ReactIcon from '../svgs/ReactIcon';
import { AuthContext } from '../../App';
import {
  MDBContainer,
  MDBCollapse,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBadge,
} from 'mdb-react-ui-kit';

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const { state, dispatch } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem('user'));

  // asigning navigate variable
  const navigate = useNavigate();
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    // console.log({ user, token });
    if (user !== null && token !== null && !state.isAuthenticated) {
      // dispacth and action to set the user data in state
      dispatch({
        type: 'USER',
        payload: { id: user.id, name: user.name, token: token },
      });
    }
  }, [state, dispatch, user]);

  // define a function to handle logout
  const handleLogout = () => {
    dispatch({
      type: 'LOGOUT',
    });
    navigate('/login');
  };

  // define a function to render navlist items.
  const renderListItems = () => {
    if (state.isAuthenticated) {
      return (
        <>
          <MDBNavbarItem className='text-light text-capitalize'>
            <MDBBadge color='dark' tag={'span'}>
              {!_.isEmpty(user) ? user.name.split(' ')[0] : ''}
              {/* {user ? user.name : ''} */}
            </MDBBadge>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link to={'/dashboard'} className='text-light'>
              Dashboard
            </Link>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link to={'/myposts'} className='text-light'>
              My posts
            </Link>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link to={'/newpost'} className='text-light'>
              Create new post
            </Link>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link
              to={'/'}
              className='text-light btn btn-danger btn-sm'
              onClick={handleLogout}>
              Logout
            </Link>
          </MDBNavbarItem>
        </>
      );
    } else {
      return (
        <>
          <MDBNavbarItem>
            <Link to={'/'} className='text-light'>
              Home
            </Link>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link to={'/signup'} className='text-light'>
              Register
            </Link>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <Link to={'/signin'} className='text-light'>
              Login
            </Link>
          </MDBNavbarItem>
        </>
      );
    }
  };

  return (
    <>
      <MDBNavbar expand='lg' dark bgColor='primary' sticky>
        <MDBContainer fluid>
          <Link
            to={state.isAuthenticated ? '/allposts' : '/'}
            className='text-light fw-bold fs-3 hstack gap-2'>
            <ReactIcon />
            Reactive Blog
          </Link>

          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNav(!showNav)}>
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse show={showNav} navbar id='navbarColor02'>
            <MDBNavbarNav className='p-3 p-lg-0 gap-3 hstack justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center flex-lg-nowrap flex-wrap'>
              {renderListItems()}
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
};

export default Navbar;
