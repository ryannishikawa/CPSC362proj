/**
 * @file auth.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu
 * @description This page handles authentication features that are needed for changing emails and passwords.
 * 
 * Currently supported modes:
 *  - verifyEmail
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { applyActionCode, getAuth } from 'firebase/auth';

export default function AuthEndpoint() {

    const navigate = useNavigate();                     // Use navigate features
    const auth = getAuth(app);                          // Use Firebase Authentication

    const location = useLocation();                             // Get the current URL to get URL parameters.
    const searchParams = new URLSearchParams(location.search);  // Get the parameters

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {

        if (mode === 'verifyEmail') {
            console.log('Email verification being handeled, attempting to apply oobCode.');

            // Apply action code
            applyActionCode(auth, oobCode).then(async (resp) => {
                console.log('Action code applied! Email successfully verified.');

                navigate('/');

            }).catch((err) => {
                console.log(err);
            });
        }
    }, [auth, mode, navigate, oobCode]);

    return (
        <div>
            {mode !== 'verifyEmail' && (
                <div>
                    <p>No action specified.</p>
                </div>
            )}
        </div>
    );
}