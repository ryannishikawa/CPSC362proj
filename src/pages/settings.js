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
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification, updateEmail, deleteUser } from "firebase/auth";
import { AuthBar } from '../components/AuthBar.jsx';
import { NavBar } from '../components/NavBar.jsx';

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
    const [isContemplatingAccountDelete, setIsContemplatingAccountDelete] = useState(false);    // The state of account deletion
    const [isContemplatingTaskPurge, setIsContemplatingTaskPurge] = useState(false);            // The state of task deletion.
    const [displayNamePlaceholder, setDisplayNamePlaceholder] = useState(null);                 // The state of the display name input box
    const [emailPlaceholder, setEmailPlaceholder] = useState(null);                             // The state of the email address input box
    const [passPlaceholder, setPassPlaceholder] = useState(null);                               // The state of the password input box
    const [message , setMessage] = useState(null);                                                // This visually lets user see if actions are completed or not.
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

                    // Ensure empty documents are not counted!
                    let currentTaskCount = querySnapshot.size;
                    querySnapshot.forEach((doc) => {

                        if(Object.keys(doc.data()).length === 0) {
                            currentTaskCount--;
                        }
                    });

                    setNumTasks(currentTaskCount);

                } catch (error) {
                    console.log('Error retrieving tasks:', error);
                }
            } else {
                navigate('/login');
            }

            isLoading(false);
        }

        fetchAndSync();

    }, [auth.currentUser.uid, db, navigate, numTasks, user]);

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



    /**
     * This sends an email to the current user to verify their email that is stored within Firebase Authentication.
     * Enforces a one minute delay before another verification email can be sent.
     */
    const sendEmailVerificationToEmail = async () => {
        try {

            await sendEmailVerification(auth.currentUser);              // Send email verification to the new email
            setMessage('Email sent! You can try again in ' + lastSentTime);
            setLastSentTime(Date.now());
            localStorage.setItem('lastSentTime', Date.now().toString());

            console.log('Verification email sent to', emailPlaceholder);
        } catch (error) {
            setMessage(error.message);
        }
    };



    /**
     * This toggles the state of the Email Address field and related components. It can be in two states:
     * 
     * If editing email, clears text entry and sets it editable.
     * If not editing email, sets text entry to read only and populates to the user's current email. 
     */
    const toggleEmailEdit = () => {

        // If the user is editing anything else, cancel it out.
        if(isEditingPass) {
            togglePasswordEdit();
        }
        if(isEditingName) {
            toggleDisplayNameEdit();
        }
        if(isContemplatingAccountDelete){
            toggleAccountDelete();
        }
        if(isContemplatingTaskPurge) {
            toggleTaskPurge();
        }

        setIsEditingEmail(!isEditingEmail);     // Invert status
        setEmail('');                           // Clear email state
        setPass('');                            // Clear pass state.
        setMessage('');                         // Clear message state.

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

        // If they are editing anything, cancel changes.
        if(isEditingEmail) {
            toggleEmailEdit();
        }
        if(isEditingName) {
            toggleDisplayNameEdit();
        }
        if(isContemplatingAccountDelete) {
            toggleAccountDelete();
        }
        if(isContemplatingTaskPurge) {
            toggleTaskPurge();
        }

        setIsEditingPass(!isEditingPass);
        setPass('');
        setPassRepeat('');
        setPassPlaceholder('');
        setMessage('');

    }

    /**
     * This toggles the state of the Display Name field and related components. It can be in two states:
     * 
     * If editing the display name, clears and unlocks the text entry.
     * If not editing display name, locks text entry and populates with current display name.
     */
    const toggleDisplayNameEdit = () => {

        // If they are editing anything, cancel changes.
        if(isEditingEmail) {
            toggleEmailEdit();
        }
        if(isEditingPass) {
            togglePasswordEdit();
        }
        if(isContemplatingAccountDelete) {
            toggleAccountDelete();
        }
        if(isContemplatingTaskPurge) {
            toggleTaskPurge();
        }

        setIsEditingName(!isEditingName);       // Invert status
        setDisplayNamePlaceholder('');          // Clear display name state
        setPass('');                            // Clear pass state.
        setMessage('');

        // If editing pass, clear the input field
        if (isEditingName) {
            setDisplayNamePlaceholder(user.displayName);
        } else {
            setDisplayNamePlaceholder('');
        }
    }

    /**
     * This toggles the state of the account deletion section. It prompts for the password if the user wishes to delete their account.
     */
    const toggleAccountDelete = () => {

        // If user is editing anything, cancel out of it.
        if(isEditingName) {
            toggleDisplayNameEdit();
        }
        if(isEditingEmail) {
            toggleEmailEdit();
        }
        if(isEditingPass) {
            togglePasswordEdit();
        }
        if(isContemplatingTaskPurge) {
            toggleTaskPurge();
        }

        setIsContemplatingAccountDelete(!isContemplatingAccountDelete);
        setPass('');
        setMessage('');
    }

    /**
     * This toggles the state of deleting all tasks with the user account. It prompts for a password if the user wishes to delete all their tasks.
     */
    const toggleTaskPurge = () => {

        // If user is editing anything, cancel out of it.
        if(isEditingName) {
            toggleDisplayNameEdit();
        }
        if(isEditingEmail) {
            toggleEmailEdit();
        }
        if(isEditingPass) {
            togglePasswordEdit();
        }
        if(isContemplatingAccountDelete) {
            toggleAccountDelete();
        }

        setIsContemplatingTaskPurge(!isContemplatingTaskPurge);
        setPass('');
        setMessage('');
    }



    /**
     * This confirms the new value within emailPlaceholder. 
     */
    const confirmEmailEdit = async () => {

        setDisabledButton(true);            // Disable all buttons as this is an async action

        if(emailPlaceholder.length <= 0 || email.length <= 0) {
            setMessage('Please enter your email.');
            setDisabledButton(false);
            return;
        }

        console.log('Checking email matches');
        if (emailPlaceholder !== email) {
            setMessage('Emails do not match up.');
            setDisabledButton(false);
            return;
        }

        // Reauthenticate credentials.
        console.log('Emails match, proceeding to reauthenticate...');
        try {
            const credential = EmailAuthProvider.credential(user.email, pass);
            await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        // Update email now
        console.log('Credentials reauthenticated, updating email...');
        try {
            await updateEmail(auth.currentUser, emailPlaceholder);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        // Send email verification to the new email address.
        console.log('Sending email verification...');
        try {
            sendEmailVerificationToEmail()
        } catch (err) {
            setMessage(err.message);
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
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        console.log('Changes pushed successfully!');
        setMessage('Email set!');
        setDisabledButton(false);
        toggleEmailEdit();
    }

    /**
     * This confirms the new password within current user password.
     */
    const confirmPaswordEdit = async () => {

        setDisabledButton(true);            // Disable all buttons as this is an async action
        
        if(pass.length <= 0 || passRepeat.length <= 0) {
            setMessage('Please enter a new password.');
        }

        console.log('Checking current password matches');
        if (pass !== passRepeat) {
            setMessage('New passwords do not match.')
            setDisabledButton(false);
            return;
        }

        // Reauthenticate credentials.
        console.log('Passwords match, proceeding to reauthenticate...');
        try {
            const credential = EmailAuthProvider.credential(user.email, passPlaceholder);
            await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        // Update the password
        console.log('Credentials reauthenticated, updating password...');
        try {
            await updatePassword(user, pass);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        setMessage('Updated successfully!');
        setDisabledButton(false);
        togglePasswordEdit();
    }

    /**
     * This confirms the changes made to the display name.
     */
    const confirmDisplayNameEdit = async () => {

        setDisabledButton(true);

        if(displayNamePlaceholder.length <= 0) {
            setMessage('Cannot set an empty display name');
            setDisabledButton(false);
            return;
        }
        
        try {
            await updateProfile(user, {displayName: displayNamePlaceholder});

        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }
        
        setMessage('Updated display name successfully!');
        setDisabledButton(false);
        toggleDisplayNameEdit();
    }

    /**
     * This confirms that a user wishes to delete their account. It also deletes their Firestore entry.
     */
    const confirmAccountDelete = async () => {

        setDisabledButton(true);    // Disable inputs

        console.log('SAD HOUR! Checking if passwords match up...');
        const credential = EmailAuthProvider.credential(user.email, pass);

        try {
            await reauthenticateWithCredential(user, credential);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }
        
        console.log('Credentials reauthenticated, deleting Firestored information...');
        try {
            const userTasksRef = collection(db, 'user-data', user.uid, 'tasks');
            const querySnapshot = await getDocs(userTasksRef);

            if(!querySnapshot.empty) {
                querySnapshot.forEach(async (taskDoc) => {
                    await deleteDoc(taskDoc.ref);
                });

                await deleteDoc(doc(db, 'user-data', user.uid, 'tasks'));
            }

            await deleteDoc(doc(db, 'user-data', user.uid));

            console.log('Tasks deleted successfully.');

        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        setMessage('Deleting user account...');
        try {
            await deleteUser(user);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        alert('Account deleted, thank you for using our app!');
        navigate('/');
    }

    /**
     * This confirms if a user wants to delete all their tasks in their user account.
     */
    const confirmTaskPurge = async () => {
        setDisabledButton(true);    // Disable inputs

        console.log('Checking if passwords match up...');
        const credential = EmailAuthProvider.credential(user.email, pass);

        try {
            await reauthenticateWithCredential(user, credential);
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }
        
        setMessage('Credentials reauthenticated, deleting Firestored information...');
        try {
            const userTasksRef = collection(db, 'user-data', user.uid, 'tasks');
            const querySnapshot = await getDocs(userTasksRef);

            if(!querySnapshot.empty) {
                querySnapshot.forEach(async (taskDoc) => {
                    await deleteDoc(taskDoc.ref);
                });
            }
        } catch (err) {
            setMessage(err.message);
            setDisabledButton(false);
            return;
        }

        setMessage('Tasks deleted successfully!');
        setNumTasks(0);
        setDisabledButton(false);
        toggleTaskPurge();
    }


    // Handle page rendering here
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='todoapp stack-large'>
            <AuthBar />
            <h1>Settings</h1>
            <NavBar auth={auth} />
            <h2>Account</h2>

            {/**
             * This section allows users to change their display name.
             */}
            <h3>Display Name</h3>
            <div>
                {/** If NOT editing the display name, show the current display name with change button. */}
                {isEditingName ? (<p>Enter your new display name.</p>) : (<p>Your current display name.</p>)}
                {isEditingName ? (
                    <input type="text" value={displayNamePlaceholder} disabled={disabledButton} onChange={(e) => setDisplayNamePlaceholder(e.target.value)} />
                ) : (
                    <input type="text" value={displayNamePlaceholder} readOnly />
                )}
                {!isEditingName && <button className='action-button' onClick={toggleDisplayNameEdit}>Change</button>}

                {/** Otherwise, clear the display name field, make it editable, prompt for password, and add "Cancel" and "Confirm" button */}
                {isEditingName && <button className='action-button' onClick={toggleDisplayNameEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingName && <button className='action-button' onClick={confirmDisplayNameEdit} disabled={disabledButton}>Confirm</button>}
                {isEditingName && <p>{message}</p>}
            </div>



            {/**
             * This section allows users to change their email address.
             */}
            <h3>Email Address</h3>
            {/** If NOT editing email, show current email in readonly input field with "change" button*/}
            <div>
                {isEditingEmail ? (
                    <p>Enter your new email.</p>
                ) : (
                    user.emailVerified ? (<p>Email verified.</p>) : (<p>The current email is not verified, check for an email at your new email address.</p>)
                )}
                {isEditingEmail ? (
                    <input type="text" value={emailPlaceholder} disabled={disabledButton} onChange={(e) => setEmailPlaceholder(e.target.value)} />
                ) : (
                    <input type="text" value={emailPlaceholder} readOnly />
                )}
                {!isEditingEmail && <button className='action-button' onClick={toggleEmailEdit}>Change</button>}

                {/** IF editing email, input becomes cleared out and can have an entry, buttons become "Cancel and Confirm" */}
                {isEditingEmail && <p>Re-enter your new email.</p>}
                {isEditingEmail && <input type="text" value={email} disabled={disabledButton} onChange={(e) => setEmail(e.target.value)} />}
                {isEditingEmail && <p>Enter current password to confirm changes.</p>}
                {isEditingEmail && <input type="password" value={pass} disabled={disabledButton} onChange={(e) => setPass(e.target.value)} />}
                {isEditingEmail && <button className='action-button' onClick={toggleEmailEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingEmail && <button className='action-button' onClick={confirmEmailEdit} disabled={disabledButton}>Confirm</button>}
                {isEditingEmail && <p>{message}</p>}

                {/** If the current email is unverified, send verification email button is displayed when not editing.*/}
                {!isEditingEmail && !user.emailVerified && <button className='action-button' onClick={sendEmailVerificationToEmail} disabled={lastSentTime}>Resend Email</button>}
                {!isEditingEmail && !user.emailVerified && <p>{message}</p>}
            </div>



            {/**
             * This section allows users to change their password. They need to enter their current password and type their new password two times.
             */}
            <h3>Password</h3>
            <div>
                {/** If NOT editing password, display a readOnly text field and a Change button.*/}
                {isEditingPass ? (<p>Enter your current password.</p>) : (<p>Improve your security with a strong password.</p>)}
                {isEditingPass ? (
                    <input type="password" value={passPlaceholder} disabled={disabledButton} onChange={(e) => setPassPlaceholder(e.target.value)} />
                ) : (
                    <input type="password" value={passPlaceholder} readOnly />
                )}
                {!isEditingPass && <button className='action-button' onClick={togglePasswordEdit}>Change</button>}

                {/** If editing password, add an additional inputs to verify the new password, buttons become "Cancel" and "Confirm"*/}
                {isEditingPass && <p>Enter your new password.</p>}
                {isEditingPass && <input type="password" value={pass} disabled={disabledButton} onChange={(e) => setPass(e.target.value)} />}
                {isEditingPass && <p>Re-enter your new password.</p>}
                {isEditingPass && <input type="password" value={passRepeat} disabled={disabledButton} onChange={(e) => setPassRepeat(e.target.value)} />}
                {isEditingPass && <button className='action-button' onClick={togglePasswordEdit} disabled={disabledButton}>Cancel</button>}
                {isEditingPass && <button className='action-button' onClick={confirmPaswordEdit} disabled={disabledButton}>Confirm</button>}
                {isEditingPass && <p>{message}</p>}
            </div>


            {/**
             * This section allows user to delete their account. THIS ACTION IS IRREVERSIBLE AND ALSO DELETES THEIR STORED TASKS!
             */}
            <h3>Delete Account</h3>
            <div>
                {!isContemplatingAccountDelete && <button className='action-button' onClick={toggleAccountDelete}>Delete</button>}

                {isContemplatingAccountDelete && <p>You are about to delete your account and all associated data. This action is IRREVERSIBLE. Are you sure?</p>}
                {isContemplatingAccountDelete && <p>Enter current password to confirm changes.</p>}
                {isContemplatingAccountDelete && <input type="password" value={pass} disabled={disabledButton} onChange={(e) => setPass(e.target.value)} />}
                {isContemplatingAccountDelete && <button className='action-button' onClick={toggleAccountDelete} disabled={disabledButton}>Nevermind</button>}
                {isContemplatingAccountDelete && <button className='action-button' onClick={confirmAccountDelete} disabled={disabledButton}>Goodbye</button>}
                {isContemplatingAccountDelete && <p>{message}</p>}
            </div>
            <h2>Task Management</h2>
            <h3>Clear Tasks</h3>
            <div>
                <p>Currently, you have {numTasks} task(s) associated with your account.</p>
                {!isContemplatingTaskPurge && <button className='action-button' onClick={toggleTaskPurge}>Clear Tasks</button>}
                
                {isContemplatingTaskPurge && <p>You are about to delete {numTasks} task(s) that are associated with your account. This action is IRREVERSIBLE. Are you sure?</p>}
                {isContemplatingTaskPurge && <p>Enter current password to confirm changes.</p>}
                {isContemplatingTaskPurge && <input type="password" value={pass} disabled={disabledButton} onChange={(e) => setPass(e.target.value)} />}
                {isContemplatingTaskPurge && <button className='action-button' onClick={toggleTaskPurge} disabled={disabledButton}>Cancel</button>}
                {isContemplatingTaskPurge && <button className='action-button' onClick={confirmTaskPurge} disabled={disabledButton}>Delete</button>}
                {isContemplatingTaskPurge && <p>{message}</p>}
            </div>
        </div>
    );
}