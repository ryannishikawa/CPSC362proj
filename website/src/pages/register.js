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

import React, {useState} from 'react';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    //sends user to home page on submit
    const handleSubmit = async(e) => {
        e.preventDefault();
        // ]localStorage.setItem("user", JSON.stringify(input));

        // Attempt to send a register request to the Express server.
        try {
            const response = await axios.post('api/register', {email, password});
            console.log(response.data);             // Response from the server.

            navigate("/home");
        } catch (err) {
            console.error(err);
        }
    };

    //button
    function RegisterButton() {
        return(
            <button type='submit' className='Button'>Create Account</button>
        );
    }

    //form
    function RegisterForm() {
        return(
            <div className="Register-Form">
                <h1>Welcome</h1>
               <form onSubmit={handleSubmit}>
                    <input type="text" title="name" value={name} onChange={e => setName(e.target.value)} placeholder='first last' />
                    <input type="text" title="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
                    <input type="password" title="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
                   <RegisterButton />
                </form>
            </div>
        );
    }
    return <RegisterForm />
};

const RegisterPage = () => {
    return (
        <div className='Register-Background'>
            <Register />
        </div>
    );
};

export default RegisterPage;