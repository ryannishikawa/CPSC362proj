import { useEffect, useState } from "react";
import Todo from "./ToDo";
import Form from './Form';
import FilterButton from './FilterButton';
import { AuthBar } from '../components/AuthBar.jsx';
import { NavBar } from '../components/NavBar.jsx';
import { getAuth } from "firebase/auth";

const FILTER_MAP = {
  // functions to be used for filtering tasks
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
}
const FILTER_NAMES = Object.keys(FILTER_MAP);

function TaskList(props) {

  const auth = getAuth();
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState(props.tasks.map(task => ({ ...task, dueDate: new Date(task.dueDate) })));

  // Ensure updates to tasks are pushed to local storage
  useEffect(() => {
    localStorage.setItem("usertasks", JSON.stringify(tasks));
  }, [tasks]);


  function addTask(name, dueDate) {
    // Create task object
    const newTask = { id: -1, name, dueDate, completed: false, status: 'added' };
    //  Add the new task to the list of tasks
    setTasks([...tasks, newTask]);
  }

  function editTask(id, newName, newDueDate) {

    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName, dueDate: newDueDate, status: task.status === 'added' ? 'added' : 'updated' };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed, status: task.status === 'added' ? 'added' : 'updated' };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {

    // get all tasks other than this task
    const remainingTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, status: 'deleted' };
      }
      return task;
    });

    setTasks(remainingTasks);
  }

  const taskList = tasks
    .filter(task => task.status !== 'deleted' && FILTER_MAP[filter](task))
    .map((task) => (
        <Todo
            id={task.id}
            name={task.name}
            dueDate={task.dueDate?.toLocaleString()}
            dueDay={task.dueDate?.getDate()}
            dueHour={task.dueDate?.getHours()}
            dueAMPM={task.dueDate?.getHours() >= 12 ? "PM" : "AM"}
            dueMins={task.dueDate?.getMinutes()}
            completed={task.completed}
            status={task.status}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
        />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <AuthBar />
      <h1>Task List</h1>
      <NavBar auth={auth} />
      <Form addTask={addTask} />
      <div className="filters button-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>

    </div>
  );
}

export default TaskList;
