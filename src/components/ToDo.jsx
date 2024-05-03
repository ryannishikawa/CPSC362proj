
import { useState } from "react";
import { HoursDropdown, MinsDropdown, AMPMdropdown, Example, DateTime} from "./Time";

function Todo(props) {

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState((DateTime().getHours() + 1) > 12 ? (DateTime().getHours() - 11) : (DateTime().getHours() + 1));
  const [selectedMins, setSelectedMins] = useState(0);
  const [selectedAMPM, setSelectedAMPM] = useState(DateTime().getHours() >= 12 ? "PM" : "AM");



  function handleChange(event) {
    setNewName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newDueDate = getDueDate();
    props.editTask(props.id, newName, newDueDate);
    setNewName(newName);
    setSelectedDueDate(selectedDueDate);
    setSelectedHours(selectedHours);
    setSelectedMins(selectedMins);
    setSelectedAMPM(selectedAMPM);
    setEditing(false);
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

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
        <label className="todo-label" htmlFor={props.id}>
          New due date for {props.name}
          <div>
            <label htmlFor="due-date-picker">Due Date:</label>
              <Example setStartDate={setSelectedDueDate} initialDate={selectedDueDate} />
          </div>
          <div>
            <label htmlFor="due-time">Due Time:</label>
              <HoursDropdown setSelectedHours={setSelectedHours} initialValue={selectedDueDate.getHours()}/>: 
              <MinsDropdown setSelectedMins={setSelectedMins} initialValue={selectedDueDate.getMinutes()}/> 
              <AMPMdropdown setSelectedAMPM={setSelectedAMPM} initialValue={selectedDueDate.getHours() >= 12 ? "PM" : "AM"}/>
          </div>
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name} - Due: {props.dueDate}
          
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}>
          Edit
          <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete
          <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
