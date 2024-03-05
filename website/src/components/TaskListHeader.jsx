import '../css/todo-list.css';
import Form from "./Form";
import { DateTime, DateTimeFormat } from "./Time";

function TaskListHeader(props) {
  const tasksNoun = props.taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${props.taskList.length} ${tasksNoun} remaining`;

  return (
    <div>
      <DateTimeFormat></DateTimeFormat>
      <h1>Task List</h1>
      <Form addTask={props.addTask} />
      <div className="filters btn-group stack-exception">
        {props.filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
    </div>
  );
}

export default TaskListHeader;
