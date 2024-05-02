/**
 * @file settings.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file handles all settings related information within the todoapp.
 * 
 * @see {@link: https://firebase.google.com/docs/auth} on Firebase Authentication
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification, updateEmail } from "firebase/auth";

export default function SettingsPage() {

    // Firebase essentials for this page
    const auth = getAuth(app);                          // Use Firebase Authentication
    const db = getFirestore(app);                       // Use Firebase Firestore
    const navigate = useNavigate();                     // Use Navigate features
    const user = auth.currentUser;                      // The current user scoped to the project

    // These variables relate to the state of the page components.
    const [loading, isLoading] = useState(true);                                                // Set loading state for database queries to true
    const [isEditingName, setIsEditingName] = useState(false);                                  // The state of name editing
    const [isEditingEmail, setIsEditingEmail] = useState(false);                                // The state of email editing
    const [isEditingPass, setIsEditingPass] = useState(false);                                  // The state of password editing

    const [displayNamePlaceholder, setDisplayNamePlaceholder] = useState(null);                 // The state of the display name input box
    const [emailPlaceholder, setEmailPlaceholder] = useState(null);                             // The state of the email address input box
    const [passPlaceholder, setPassPlaceholder] = useState(null);                               // The state of the password input box

    const [disabledButton, setDisabledButton] = useState(false);                                // The state of buttons when needing to perform async actions.
    const [lastSentTime, setLastSentTime] = useState(localStorage.getItem('lastSentTime') ?     // The delay of verification emails
        parseInt(localStorage.getItem('lastSentTime'), 10)
        :
        null
    );

    // These variable relate to the data that is pulled from Firestore
    // const [firestoredName, setFirestoredName] = useState(null);     // The display name of the user within Firestore.
    const [numTasks, setNumTasks] = useState(null);                 // The number of tasks saved by the user

    // These variables relate to the authentication of credentials.
    const [email, setEmail] = useState(null);                       // The current email
    const [pass, setPass] = useState(null);                         // The current password to handle reauthentication of credentials.
    const [passRepeat, setPassRepeat] = useState(null);             // Repeat the current pass for changing password.


    /**
     * Before the page loads, ensure all data is fetched before loading the window. Currently, it:
     * 
     * 1) pulls display name and current email from Authentication.
     * 2) pulls number of tasks from Firestore.
     * 
     * 3) Pushes current display name, email, and email verification status to associated uid in Firestore.
     */
    useEffect(() => {
        async function fetchAndSync() {

            // Proceed to do anything if the current user has a UID to work with. Otherwise, go to login.
            if (auth.currentUser.uid) {
                const userDocRef = doc(db, 'user-data', auth.currentUser.uid); // Pull the user
                const tasksCollectionRef = collection(userDocRef, 'tasks'); // Pull the tasks subcollection on user.

                console.log(user);
                setEmailPlaceholder(user.email);
                setDisplayNamePlaceholder(user.displayName);

                try {
                    const docSnapshot = await getDoc(userDocRef);
                    if (docSnapshot.exists()) {

                        // Update the email and verification status of the email within Firestore.
                        await setDoc(userDocRef, {
                            displayName: user.displayName,
                            email: user.email,
                            verified: user.emailVerified
                        }, { merge: true });

                        // Detect if email is verified or not to ensure user is prompted to verify their email.
                        if (!user.emailVerified) {
                            console.log(`The current user email is not verified`);

                        }

                    }
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
            } else {
                navigate('/login');
            }

            isLoading(false);
        }

        fetchAndSync();

    }, [auth.currentUser.uid, db, navigate, user]);

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


    // =============================
    //  EMAIL VERIFICATION HANDLERS
    // =============================

    /**
     * This sends an email to the current user to verify their email that is stored within Firebase Authentication.
     * Enforces a one minute delay before another verification email can be sent.
     */
    const sendEmailVerificationToEmail = async () => {
        try {

            await sendEmailVerification(auth.currentUser);              // Send email verification to the new email

            setLastSentTime(Date.now());
            localStorage.setItem('lastSentTime', Date.now().toString());

            console.log('Verification email sent to', emailPlaceholder);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    };


    // Goes home
    const ToHome = (e) => {
        e.preventDefault();
        navigate("/");
    };

    /**
     * This toggles the state of the Email Address field and related components. It can be in two states:
     * 
     * If editing email, clears text entry and sets it editable.
     * If not editing email, sets text entry to read only and populates to the user's current email. 
     */
    const toggleEmailEdit = () => {

        // If the user is editing display name or password, cancel out of it.
        if(isEditingPass) {
            togglePasswordEdit();
        }

        if(isEditingName) {
            toggleDisplayNameEdit();
        }


        setIsEditingEmail(!isEditingEmail);     // Invert status
        setEmail('');                           // Clear email state
        setPass('');                            // Clear pass state.

        // If editing email, clear the input field. (no idea why it's inverted here but i'm rolling with it)
        if (isEditingEmail) {
            setEmailPlaceholder(user.email);
        } else {
            setEmailPlaceholder('');
        }
    }

    /**
     * This toggles the state of the Password field and related components. It can be in two states:
     * 
     * If editing pass, unlocks text entry and two new inputs to reenter the new password.
     * If not editing pass, locks text entry.
     */
    const togglePasswordEdit = () => {

        // If they are editing email or display name, cancel changes.
        if(isEditingEmail) {
            toggleEmailEdit();
        }

        if(isEditingName) {
            toggleDisplayNameEdit();
        }

        setIsEditingPass(!isEditingPass);
        setPass('');
        setPassRepeat('');
        setPassPlaceholder('');

    }

    const toggleDisplayNameEdit = () => {

        // If they are editing email or password, cancel changes.
        if(isEditingEmail) {
            toggleEmailEdit();
        }

        if(isEditingPass) {
            togglePasswordEdit();
        }

        setIsEditingName(!isEditingName);       // Invert status
        setDisplayNamePlaceholder('');          // Clear display name state
        setPass('');                            // Clear pass state.

        // If editing pass, clear the input field
        if (isEditingName) {
            setDisplayNamePlaceholder(user.displayName);
        } else {
            setDisplayNamePlaceholder('');
        }
    }

    /**
     * This confirms the new value within emailPlaceholder. 
     */
    const confirmEmailEdit = async () => {

        setDisabledButton(true);            // Disable all buttons as this is an async action

        console.log('Checking email matches');
        if (emailPlaceholder !== email) {
            console.log('Emails do not match up on page.')
            setDisabledButton(false);
            return;
        }

        // Reauthenticate credentials.
        console.log('Emails match, proceeding to reauthenticate...');
        try {
            const credential = EmailAuthProvider.credential(user.email, pass);
            await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (err) {
            console.log('An error occured reauthenticating credentials. ' + err);
            setDisabledButton(false);
            return;
        }

        // Update email now
        console.log('Credentials reauthenticated, updating email...');
        try {
            await updateEmail(auth.currentUser, emailPlaceholder);
        } catch (err) {
            console.log('An error occured updating email. ' + err);
            setDisabledButton(false);
            return;
        }

        // Send email verification to the new email address.
        console.log('Sending email verification...');
        try {
            sendEmailVerificationToEmail()
        } catch (err) {
            console.log('An error ocurred sending an email. ' + err);
            setDisabledButton(false);
            return;
        }

        // Update this user's Firestore information to reflect these changes
        console.log('Syncing changes to Firestore at ' + user.uid);
        try {
            // Pull the user document then merge the email into the document
            const userDocRef = doc(db, 'user-data', user.uid);
            await setDoc(userDocRef, {
                email: user.email,
                verified: user.emailVerified
            }, { merge: true });

        } catch (err) {
            console.log('An error occured pushing to Firebase. ' + err);
            setDisabledButton(false);
            return;
        }

        console.log('Changes pushed successfully!');
        setDisabledButton(false);
        toggleEmailEdit();
    }

    /**
     * This confirms the new password within current user password.
     */
    const confirmPaswordEdit = async () => {

        setDisabledButton(true);            // Disable all buttons as this is an async action

        console.log('Checking current password matches');
        if (pass !== passRepeat) {
            console.log('New passwords do not match.')
            setDisabledButton(false);
            return;
        }

        // Reauthenticate credentials.
        console.log('Passwords match, proceeding to reauthenticate...');
        try {
            const credential = EmailAuthProvider.credential(user.email, passPlaceholder);
            await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (err) {
            console.log('An error occured reauthenticating credentials. ' + err);
            setDisabledButton(false);
            return;
        }

        // Update the password
        console.log('Credentials reauthenticated, updating password...');
        try {
            await updatePassword(user, pass);
        } catch (err) {
            console.log('An error occured updating email. ' + err);
            setDisabledButton(false);
            return;
        }

        console.log("Password changed successfully!");
        setDisabledButton(false);
        togglePasswordEdit();
    }

    const confirmDisplayNameEdit = async () => {

        console.log('Updating display name to ' + displayNamePlaceholder)
        setDisabledButton(true);
        
        try {
            await updateProfile(user, {displayName: displayNamePlaceholder});

        } catch (err) {
            console.log('An error occured updating the display name ' + err);
            setDisabledButton(false);
            return;
        }
        
        console.log('Updated display name successfully!');
        setDisabledButton(false);
        toggleDisplayNameEdit();
    }


    // Handle page rendering here
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='todoapp stack-large'>
            <h1>Settings</h1>
            <h2>Account</h2>

            {/**
             * This section allows users to change their display name.
             */}
            <p>Display Name</p>
            <div>
                {/** If NOT editing the display name, show the current display name with change button. */}
                {isEditingName && <p>Enter your new display name</p>}
                {isEditingName ? (
                    <input type="text" value={displayNamePlaceholder} onChange={(e) => setDisplayNamePlaceholder(e.target.value)} />
                ) : (
                    <input type="text" value={displayNamePlaceholder} readOnly />
                )}
                {!isEditingName && <button className='login-button' onClick={toggleDisplayNameEdit}>Change</button>}

                {/** Otherwise, clear the display name field, make it editable, prompt for password, and add "Cancel" and "Confirm" button */}
                {isEditingName && <button className='login-button' onClick={toggleDisplayNameEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingName && <button className='login-button' onClick={confirmDisplayNameEdit} disabled={disabledButton}>Confirm</button>}
            </div>



            {/**
             * This section allows users to change their email address.
             */}
            <h3>Email Address</h3>
            {/** If NOT editing email, show current email in readonly input field with "change" button*/}
            <div>
                {isEditingEmail ? (
                    <p>Enter your new email</p>
                ) : (
                    user.emailVerified ? (<p>Email verified</p>) : (<p>The current email is not verified, check for an email at your new email address.</p>)
                )}
                {isEditingEmail ? (
                    <input type="text" value={emailPlaceholder} onChange={(e) => setEmailPlaceholder(e.target.value)} />
                ) : (
                    <input type="text" value={emailPlaceholder} readOnly />
                )}
                {!isEditingEmail && <button className='login-button' onClick={toggleEmailEdit}>Change</button>}

                {/** IF editing email, input becomes cleared out and can have an entry, buttons become "Cancel and Confirm" */}
                {isEditingEmail && <p>Re-enter your new email</p>}
                {isEditingEmail && <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />}
                {isEditingEmail && <p>Enter current password to confirm changes</p>}
                {isEditingEmail && <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />}
                {isEditingEmail && <button className='login-button' onClick={toggleEmailEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingEmail && <button className='login-button' onClick={confirmEmailEdit} disabled={disabledButton}>Confirm</button>}

                {/** If the current email is unverified, send verification email button is displayed when not editing.*/}
                {!isEditingEmail && !user.emailVerified && <button className='login-button' onClick={sendEmailVerificationToEmail} disabled={lastSentTime}>Resend Email</button>}
            </div>



            {/**
             * This section allows users to change their password. They need to enter their current password and type their new password two times.
             */}
            <h3>Password</h3>
            <div>
                {/** If NOT editing password, display a readOnly text field and a Change button.*/}
                {isEditingPass && <p>Enter your current password</p>}
                {isEditingPass ? (
                    <input type="password" value={passPlaceholder} onChange={(e) => setPassPlaceholder(e.target.value)} />
                ) : (
                    <input type="password" value={passPlaceholder} readOnly />
                )}
                {!isEditingPass && <button className='login-button' onClick={togglePasswordEdit}>Change</button>}

                {/** If editing password, add an additional inputs to verify the new password, buttons become "Cancel" and "Confirm"*/}
                {isEditingPass && <p>Enter your new password</p>}
                {isEditingPass && <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />}
                {isEditingPass && <p>Re-enter your new password</p>}
                {isEditingPass && <input type="password" value={passRepeat} onChange={(e) => setPassRepeat(e.target.value)} />}
                {isEditingPass && <button className='login-button' onClick={togglePasswordEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingPass && <button className='login-button' onClick={confirmPaswordEdit} disabled={disabledButton}>Confirm</button>}

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