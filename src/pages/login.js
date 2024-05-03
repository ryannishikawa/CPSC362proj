/**
 * @file login.js
 * @author Ryan Nishikawa <ryannishikawa48@csu.fullerton.edu>
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file controls the log in process for a user.
 * 
 * @see {@link: https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju} used as reference.
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {

    // Input field data
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');


    // Authentication checking and navigation
    const auth = getAuth();
    const navigate = useNavigate();

    /**
     * For this effect, checks if the user is authenticated. If they are, navigate home.
     * Authenticated users do not need to be at the login page.
     */
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigate('/');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate, auth]);


    /**
     * When handling a submit, checks if the email and password fields are valid then proceeds to log in.
     * @param {Event} e a submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email !== "" && pass !== "") {

            try {
                await signInWithEmailAndPassword(auth, email, pass);
                console.log('User signed in successfully!');
                alert(`Welcome ${auth.currentUser.displayName}! Signing you in...`);
                navigate('/');
            } catch (err) {
                console.log('Unable to sign in user: ' + err);
                alert(`Could not log in: ${err}`);
            }
        }

        console.log('Invalid field input')
        alert("Please provide a valid input.");
    }

    /**
     * Navigates to sign up page.
     * @param {Event} e An event
     */
    const ToSignupPage = (e) => {
        e.preventDefault();
        navigate("/register");
    };

    /**
     * Navigates to home page.
     * @param {Event} e An event
     */
    const ToHome = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className='todoapp stack-large'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="email address" value={email} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
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