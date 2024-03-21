import React, { useState } from "react";
import { HoursDropdown, MinsDropdown, AMPMdropdown, Example, defaultHours, defaultMinutes, defaultAMPM} from "./Time";



function Form(props) {

  const [name, setName] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState(12);
  const [selectedMins, setSelectedMins] = useState(0);
  const [selectedAMPM, setSelectedAMPM] = useState("AM");

  function handleChange(event) {
    // Change text inside the task creation
    setName(event.target.value);
  }

  function handleSubmit(event) {
    // Creates a new task with the given text
    event.preventDefault();
    // Makes sure task text is not empty
    if (name !== "") {
      const dueDate = getDueDate();
      props.addTask(name, dueDate);
      // Clears input after adding task
      setName("");
      setSelectedDueDate(selectedDueDate);
      setSelectedHours(selectedHours);
      setSelectedMins(selectedMins);
      setSelectedAMPM(selectedAMPM);
    }
  }

  function getDueDate() {
    const selectedDateTime = new Date(selectedDueDate);
    const hours = parseInt(selectedHours);
    const mins = parseInt(selectedMins);
    
    //ensure selected hours and minutes are valid integers
    if (isNaN(hours) || isNaN(mins)) {
      selectedDateTime.setHours(0);
      selectedDateTime.setMinutes(0);
    }

    //adjust hours based on AM/PM selection
    if (selectedAMPM === "PM") {
      selectedDateTime.setHours(hours === 12 ? 12 : hours + 12);
    } else {
      selectedDateTime.setHours(hours === 12 ? 0 : hours);
    }

    selectedDateTime.setMinutes(mins);
    selectedDateTime.setSeconds(0);
    return selectedDateTime;
  }


  return (
    <form onSubmit={handleSubmit}>
    <h2 className="label-wrapper">
      <label htmlFor="new-todo-input" className="label__lg">
        What needs to be done?
      </label>
    </h2>
    <input
      type="text"
      id="new-todo-input"
      className="input input__lg"
      name="text"
      autoComplete="off"
      value={name}
      onChange={handleChange}
    />
    <div>
      <label htmlFor="due-date-picker">Due Date:</label>
      <Example setStartDate={setSelectedDueDate} />
    </div>
    <div>
      <label htmlFor="due-time">Due Time:</label>
      <HoursDropdown setSelectedHours={setSelectedHours} />: <MinsDropdown setSelectedMins={setSelectedMins} /> <AMPMdropdown setSelectedAMPM={setSelectedAMPM} />
    </div>
    <button type="submit" className="btn btn__primary btn__lg">
      Add
    </button>
  </form>

  );
}

export default Form;
