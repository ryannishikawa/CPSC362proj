import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

/**
 * @file NavBar.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This is a navbar component that is used throughout all pages in the app.
 * 
 * @param {import("firebase/auth").Auth} auth The auth instance
 * @returns 
 */
export function NavBar({auth}) {
    
    const navigate = useNavigate();

    // Sign out the user
    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();
    }

    return (
        <nav className='navbar'>
            <button onClick={() => { navigate('/tasks') }} className='action-button'>Manage Tasks</button>
            <button onClick={() => { navigate('/about') }} className='action-button'>About App</button>
            <button onClick={() => { navigate('/settings') }} className='action-button'>Settings</button>
            {auth.currentUser ? (
                <button onClick={(handleLogout)} className='action-button'>Log Out</button>
            ) : (
                <button onClick={() => { navigate('/login') }} className='action-button'>Log In</button>
            )}
        </nav>
    );
}