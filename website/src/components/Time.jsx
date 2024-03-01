//****************************************************************************************************************************
//Program name: "Time.jsx".  This program is to display time. Copyright (C)  *
//2024 Ryan Nishikawa                                                                                                        *
//This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License  *
//version 3 as published by the Free Software Foundation.                                                                    *
//This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied         *
//warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.     *
//A copy of the GNU General Public License v3 is available here:  <https://www.gnu.org/licenses/>.                           *
//****************************************************************************************************************************


//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2=========3**
//
//Author information
//  Author names: Ryan Nishikawa,
//  Author emails: ryannishikawa48@csu.fullerton.edu,
//  Course ID: CPSC362
//
//Program information
//  Program name: Task manager
//  Date of last update: February 22, 2024
//  Programming language(s): JavaScript, HTML, CSS
//  Files in this program: App.js, login.js, register.js, home.js, etc...
//
//  OS of the computer where the program was developed: Windows running WSL with Ubuntu 22.04.3 LTS
//  OS of the computer where the program was tested: Windows running WSL Ubuntu 22.04.3 LTS
//  Status: WIP
//
//References for this program
//  https://www.youtube.com/watch?v=psU13XU1gDY&list=LL&index=3&t=796s&ab_channel=CodeWithViju
//  https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started
//
//Purpose
//  to display/get time
//
//This file
//   File name: Time.jsx
//   Date of last update: February 22, 2024
//   Languages: JavaScript, HTML
//
//References for this file
//   https://medium.com/create-a-clocking-in-system-on-react/create-a-react-app-displaying-the-current-date-and-time-using-hooks-21d946971556
//   https://www.w3schools.com/jsref/jsref_getday.asp
//   https://react-bootstrap.netlify.app/docs/components/dropdowns/
//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2**
//
//
//
//
//===== Begin code area ================================================================================================

import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'; 

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//function that returns the current date
// import {DateTime} from "./Time";
export const DateTime = () => {
    var [date,setDate] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }
    });


    return date;
}

//function that prints out the date in the format: Day, Month Date
//                                                            Time
// import {DateTimeFormat} from "./Time";
export const DateTimeFormat = () => {
    var date = DateTime();
    return (
        <div className = "display-date">
            <p>{weekday[date.getDay()]}, {month[date.getMonth()]} {date.getDate()} <br></br>
            {date.toLocaleTimeString()}</p>
        </div>
    );
}


export const HoursDropdown = () => {
    return (
        <select id="dropdown-button" title="Hour">
          <option value="">hour</option>
          {[...Array(9)].map((_, index) => (
            <option key={index} eventKey={index + 1}>
              0{index + 1}
            </option>
          ))}
          {[...Array(3)].map((_, index) => (
            <option key={index+9} eventKey={index + 10}>
              {index + 10}
            </option>
          ))}
        </select>
      );
}


export const MinsDropdown = () => {
    return (
        <select id="dropdown-button" title="Mins">
          <option value="">mins</option>
          {[...Array(10)].map((_, index) => (
            <option key={index} eventKey={index}>
              0{index}
            </option>
          ))}
          {[...Array(50)].map((_, index) => (
            <option key={index+10} eventKey={index+10}>
              {index+10}
            </option>
          ))}
        </select>
      );
}


export const AMPMdropdown = () => {
    return (
        <select id="dropdown-button" title="AMPM">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    );
}

export default DateTime