//****************************************************************************************************************************
//Program name: "todo-list.jsx".  This program is the main part of our web app. Copyright (C)  *
//2024 Kyle Ho                                                                                                        *
//This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License  *
//version 3 as published by the Free Software Foundation.                                                                    *
//This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied         *
//warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.     *
//A copy of the GNU General Public License v3 is available here:  <https://www.gnu.org/licenses/>.                           *
//****************************************************************************************************************************


//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2=========3**
//
//Author information
//  Author names: Kyle Ho,
//  Author emails: kyleho@csu.fullerton.edu,
//  Course ID: CPSC362
//
//Program information
//  Program name: Task manager
//  Date of last update: February 19, 2024
//  Programming language(s): JavaScript, HTML, CSS
//  Files in this program: App.js, login.js, register.js, home.js, etc...
//
//  OS of the computer where the program was developed: Windows running WSL with Ubuntu 22.04.3 LTS
//  OS of the computer where the program was tested: Windows running WSL Ubuntu 22.04.3 LTS
//  Status: WIP
//
//References for this program
//  https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju
//  https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started
//
//Purpose
//  The main page for viewing tasks
//
//This file
//   File name: todo-list.jsx
//   Date of last update: February 19, 2024
//   Languages: JavaScript, HTML, CSS
//
//References for this file
//   https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started
//
//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2**
//
//
//
//
//===== Begin code area ================================================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { DateTimeFormat } from '../components/Time.jsx';
import { LoggedUser } from '../components/LoggedUser.jsx';
import { useAuth } from '../hooks/AuthProvider.js';

import coconut from '../assets/coconut.jpg'; // Import the image file

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {logoutAction} = useAuth();

  // Pull user data from storage before the page loads.
  useEffect(() => {
    const userData = localStorage.getItem('username');
    if(userData) {
      setUser(userData);
    }

    setLoading(false);
  }, []);

  // Delete user data and refresh the page.
  const handleLogout = async() => {
    await logoutAction();
    window.location.reload();
  }

  if(loading) {
    return <div>Loading...</div>
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
        { user ? (
          <button onClick={handleLogout} className='nav-link'>Log Out</button>
        ) : (
          <Link to='/login' className='nav-link'>Log In</Link>
        )}
      </nav>
      <p>We're still working on adding content to the homepage in addition to an about and settings page.</p>
      <img src={coconut} alt='coconut' style={{ width: '100%', height: 'auto' }} />{ }
    </div>
  );
};