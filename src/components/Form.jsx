import { useState } from "react";

function Form(props) {

  const [name, setName] = useState("");

  function handleChange(event) {
    // Change text inside the task creation
    setName(event.target.value);
  }

  function handleSubmit(event) {
    // Creates a new task with the given text
    event.preventDefault();
    // Makes sure task text is not empty
    if (name !== "") {
      props.addTask(name);
      // Clears input after adding task
      setName("");
    }
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
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  )
}

export default Form;
