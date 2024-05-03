/**
 * @file register.js
 * @author Kyle Ho <kyleho@csu.fullerton.edu
 * @author Ryan Nishikawa <ryannishikawa48@csu.fullerton.edu>
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file controls the sign up process for a new user.
 * 
 * @see {@link: https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju} used as reference.
 * @see {@link: https://firebase.google.com/docs/auth} for Firebase Authentication docs
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */
import React from 'react';
import { Link } from 'react-router-dom';

import { DateTimeFormat } from '../components/Time.jsx';
import { LoggedUser } from '../components/LoggedUser.jsx';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getAuth, signOut } from 'firebase/auth';

export default function Home() {

  const auth = getAuth(app);

  // Sign out the user
  const handleLogout = async() => {
    await signOut(auth);
    window.location.reload();
  }

  
  return (
    <div className='todoapp stack-large'>
      <div className='container'>
        <div className='logged-user'><LoggedUser /></div>
        <div className='display-date'><DateTimeFormat /></div>
      </div>
      <h1>Welcome!</h1>
      <nav className='navbar'>
        <Link to='/tasks' className='nav-link'>Manage Tasks</Link>
        <Link to='/about' className='nav-link'>About</Link>
        <Link to='/settings' className='nav-link'>Settings</Link>
        { auth.currentUser ? (
          <button onClick={handleLogout} className='nav-link'>Log Out</button>
        ) : (
          <Link to='/login' className='nav-link'>Log In</Link>
        )}
      </nav>
      <p>We're still working on adding content to the homepage in addition to an about and settings page.</p>
    </div>
  );
};