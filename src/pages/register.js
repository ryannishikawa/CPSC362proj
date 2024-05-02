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
    const [authCheck, setAuthCheck] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    /**
     * For this effect, checks if the user is not authenticated. If they are not, navigate home.
     */
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigate('/');
            } else {
                setAuthCheck(true);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate, auth]);


    //sends user to home page on submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create account with Firebase Authentication
        try {

            // Ensure user is not already authenticated.
            if(auth.currentUser) {
                alert("You're already logged in.");
                navigate('/');
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
                displayName: name
            });
 
            const taskCollectionRef = collection(userDocRef, 'tasks');
            await setDoc(doc(taskCollectionRef), {
                description: `Welcome to our app, ${user.displayName}! Get started by adding tasks!`,
                completed: false,
                dueDate: Timestamp.now(),
                createDate: Timestamp.now()
            });

            localStorage.setItem('username', user.displayName);
            alert(`Welcome to our app ${user.displayName}!`);
            navigate('/');
            
        } catch (err) {
            alert(err.message);
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

    // Determine the status of authentication (return home if they are logged in).
    if(!authCheck) {
        return <div>Loading...</div>
    }

    // Returns the register form component here.
    return (
        <div className='todoapp stack-large'>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" title="name" value={name} onChange={e => setName(e.target.value)} placeholder='first last' />
                <input type="text" title="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='you@email.domain' />
                <input type="password" title="password" value={pass} onChange={e => setPassword(e.target.value)} placeholder='password' />
                <button type='submit' className='register-button'>Create Account</button>
            </form>
            <div className='below-forms'>
                <p>OR</p>
                <button className='login-button' onClick={ToSignIn}>Log In</button>
                <button className='login-button' onClick={ToHome}>Go Home</button>
            </div>
        </div>
    );
}