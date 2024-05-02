/**
 * @file auth.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu
 * @description This page handles authentication features that are needed for changing emails and passwords.
 * 
 * @see {@link: https://firebase.google.com/docs/auth} on Firebase Authentication.
 * @see {@link: https://firebase.google.com/docs/auth/custom-email-handler} on how email handling is done.
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 * 
 * Currently supported modes:
 *  - verifyEmail
 *  - recoverEmail
 *  - resetPassword
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Firebase imports
import { app } from '../firebaseConfig.js';
import { applyActionCode, checkActionCode, confirmPasswordReset, getAuth, verifyPasswordResetCode } from 'firebase/auth';

export default function AuthEndpoint() {

    const navigate = useNavigate();                     // Use navigate features
    const auth = getAuth(app);                          // Use Firebase Authentication

    const location = useLocation();                             // Get the current URL to get URL parameters.
    const searchParams = new URLSearchParams(location.search);  // Get the parameters

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {

        /**
         * This endpoint handles verifyEmail with action code.
         */
        if (mode === 'verifyEmail') {
            console.log('Email verification being handeled, attempting to apply oobCode...');

            // Apply action code
            applyActionCode(auth, oobCode).then(async (resp) => {
                console.log('Action code applied! Email successfully verified.');
                alert(`Your new email was verified successfully!`);
                navigate('/');

            }).catch((err) => {
                console.log(err);
            });
        } else if (mode === 'recoverEmail') {
            console.log('Starting email recovery, checking oobCode');

            let restoredEmail = null;

            checkActionCode(auth, oobCode).then((info) => {

                restoredEmail = info['data']['email'];
                console.log('Found old email ' + restoredEmail + ', attempting to revert back...');

                return applyActionCode(auth, oobCode);
            }).then(() => {
                console.log('Account email reverted successfully!');
                alert(`Your email was successfully reverted back to your old email.`);
                navigate('/');

            }).catch((err) => {
                console.log(err);
            });
        } else if (mode === 'resetPassword') {
            console.log('Initiating password reset, verifying oobCode...');

            verifyPasswordResetCode(auth, oobCode).then((email) => {
                const accountEmail = email;
                const newPassword = prompt(`Changing password for ${accountEmail}. Please enter a new password.`);

                console.log('Confirming password reset...');
                confirmPasswordReset(auth, oobCode, newPassword).then(() => {

                    alert('Password reset successfully! Navigating to login...');
                    navigate('/login');

                }).catch((err) => {
                    console.log('Error confirming password reset.' + err);
                })
            }).catch((err) => {
                console.log('Error verifying password reset code. ' + err);
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