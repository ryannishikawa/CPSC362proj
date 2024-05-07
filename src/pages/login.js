/**
 * @file login.js
 * @author Ryan Nishikawa <ryannishikawa48@csu.fullerton.edu>
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file controls the log in process for a user.
 * 
 * @see {@link: https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju} used as reference.
 * @see {@link: https://www.npmjs.com/package/reactjs-popup} for more about the popup component.
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
    const [message, setMessage] = useState('');
    const [disabled, setDisabled] = useState(false);


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
        setDisabled(true);
        e.preventDefault();
        setMessage('Signing in...');

        if (email !== "" && pass !== "") {

            try {
                await signInWithEmailAndPassword(auth, email, pass);
                console.log('User signed in successfully!');
                navigate('/');
            } catch (err) {
                console.log('Unable to sign in user: ' + err);
                setMessage(`${err}}`);
                setDisabled(false);
            }
        } else {
            console.log('Invalid field input')
            setMessage("Please provide a valid input.");
            setDisabled(false);
        }
    }

    /**
     * Navigates to sign up page.
     * @param {Event} e An event
     */
    const ToSignupPage = (e) => {
        setDisabled(true);
        e.preventDefault();
        navigate("/register");
    };

    /**
     * Navigates to home page.
     * @param {Event} e An event
     */
    const ToHome = (e) => {
        setDisabled(true);
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className='todoapp stack-large'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="email address" value={email} disabled={disabled} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} disabled={disabled} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <button type='submit' className='action-button'>Login</button>
            </form>
            <div>{message}</div>
            <div className='below-forms'>
                <p> OR </p>
                <button className='confirm-button' disabled={disabled} onClick={ToSignupPage}>Register for an Account</button>
                <button className='action-button' disabled={disabled} onClick={ToHome}>Go Home</button>
            </div>
        </div>
    );
}