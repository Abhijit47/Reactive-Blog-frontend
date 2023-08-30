import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar/Navbar';
import Error from './components/error/Error';
import Home from './pages/homepage/Home';
import Signup from './pages/signup/Signup';
import Signin from './pages/signin/Signin';
import Dashboard from './pages/dashboard/Dashboard';
import AllPosts from './pages/allposts/AllPosts';
import Myposts from './pages/myposts/Myposts';
import SinglePost from './pages/singlepost/SinglePost';
import NewPost from './pages/createnewpost/NewPost';

// Create a user Auth context
export const AuthContext = createContext(); // added this

// define the user initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// create a reducer function for user
const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: action.payload._id,
          name: action.payload.name,
        })
      );
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'USER':
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: action.payload.id,
          name: action.payload.name,
        })
      );
      localStorage.setItem('token', action.payload.token);

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:

      return state;
  }
};

const App = () => {

  // use the reducer to manage state
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // provide the state and dispatch function to component using UserContext
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routes>
          {/* Unprotected routes */}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          {/* Protected routes */}
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/allposts' element={<AllPosts />} />
          <Route path='/myposts' element={<Myposts />} />
          <Route path='/allposts/:user/posts/:id' element={<SinglePost />} />
          <Route path='/newpost' element={<NewPost />} />
          {/* Error page */}
          <Route path='*' element={<Error />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthContext.Provider>);
};

export default App;