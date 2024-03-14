import React, { useState } from "react";
import { HoursDropdown, MinsDropdown, AMPMdropdown, Example} from "./Time";


function Form(props) {

  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState('');

  function handleChange(event) {
    // Change text inside the task creation
    setName(event.target.value);
  }

  function handleSubmit(event) {
    // Creates a new task with the given text
    event.preventDefault();
    // Makes sure task text is not empty
    if (name !== "") {
      props.addTask(name, dueDate);
      // Clears input after adding task
      setName("");
      setDueDate(new Date());
    }
  }

  function SelectDueDate({ setDueDate }) {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedMins, setSelectedMins] = useState('');
  const [selectedAMPM, setSelectedAMPM] = useState('');

  // Function to format the selected due date and time
  function formatDueDate() {
    const formattedDate = startDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const formattedTime = `${selectedHours}:${selectedMins} ${selectedAMPM}`;
    return `${formattedDate} ${formattedTime}`;
  }

  // Function to handle adding the task with due date
  function handleAddTask() {
    const dueDate = formatDueDate();
    setDueDate(dueDate);
  }

  return (
    <div>
      Due Date: <Example setStartDate={setStartDate} /> <br />
      Due Time: <HoursDropdown setSelectedHours={setSelectedHours} />:
      <MinsDropdown setSelectedMins={setSelectedMins} />{' '}
      <AMPMdropdown setSelectedAMPM={setSelectedAMPM} />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
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
      <p id="new-todo-duedate"
         defaultValue={""}>
        <SelectDueDate setDueDate={setDueDate}/>
      </p>
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  )
}

export default Form;
