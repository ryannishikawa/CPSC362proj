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
//  Date of last update: May 8, 2024
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
//   Date of last update: April 16, 2024
//   Languages: JavaScript, HTML
//
//References for this file
//   https://medium.com/create-a-clocking-in-system-on-react/create-a-react-app-displaying-the-current-date-and-time-using-hooks-21d946971556
//   https://www.w3schools.com/jsref/jsref_getday.asp
//   https://react-bootstrap.netlify.app/docs/components/dropdowns/
//   https://www.npmjs.com/package/react-datepicker
//   https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
//=======1=========2=========3=========4=========5=========6=========7=========8=========9=========0=========1=========2**
//
//
//
//
//===== Begin code area ================================================================================================

import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



//**********************************************************************************************************************
//===== Begin Time area ================================================================================================
//**********************************************************************************************************************

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

//**********************************************************************************************************************
//===== End Time area ================================================================================================
//**********************************************************************************************************************

//**********************************************************************************************************************
//===== Begin Dropdown Menu area ================================================================================================
//**********************************************************************************************************************

//function that creates a dropdown menu to select *hour* for dueDate
// import {HoursDropdown} from "./Time"
export const HoursDropdown = ({setSelectedHours}) => {
    var hoursNow = DateTime().getHours();
    var hoursNowReal = (hoursNow + 1) > 12 ? (hoursNow - 11) : (hoursNow + 1);

    const handleHoursChange = (e) => {
        setSelectedHours(e.target.value);
    }

    return (
        <select id="dropdown-button" title="Hour" onChange={handleHoursChange} defaultValue={hoursNowReal}>
          {[...Array(12)].map((_, index) => (
            <option value={index+1}>
              {index + 1}
            </option>
          ))}
        </select>
      );
}

//function that creates a dropdown menu to select *minutes* for dueDate
// import {MinsDropdown} from "./Time"
export const MinsDropdown = ({setSelectedMins}) => {
    const handleMinsChange = (e) => {
        setSelectedMins(e.target.value);
    }

    return (
        <select id="dropdown-button" title="Mins" onChange={handleMinsChange}>
          {[...Array(10)].map((_, index) => (
            <option value={index}>
                0{index}
            </option>
          ))}
          {[...Array(50)].map((_, index) => (
            <option value={index+10}>
                {index+10}
            </option>
          ))}
        </select>
      );
}

//function that creates a dropdown menu to select *AM/PM* for dueDate
// import {AMPMDropdown} from "./Time"
export const AMPMdropdown = ({setSelectedAMPM}) => {
    var AMorPM = DateTime().getHours() >= 12 ? "PM" : "AM";

    const handleAMPMChange = (e) => {
        setSelectedAMPM(e.target.value);
    }

    return (
        <select id="dropdown-button" title="AMPM" onChange={handleAMPMChange} defaultValue={AMorPM}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    );
}

//**********************************************************************************************************************
//===== End Dropdown Menu area ================================================================================================
//**********************************************************************************************************************


//datepicker function
// import {Example} from "./Time"
export const Example = ({ setStartDate }, initialDate) => {
    const [startDate, setInternalStartDate] = useState(new Date());
  
    const handleDateChange = (date) => {
      setInternalStartDate(date);
      setStartDate(date);
    };
  
    return (
      <DatePicker
        defaultValue={initialDate}
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy"
        showMonthDropdown={true}
      />
    );
  };

//function to get the difference between 2 dates in days
function getDayDiff(year, month, dueDay) {
    const currentDate = DateTime();
    const utc1 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const utc2 = Date.UTC(year, month, dueDay);

  return (Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)));
    
}

  //function to set the status of a task
  export const showStatus = (year, month, dueDate, hour, minute, complete) => {
    const currentDate = DateTime();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentDay = currentDate.getDate();
    var daysLeft = getDayDiff(year, month, dueDate);

    if (!complete) {
    //if dueDateTime is before than currentDateTime returns LATE
        if (daysLeft < 0 || 
            (daysLeft === 0 && hour < currentHour) ||
            (daysLeft === 0 && hour === currentHour && minute < currentMinute)) {
            return <div style={{color: 'red'}}>LATE!!!!!</div>;
    //if it is the dueDateTime right now returns NOW
        } else if (dueDate === currentDay && hour === currentHour && minute === currentMinute) {
            return <div style={{color: 'red'}}>NOW!!!!!</div>;
    //if dueDate is today
        } else if (daysLeft === 0) {
    //if dueHour is greater than hourNow+1, returns hours left until due
            if (hour > (currentHour+1)) {
                return <div>...in {hour - currentHour} hours</div>;
    //if dueHour is within 1 hour of hourNow, returns the time difference in minutes
            } else if (hour === (currentHour+1)) {
                if (currentMinute > minute) {
                    return <div>...in {60 + (minute - currentMinute)} minute(s)</div>;
                } else {
                    return <div>...in 1 hour</div>;
                }
    //if dueHour and hourNow are equal, compare minutes to return mins left
            } else if (hour === currentHour) {
                return <div>...in {minute - currentMinute} minute(s)</div>;
            } else {
                return <div style={{color: 'red'}}>LATE!!!!!</div>;
            }
    //if dueDate is tommorow but still within 24hrs of currentDay, return the time diff in hours
        } else if (daysLeft === 1) {
            return <div>...in {24 + hour - currentHour} hours</div>;
    //if dueDate is after current date and the time diff is >24hrs, return the difference in days 
        } else {
            return <div>...in {daysLeft} days</div>;
        }
    //if complete return done
    } else {
        return <div>done</div>;
    }
};

//function to display the dueDate
export const showDueDate = (year, month, day, hour, minute, name) => {
//if due today print today instead of date
    if (getDayDiff(year, month, day) === 0) {
        return <div>{name} - today at {hour >= 12 ? (hour-12):(hour)}:{minute <= 9 ? ('0'+minute) : minute} {hour >= 12 ? "PM" : "AM"}</div>
//if due tommorow print tommorow instead of date
    } else if (getDayDiff(year, month, day) === 1) {
        return <div>{name} - tommorow at {hour >= 12 ? (hour-12):(hour)}:{minute <= 9 ? ('0'+minute) : minute} {hour >= 12 ? "PM" : "AM"}</div>
//if due yesterday print yesterday instead of date
    } else if (getDayDiff(year, month, day) === -1) {
        return <div>{name} - yesterday at {hour >= 12 ? (hour-12):(hour)}:{minute <= 9 ? ('0'+minute) : minute} {hour >= 12 ? "PM" : "AM"}</div>
    }
//print out task info in format [name - on {date} at {time}]
    return <div>{name} - on {month+1}/{day}/{year} at {hour >= 12 ? (hour-12):(hour)}:{minute <= 9 ? ('0'+minute) : minute} {hour >= 12 ? "PM" : "AM"}</div>
};

export default DateTime