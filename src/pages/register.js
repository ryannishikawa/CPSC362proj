/**
 * @file register.js
 * @author Ryan Nishikawa <ryannishikawa48@csu.fullerton.edu>
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file controls the sign up process for a new user.
 * 
 * @see {@link: https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju} used as reference.
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, Timestamp } from 'firebase/firestore';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [disabled, setDisabled] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    /**
     * For this effect, checks if the user is authenticated. If they are, navigate home.
     * Authenticated users do not need to be registering for a new account!
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


    //sends user to home page on submit
    const handleSubmit = async (e) => {
        setDisabled(true);
        e.preventDefault();

        // Create account with Firebase Authentication
        try {

            // Ensure user is not already authenticated.
            if(auth.currentUser) {
                navigate('/');
                return;
            }

            if(name.length <= 0) {
                setMessage('Please enter a display name.');
                setDisabled(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Update the user's display name to the name they set in registration
            await updateProfile(user, {
                displayName: name
            });

            // Add a welcome task upon account creation
            // Creates a new document from the user's ID in the user-data collection.
            // Also adds their username to the document as well.
            const userDocRef = doc(db, 'user-data', user.uid);
            await setDoc(userDocRef, {
                displayName: name,
                email: email,
                verified: false
            });
 
            const taskCollectionRef = collection(userDocRef, 'tasks');
            await setDoc(doc(taskCollectionRef), {
                description: `Welcome to our app, ${user.displayName}! Get started by adding tasks!`,
                completed: false,
                dueDate: Timestamp.now(),
                createDate: Timestamp.now()
            });

            setMessage(`Welcome to our app ${user.displayName}!`);
            navigate('/');
            
        } catch (err) {
            setMessage(err.message);
            setDisabled(false);
        }
    };

    // Goes to sign in page
    const ToSignIn = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    // Goes home
    const ToHome = (e) => {
        e.preventDefault();
        navigate("/");
    };

    // Returns the register form component here.
    return (
        <div className='todoapp stack-large'>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="name" value={name} disabled={disabled} onChange={e => setName(e.target.value)} placeholder='first last' />
                <input type="text" title="email" value={email} disabled={disabled} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} disabled={disabled} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <button type='submit' className='confirm-button'>Create Account</button>
            </form>
            <div>{message}</div>
            <div className='below-forms'>
                <p>OR</p>
                <button className='action-button' disabled={disabled} onClick={ToSignIn}>Log In</button>
                <button className='action-button' disabled={disabled} onClick={ToHome}>Go Home</button>
            </div>
        </div>
    );
}