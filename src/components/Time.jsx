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
//  Date of last update: March 28, 2024
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
//   https://www.npmjs.com/package/react-datepicker
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

//function that creates a dropdown menu to select *month* for dueDate
// import {MonthDropdown} from "./Time"
export const MonthDropdown = ({setSelectedMonth}) => {
    var month12 = DateTime().getMonth();

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    }

    return (
        <select id="month-dropdown-button" title="Month" onChange={handleMonthChange} defaultValue={month[month12]}>
            <option value="">month</option>
            {[...Array(12)].map((_, index) => (
                <option value={month[index]}>
                    {month[index]}
                </option>
            ))}
        </select>
    )
}

//function that gets month from MonthDropdown to create a dropdown menu to select *date* for dueDate
// import {DateDropdown} from "./Time"
export const DateDropdown = ({selectedMonth, selectedYear, setSelectedDate}) => {
    var date = DateTime().getDate();

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }

    const getDaysInMonth = () => {
        switch (selectedMonth) {
            case "April":
            case "June":
            case "September":
            case "November":
                return 30;
            case "February":
                return (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0 ? 29 : 28;
            default:
                return 31;
        }
    }

    return (
        <select id="dropdown-button" title="Day" onChange={handleDateChange} defaultValue={date}>
            <option value="">day</option>
          {[...Array(getDaysInMonth())].map((_, index) => (
            <option value={index+1}>
              {index+1}
            </option>
          ))}
        </select>
    )
}

//function that creates a dropdown menu to select *year* for dueDate
// import {YearDropdown} from "./Time"
export const YearDropdown = ({setSelectedYear}) => {
    var thisYear = DateTime().getFullYear();

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    }

    return (
        <select id="dropdown-button" title="Year" onChange={handleYearChange} defaultValue={thisYear}>
          {[...Array(25)].map((_, index) => (
            <option value={index + thisYear - 12}>
                {index + thisYear - 12}
            </option>
          ))}
        </select>
      );
}

//*******
//funtion to return the selected dueDate
// import {getSelctedDueDate} from "./Time"
export const getSelctedDueTime = ({selectedHours, selectedMins, selectedAMPM}) => {
    if (selectedAMPM === "PM") {
        selectedHours += 12;
    }
    var dueDate = new Date(selectedHours, selectedMins);
    
    return dueDate;
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

  //function to set the status of a task(WIP)
  export const showStatus = (dueDate, hour, minute, complete) => {
    const currentDate = DateTime();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentDay = currentDate.getDate();

    if (!complete) {
        if (dueDate < currentDay || 
            (dueDate === currentDay && hour < currentHour) ||
            (dueDate === currentDay && hour === currentHour && minute < currentMinute)) {
                return <div>{dueDate-0} days left</div>;
        } else if (dueDate === currentDay && hour === currentHour && minute === currentMinute) {
            return <div style={{color: 'red'}}>NOW!!!!!</div>;
        } else if (dueDate === currentDay) {
            if (hour > currentHour) {
                return <div>{hour - currentHour} hours left</div>;
            } else if (hour === currentHour) {
                if (minute > currentMinute) {
                    return <div>{minute - currentMinute} minutes left</div>;
                } else {
                    return <div>done</div>;
                }
            } else {
                return <div>done</div>;
            }
        } else {
            return <div>{dueDate-0} days left</div>;
        }
    } else {
        return <div>done</div>;
    }
};

export default DateTime