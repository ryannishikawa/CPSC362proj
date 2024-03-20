/**
 * @file AuthProvider.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file handles authentication of user sessions within child components in the application.
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 * 
 * Resources:
 * @see {@link: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} for inspiration for this file
 */

import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

/**
 * Provides authentication to manage user sessions.
 * @param {Object} props The properties for the AuthProvider component.
 * @param {ReactNode} props.children The child components to be wrapped by AuthProvider.
 * @returns {JSX.Element} An AuthProvider component.
 */
export default function AuthProvider({children}) {

    // User and token states
    const [user, setUser] = useState(localStorage.getItem("username") | "");
    const [token, setToken] = useState(localStorage.getItem("userkey") || "");
    const navigate = useNavigate();

    
    /**
     * Allows sessions to persist upon exiting website assuming valid credentials are provided
     * @param {string} email The email address of the user
     * @param {string} pass The password for the user
     * @returns {void} Saves user key and user ID to the session.
     */
    const loginAction = async (email, pass) => {

        try {
            const response = await axios.post('http://localhost:5000/api/users/find', {email, pass});

            if(response.data.user) {
                setUser(response.data.user.name);
                setToken(response.data.user.user_key)

                // Store user info and tasks that will be modified in the session
                localStorage.setItem("username", response.data.user.name);
                localStorage.setItem("userkey", response.data.user.user_key);
                localStorage.setItem("userid", response.data.user.uid);
                localStorage.setItem("usertasks", []);

                alert(`Welcome ${response.data.user.name}! Logging you in...`);
                navigate("/home");
                return;
            } else {
                alert(`Incorrect email and/or password.`);
            }

            throw new Error(response.message);
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Removes the user, token, and associated information in the account from the session.
     * @returns {void} Removed user, token, and associated info.
     */
    const logoutAction = () => {
        setUser(null);
        setToken("");

        localStorage.removeItem("username");
        localStorage.removeItem("userkey");
        localStorage.removeItem("userid");
        localStorage.removeItem("usertasks");
        navigate("/");
    };

    return <AuthContext.Provider value={{token, user, loginAction, logoutAction}}>{children}</AuthContext.Provider>;
}

/**
 * Accesses authentication context within child components
 * @returns {Object} Context containing token, user, loginAction, and logoutAction
 */
export const useAuth = () => {
    return useContext(AuthContext);
}
