/**
 * @file LoggedUser.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This component displays the name of the currently logged in user
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */

import React, { useState, useEffect } from 'react';
import { app } from '../firebaseConfig.js';
import { getAuth } from 'firebase/auth';

/**
 * Shows if a user is logged in or not.
 * @returns {JSX.Element} Not logged in displayed OR logged in as user
 */
export function LoggedUser() {

    const auth = getAuth(app);
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(newUser => {
            setUser(newUser);
        });

        return () => unsubscribe();
    }, [auth]);

    if(user !== null) {
        return (
            <div>
                <p>Logged in as <br></br>
                {user.displayName}</p>
            </div>
        );
    } else {
        return (
            <div>
                <p>Not logged in<br></br></p>
            </div>
        );
    } 
}