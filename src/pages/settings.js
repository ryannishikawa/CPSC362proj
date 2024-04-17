import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getFirestore, doc, getDocs, collection } from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";

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

    // Pull user data from storage before the page loads.
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

    // Handle Account Name changing below
    const handleAccountNameChange = () => {
        setdNameHold(dName);
        setIsEditingName(!isEditingName);
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


    // These functions push data to the database from respective calls
    const pushNewName = () => {
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
    if(loading) {
        return <div>Loading...</div>
    }

    return(
        <div className='todoapp stack-large'>
            <h1>Settings</h1>
            <h2>Account</h2>

            <p>Email Address
                {isEditingEmail ? (
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                    <input type="text" value={email} readOnly/>
                )}
            </p>
            <div>
                <button className='login-button' onClick={isEditingEmail ?  handleAccountEmailChangeCancel :handleAccountEmailChange}>
                    {
                        isEditingEmail ? 'Cancel' : 'Change'
                    }
                </button>
                {isEditingEmail && <button className='login-button'>Save</button>}
            </div>

            <p>Display Name
                {isEditingName ? (
                    <input type="text" value={dName} onChange={(e) => setdName(e.target.value)} />
                ) : (
                    <input type="text" value={dName} readOnly/>
                )}
            </p>
            <div>
                <button className='login-button' onClick={isEditingName ?  handleAccountNameChangeCancel :handleAccountNameChange}>
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
                    <input type="text" value="" readOnly/>
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