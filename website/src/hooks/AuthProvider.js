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

// Wraps application with auth context.
const AuthProvider = ({children}) => {

    // User and token states
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("userkey") || "");
    const navigate = useNavigate();

    // Call the server to see if a given email and password match a database record.
    const loginAction = async (email, pass) => {

        try {
            const response = await axios.post('http://localhost:5000/api/users/find', {email, pass});

            if(response.data.user) {
                setUser(response.data.user.name);
                setToken(response.data.user.user_key)
                localStorage.setItem("userkey", response.data.user.user_key);

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

    const logoutAction = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("userkey");
        navigate("/login")
    };

    return <AuthContext.Provider value={{token, user, loginAction, logoutAction}}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

// Can be called from child components.
export const useAuth = () => {
    return useContext(AuthContext);
}
