/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { sendEmailVerification, EmailAuthProvider } from 'firebase/auth';

export default function SettingsPage() {

    const [loading, isLoading] = useState(true);                    // Set loading state for database queries to true
    const [dName, setdName] = useState(null);                       // The display name of the user
    const [email, setEmail] = useState(null);                       // The associated email
    const [pass, setPass] = useState(null);                         // The password to push if changing the password
    const [dNameHold, setdNameHold] = useState(null);               // Holds the previous dname when editing
    const [emailNameHold, setEmailHold] = useState(null);           // Holds the previous email when editing
    const [numTasks, setNumTasks] = useState(null);                 // The number of tasks saved by the user
    const [isEditingName, setIsEditingName] = useState(false);      // The state of name editing
    const [isEditingEmail, setIsEditingEmail] = useState(false);    // The state of email editing
    const [isEditingPass, setIsEditingPass] = useState(false);      // The state of password editing

    // Prevent email verification resend abuse. One minute is standard to send again.
    const [lastSentTime, setLastSentTime] = useState(localStorage.getItem('lastSentTime') ?
        parseInt(localStorage.getItem('lastSentTime'), 10)
        :
        null
    );

    const navigate = useNavigate();                     // Use navigate features
    const auth = getAuth(app);                          // Use Firebase Authentication
    const db = getFirestore(app);                       // Use Firebase Firestore

    const userId = localStorage.getItem('uid');         // Get the userID
    const user = auth.currentUser;

    // Fetches database information
    const fetchData = async () => {
        if (userId) {
            const userDocRef = doc(db, 'user-data', userId); // Pull the user
            const tasksCollectionRef = collection(userDocRef, 'tasks'); // Pull the tasks subcollection on user.

            try {
                // Retrieve and store the username and email from Firebase Authentication
                setdName(user.displayName || "");
                setEmail(user.email || "");
            } catch (error) {
                console.log('Error retrieving username:', error);
            }

            try {
                // Retrieve size of the collection of tasks
                const querySnapshot = await getDocs(tasksCollectionRef);
                setNumTasks(querySnapshot.size);
            } catch (error) {
                console.log('Error retrieving tasks:', error);
            }
        }

        isLoading(false);
    };

    /**
     * Before the page loads, ensure all data is fetched before loading the window.
     */
    useEffect(() => {

        fetchData();

        const handleFocus = () => {
            (async () => {
                await fetchData();
            })();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    /**
     * For this effect, check if a minute has elapsed for verification email before sending again. 
     */
    useEffect(() => {

        const timer = setInterval(() => {
          if (lastSentTime && Date.now() - lastSentTime >= 60000) {

            setLastSentTime(null);
            localStorage.removeItem('lastSentTime');
          }
        }, 1000); // Check every second
    
        return () => {
          clearInterval(timer);
        };
      }, [lastSentTime]);

    // Handle Account Name changing below
    const handleAccountNameChange = () => {
        setdNameHold(dName);
        setIsEditingName(!isEditingName);

        const inputElement = document.querySelector('input[type="text"]');
        if (inputElement) {
            inputElement.value = null;
        }
    }


    const handleAccountNameChangeCancel = () => {
        setdName(dNameHold);

        const inputElement = document.querySelector('input[type="text"]');
        if (inputElement) {
            inputElement.value = dNameHold;
        }

        handleAccountNameChange();
    }

    // Handle Account Email changing below
    const handleAccountEmailChange = () => {
        setEmailHold(email);
        setIsEditingEmail(!isEditingEmail);

        if(!isEditingEmail) {
            setEmail('');
        } else {
            setEmail(emailNameHold);
        }
    }

    const handleAccountEmailChangeCancel = () => {
        setEmail(emailNameHold);

        const inputElement = document.querySelector('input[type="text"]');
        if (inputElement) {
            inputElement.value = emailNameHold;
        }

        handleAccountEmailChange();
    }

    // Handle Account Password changing below
    const handleAccountPassChange = () => {
        setIsEditingPass(!isEditingPass);
    }


    const handleAccountPassChangeCancel = () => {
        const inputElement = document.querySelector('input[type="password"]');
        if (inputElement) {
            inputElement.value = "";
        }

        handleAccountPassChange();
    }

    const handleTaskDeletion = () => {
        // WIP
    }

    // =============================
    //  EMAIL VERIFICATION HANDLERS
    // =============================

    /**
     * This sends an email to the specified user so they can verify their account
     */
    const sendEmailVerificationToEmail = async () => {
        try {

            await sendEmailVerification(auth.currentUser);              // Send email verification to the new email

            setLastSentTime(Date.now());
            localStorage.setItem('lastSentTime', Date.now().toString());

            console.log('Verification email sent to', email);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };

    /**
     * The pushNewEmail function does two things:
     * 1) When a verified user requests to change their email, sends them an email to verify and updates the 'save' button to 'verify'
     * 2) When the verified user successfully verifies their new email, pushes new email to their Firebase Authentication and reverts
     *    to the 'Change' button again.
     */
    const pushNewEmail = async () => {

        // EMAIL
    }

    const pushNewName = async () => {

        updateProfile(user, {
            displayName: dName
        }).then(() => {
            //success!
        }).catch((err) => {
            // err!
        })
    }

    const pushNewPass = () => {

    }

    // Goes home
    const ToHome = (e) => {
        e.preventDefault();
        navigate("/");
    };



    // Handle page rendering here
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='todoapp stack-large'>
            <h1>Settings</h1>
            <h2>Account</h2>

            <p>Email Address
                {isEditingEmail ? (
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                    <input type="text" value={email} readOnly />
                )}
            </p>
            {!user.emailVerified && <p>Please check your email to verify your email.</p>}
            {user.emailVerified && <p>Email verified</p>}
            {isEditingEmail && user.emailVerified && <p>Enter password to confirm changes.</p>}
            {isEditingEmail && user.emailVerified && <input type="password" id='confirmPassBox' onChange={(e) => setPass(e.target.value)} />}
            <div>
                {user.emailVerified && <button className='login-button' onClick={isEditingEmail ? handleAccountEmailChangeCancel : handleAccountEmailChange} disabled={loading && !isEditingEmail}>
                    {
                        isEditingEmail ? 'Cancel' : 'Change'
                    }
                </button>
                }
                {user.emailVerified && isEditingEmail && <button className='login-button' onClick={pushNewEmail}>Save</button>}
                {!user.emailVerified && <button className='login-button' onClick={sendEmailVerificationToEmail} disabled={lastSentTime && Date.now() - lastSentTime < 60000} >Resend Email</button>}
            </div>

            <p>Display Name
                {isEditingName ? (
                    <input type="text" value={dName} onChange={(e) => setdName(e.target.value)} />
                ) : (
                    <input type="text" value={dName} readOnly />
                )}
            </p>
            <div>
                <button className='login-button' onClick={isEditingName ? handleAccountNameChangeCancel : handleAccountNameChange}>
                    {
                        isEditingName ? 'Cancel' : 'Change'
                    }
                </button>
                {isEditingName && <button className='login-button'>Save</button>}
            </div>

            <p>Password
                {isEditingPass ? (
                    <input type="password" onChange={(e) => setPass(e.target.value)} />
                ) : (
                    <input type="text" value="" readOnly />
                )}
            </p>
            <div>
                <button className='login-button' onClick={isEditingPass ? handleAccountPassChangeCancel : handleAccountPassChange}>
                    {
                        isEditingPass ? 'Cancel' : 'Change'
                    }
                </button>
                {isEditingPass && <button className='login-button'>Save</button>}
            </div>

            <p>Delete Account</p>
            <div><button className='login-button'>Delete</button></div>
            <h2>Task Management</h2>
            <p>Tasks Stored: {numTasks} </p>
            <div><button className='login-button'>Clear Tasks</button></div>
            <br />
            <div><button className='login-button' onClick={ToHome}>Go Home</button></div>
        </div>
    );
}