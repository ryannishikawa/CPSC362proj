/**
 * @file PrivateRoute.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This component handles non-authenticated users by redirecting them to the login page.
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 * 
 * Resources:
 * @see {@link: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5} for inspiration for this file
 */

import React from "react";
import {Navigate, Outlet} from "react-router-dom";

import { app } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";

/**
 * Protects a page from unauthenticated users.
 * @returns {JSX.Element} 
 */
export default function PrivateRoute({ children, ...rest }) {
    const auth = getAuth(app);
    const isAuthenticated = auth.currentUser !== null;

    if(!isAuthenticated) return <Navigate to="/login" />

    return <Outlet />
};