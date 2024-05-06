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

// React imports
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Component imports
import { AuthBar } from '../components/AuthBar.jsx';
import { NavBar } from '../components/NavBar.jsx';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getAuth } from 'firebase/auth';

export default function Home() {

  const auth = getAuth(app);
  
  return (
    <div className='todoapp stack-large'>
      <AuthBar action={auth} />
      <h1>Welcome!</h1>
      <NavBar auth={auth} />
      <p>We're still working on adding content to the homepage in addition to an about and settings page.</p>
    </div>
  );
};