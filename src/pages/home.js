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
      <AuthBar />
      <h1>Welcome!</h1>
      <NavBar auth={auth} />
      <h3>About</h3>
      <div>
        <p>This is a web application built with React that lets you keep track of basic tasks on your desktop and on a phone. Firebase is used for our backend.</p>
        <p>This is a project for CPSC 362 at Cal State Fullerton.</p>
      </div>
      <h3>Features</h3>
      <div>
        <p>This is a simple task management app. Currently, you can</p>
        <p>* Create, edit, and delete tasks.</p>
        <p>* Set due dates for your tasks.</p>
        <p>* Create a free account to store your tasks.</p>
      </div>
      <h3>GitHub</h3>
      <div>The source code can be found <a href='https://github.com/ryannishikawa/CPSC362proj'>here</a>!</div>
    </div>
  );
};