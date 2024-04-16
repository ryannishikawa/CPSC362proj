/**
 * @file AuthProvider.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file handles authentication of user sessions within child components in the application using Firebase Authentication
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 * @see {@link: https://firebase.google.com/docs/auth} for more about Firebase Authentication
 * 
 * Resources:
 * @see {@link: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} for inspiration for this file
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { app } from "../firebaseConfig";

const AuthContext = createContext();

/**
 * Provides authentication to manage user sessions.
 * @param {Object} props The properties for the AuthProvider component.
 * @param {ReactNode} props.children The child components to be wrapped by AuthProvider.
 * @returns {JSX.Element} An AuthProvider component.
 */
export default function AuthProvider({children}) {

    // User and UID states
    const [user, setUser] = useState(null)
    const [uid, setUID] = useState('');
    const navigate = useNavigate();

    const auth = getAuth(app);

    useEffect(() => {
        const authState = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.displayName);
                setUID(user.uid);
                localStorage.setItem("username", user.displayName);
                localStorage.setItem("uid", user.uid);
            } else {
                setUser(null);
                setUID("");
                localStorage.removeItem("username");
                localStorage.removeItem("uid");
            }
        });

        // Cleanup subscription on unmount
        return () => authState();
    }, []);
    
    /**
     * Allows sessions to persist upon exiting website assuming valid credentials are provided
     * @param {string} email The email address of the user
     * @param {string} pass The password for the user
     * @returns {void} Saves user key and user ID to the session.
     */
    const loginAction = async (email, pass) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            setUser(user.displayName);
            setUID(user.uid);
            localStorage.setItem("username", user.displayName);
            localStorage.setItem("uid", user.uid);

            alert(`Welcome ${user.displayName}! Logging you in...`);
            navigate("/home");
        } catch (err) {
            alert(err.message);
        }
    };

    /**
     * Removes the user, token, and associated information in the account from the session.
     * @returns {void} Removed user, token, and associated info.
     */
    const logoutAction = async () => {
        try {
            await signOut(auth);

            setUser(null);
            setUID("");
            localStorage.removeItem("username");
            localStorage.removeItem("uid");

            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AuthContext.Provider value={{ uid, user, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Accesses authentication context within child components
 * @returns {Object} Context containing token, user, loginAction, and logoutAction
 */
export const useAuth = () => {
    return useContext(AuthContext);
}
