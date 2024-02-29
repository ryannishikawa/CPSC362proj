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
        <DropdownButton id="dropdown-button" title="Hour">
          <Dropdown.Item href="1">1</Dropdown.Item>
          <Dropdown.Item href="2">2</Dropdown.Item>
          <Dropdown.Item href="3">3</Dropdown.Item>
          <Dropdown.Item href="4">4</Dropdown.Item>
          <Dropdown.Item href="5">5</Dropdown.Item>
          <Dropdown.Item href="6">6</Dropdown.Item>
          <Dropdown.Item href="7">7</Dropdown.Item>
          <Dropdown.Item href="8">8</Dropdown.Item>
          <Dropdown.Item href="9">9</Dropdown.Item>
          <Dropdown.Item href="10">10</Dropdown.Item>
          <Dropdown.Item href="11">11</Dropdown.Item>
          <Dropdown.Item href="12">12</Dropdown.Item>
        </DropdownButton>
      );
}


export const MinsDropdown = () => {
    return (
        <DropdownButton id="dropdown-button" title="Hour">
          <Dropdown.Item href="0">00</Dropdown.Item>
          <Dropdown.Item href="1">01</Dropdown.Item>
          <Dropdown.Item href="2">02</Dropdown.Item>
          <Dropdown.Item href="3">03</Dropdown.Item>
          <Dropdown.Item href="4">04</Dropdown.Item>
          <Dropdown.Item href="5">05</Dropdown.Item>
          <Dropdown.Item href="6">06</Dropdown.Item>
          <Dropdown.Item href="7">07</Dropdown.Item>
          <Dropdown.Item href="8">08</Dropdown.Item>
          <Dropdown.Item href="9">09</Dropdown.Item>
          <Dropdown.Item href="10">10</Dropdown.Item>
          <Dropdown.Item href="11">11</Dropdown.Item>
          <Dropdown.Item href="12">12</Dropdown.Item>
          <Dropdown.Item href="13">13</Dropdown.Item>
          <Dropdown.Item href="14">14</Dropdown.Item>
          <Dropdown.Item href="15">15</Dropdown.Item>
          <Dropdown.Item href="16">16</Dropdown.Item>
          <Dropdown.Item href="17">17</Dropdown.Item>
          <Dropdown.Item href="18">18</Dropdown.Item>
          <Dropdown.Item href="19">19</Dropdown.Item>
          <Dropdown.Item href="20">20</Dropdown.Item>
          <Dropdown.Item href="21">21</Dropdown.Item>
          <Dropdown.Item href="22">22</Dropdown.Item>
          <Dropdown.Item href="23">23</Dropdown.Item>
          <Dropdown.Item href="24">24</Dropdown.Item>
          <Dropdown.Item href="25">25</Dropdown.Item>
          <Dropdown.Item href="26">26</Dropdown.Item>
          <Dropdown.Item href="27">27</Dropdown.Item>
          <Dropdown.Item href="28">28</Dropdown.Item>
          <Dropdown.Item href="29">29</Dropdown.Item>
          <Dropdown.Item href="30">30</Dropdown.Item>
          <Dropdown.Item href="31">31</Dropdown.Item>
          <Dropdown.Item href="32">32</Dropdown.Item>
          <Dropdown.Item href="33">33</Dropdown.Item>
          <Dropdown.Item href="34">34</Dropdown.Item>
          <Dropdown.Item href="35">35</Dropdown.Item>
          <Dropdown.Item href="36">36</Dropdown.Item>
          <Dropdown.Item href="37">37</Dropdown.Item>
          <Dropdown.Item href="38">38</Dropdown.Item>
          <Dropdown.Item href="39">39</Dropdown.Item>
          <Dropdown.Item href="40">40</Dropdown.Item>
          <Dropdown.Item href="41">41</Dropdown.Item>
          <Dropdown.Item href="42">42</Dropdown.Item>
          <Dropdown.Item href="43">43</Dropdown.Item>
          <Dropdown.Item href="44">44</Dropdown.Item>
          <Dropdown.Item href="45">45</Dropdown.Item>
          <Dropdown.Item href="46">46</Dropdown.Item>
          <Dropdown.Item href="47">47</Dropdown.Item>
          <Dropdown.Item href="48">48</Dropdown.Item>
          <Dropdown.Item href="49">49</Dropdown.Item>
          <Dropdown.Item href="50">50</Dropdown.Item>
          <Dropdown.Item href="51">51</Dropdown.Item>
          <Dropdown.Item href="52">52</Dropdown.Item>
          <Dropdown.Item href="53">53</Dropdown.Item>
          <Dropdown.Item href="54">54</Dropdown.Item>
          <Dropdown.Item href="55">55</Dropdown.Item>
          <Dropdown.Item href="56">56</Dropdown.Item>
          <Dropdown.Item href="57">57</Dropdown.Item>
          <Dropdown.Item href="58">58</Dropdown.Item>
          <Dropdown.Item href="59">59</Dropdown.Item>
        </DropdownButton>
      );
}


export const AMPMdropdown = () => {
    <DropdownButton id="dropdown-button" title="Hour">
          <Dropdown.Item href="AM">AM</Dropdown.Item>
          <Dropdown.Item href="PM">PM</Dropdown.Item>
        </DropdownButton>
}

export default DateTime