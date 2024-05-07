import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";

/**
 * @file NavBar.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This is a navbar component that is used throughout all pages in the app.
 */

/**
 * The navigation bar shows navigation buttons.
 * @param {import("firebase/auth").Auth} auth The auth instance
 * @returns {JSX.Element} A react element for the NavBar.
 */
export function NavBar({auth}) {
    
    const [disabled, setDisabled] = useState(false);

    const location = useLocation();         // The location of the user
    const navigate = useNavigate();         // Use navigate feature

    // Sign out the user
    const handleLogout = async () => {
        setDisabled(true);
        await signOut(auth);
        window.location.reload();
    }

    return (
        <nav className='container'>
            {location.pathname !== '/' ? (
                <button disabled={disabled} onClick={() => { navigate('/') }} className='action-button'>Go Home</button>
            ) : (
                <button disabled={disabled} onClick={() => { navigate('/tasks') }} className='action-button'>Manage Tasks</button>
            )}
            <button disabled={disabled} onClick={() => { navigate('/settings') }} className='action-button'>Settings</button>
            {auth.currentUser ? (
                <button disabled={disabled} onClick={(handleLogout)} className='action-button'>Log Out</button>
            ) : (
                <button disabled={disabled} onClick={() => { navigate('/login') }} className='action-button'>Log In</button>
            )}
        </nav>
    );
}