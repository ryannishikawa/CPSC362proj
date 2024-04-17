import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore';

export default function SettingsPage() {

    const [loading, isLoading] = useState(true);        // Set loading state for database queries to true
    const [dName, setdName] = useState(null);
    const [numTasks, setNumTasks] = useState(null);
    const navigate = useNavigate();                     // Use navigate features
    const db = getFirestore(app);                       // Pull the firestore database.
    const userId = localStorage.getItem('uid');         // Get the userID

    // Fetches database information
    const fetchData = async () => {
        if (userId) {
            const userDocRef = doc(db, 'user-data', userId); // Pull the user
            const tasksCollectionRef = collection(userDocRef, 'tasks'); // Pull the tasks subcollection on user.

            try {
                // Retrieve the username that is in the database.
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    const docData = docSnapshot.data();
                    setdName(docData.displayName);
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

    const DoAccountNameChange = (e) => {

    }

    const DoAccountPasswordChange = (e) => {

    }

    const DoClearAllTasks = (e) => {

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
            <p>Account Name: {dName}</p>
            <div><button className='login-button'>Change</button></div>
            <p>Account Password: *</p>
            <div><button className='login-button'>Change</button></div>
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