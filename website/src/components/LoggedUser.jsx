/**
 * @file LoggedUser.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This component displays the name of the currently logged in user
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */

import React from 'react';
import { useState } from 'react';

/**
 * Shows if a user is logged in or not.
 * @returns {JSX.Element} Not logged in displayed OR logged in as user
 */
export function LoggedUser() {

    const user = useState(localStorage.getItem("username") | "");

    if(user === null) {
        return (
            <div className='container-top-item'>
                <p>Not logged in<br></br>
                :(</p>
            </div>
        );
    }

    return (
        <div className='container-top-item'>
            <p>Logged in as <br></br>
            {localStorage.getItem('username')}</p>
        </div>
    );
}