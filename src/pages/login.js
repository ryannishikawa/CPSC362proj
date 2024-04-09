//****************************************************************************************************************************
//Program name: "login.js".  This program controls the login page of our web app. Copyright (C)  *
//2024 Ryan Nishikawa                                                                                                        *
//This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License  *
//version 3 as published by the Free Software Foundation.                                                                    *
//This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied         *
//warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.     *
//A copy of the GNU General Public License v3 is available here:  <https://www.gnu.org/licenses/>.                           *
//****************************************************************************************************************************


//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2=========3**
//
//Author information
//  Author names: Ryan Nishikawa, 
//  Author emails: ryannishikawa48@csu.fullerton.edu, 
//  Course ID: CPSC362
//
//Program information
//  Program name: Task manager
//  Date of last update: February 15, 2024
//  Programming language(s): JavaScript, HTML, CSS
//  Files in this program: App.js, login.js, register.js, home.js, etc...
//  
//  OS of the computer where the program was developed: Ubuntu 22.04.3 LTS
//  OS of the computer where the program was tested: Ubuntu 22.04.3 LTS
//  Status: WIP
//
//References for this program
//  https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju
//
//Purpose
//  Allow users to login to an exiting account and access the app
//
//This file
//   File name: login.js
//   Date of last update: February 15, 2024
//   Languages: JavaScript, HTML, CSS
//
//References for this file
//   https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju
//
//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2**
//
//
//
//
//===== Begin code area ================================================================================================

import React, {useState} from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    
    // Input field data
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    

    // Create an auth for persistive sessions
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(email !== "" && pass !== "") {
            auth.loginAction(email, pass);
            return;
        }

        alert("Please provide a valid input.");
    }

    // Goes to signup page
    const ToSignupPage = (e) => {
        e.preventDefault();
        navigate("/register");
    };

    // Goes home
    const ToHome = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return(
        <div className='todoapp stack-large'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="email address" value={email} onChange={e => setEmail(e.target.value)}placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <button type='submit' className='login-button'>Login</button>
            </form>
            <div className='below-forms'>
                <p> OR </p>
                <button className='register-button' onClick={ToSignupPage}>Register for an Account</button>
                <button className='login-button' onClick={ToHome}>Go Home</button>
            </div>
        </div>
    );
}