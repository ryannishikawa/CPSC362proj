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

const Register = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    //to store user info? idk how to do that yet
    //sends user to home page on submit
    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify(input));
        navigate("/home");
    };

    const ToSignIn = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    //button
    function RegisterButton() {
        return(
            <button type='submit' class='Button'>Create Account</button>
        );
    }

    function ToLogin() {
        return(
            <p>
                Already have an account? <button type='submit' onClick={ToSignIn}><b><i><u>Sign in here!</u></i></b></button>
            </p>
        );
    }

    //form
    function RegisterForm() {
        return(
            <div className="Register-Form">
                <h1>Welcome</h1>
               <form onSubmit={handleSubmit}>
                    <input type="text" title="name" placeholder='first last' />
                    <input type="text" title="email address" placeholder='you@email.domain' />
                    <input type="password" title="password" placeholder='password' />
                   <RegisterButton />
                   <ToLogin />
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