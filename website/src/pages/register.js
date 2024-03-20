//****************************************************************************************************************************
//Program name: "register.js".  This program controls the sign up page of our web app. Copyright (C)  *
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
//  Allow users to create an account for the website
//
//This file
//   File name: register.js
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/AuthProvider';

function ToLogin() {

    const navigate = useNavigate();

    // Take to login page if user already has an account.
    const ToSignIn = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    // Component returned here.
    return (
        <p>
            Already have an account? <button type='submit' onClick={ToSignIn}><b><i><u>Sign in here!</u></i></b></button>
        </p>
    );
}

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');

    const auth = useAuth();

    //sends user to home page on submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Attempt to send a register request to the Express server.
        try {

            // Create the new user
            const regRes = await axios.post('http://localhost:5000/api/users/register', { name, email, pass });

            // Find the new user and get their UID
            const userObjRes = await axios.post('http://localhost:5000/api/users/find', { email, pass });
            const uid = userObjRes.data.user.uid;

            // Add the welcome task
            const description = 'Welcome to our app! Time to get productive and start adding tasks!';
            const newTaskRes = await axios.post('http://localhost:5000/api/tasks/add', { uid, description });

            // Login
            auth.loginAction(email, pass);

        } catch (err) {
            alert(err);
        }
    };

    // Returns the register form component here.
    return (
        <div>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="name" value={name} onChange={e => setName(e.target.value)} placeholder='first last' />
                <input type="text" title="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <button type='submit' className='register-button'>Create Account</button>
                <ToLogin />
            </form>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className='todoapp stack-large'>
            <RegisterForm />
        </div>
    );
}