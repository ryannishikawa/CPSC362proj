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

import '../css/login.css';
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
    return(
        <button type='submit' class='Button'>Login</button>
    );
}

function LoginForm() {
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/users', {email, pass});
            alert(`Welcome back ${response.data.name}! Logging you in...`);

            navigate('/home');
        } catch (err) {

            alert(`Incorrect email and/or password`);
        }
    }

    return(
        <div class="Login-Form">
            <h1>Welcome</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="email address" value={email} onChange={e => setEmail(e.target.value)}placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <LoginButton />
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className='Login-Background'>
            <LoginForm />
        </div>
    );
}

