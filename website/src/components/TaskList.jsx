import '../css/todo-list.css';

function TaskList(props) {

  return (
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {props.taskList}
      </ul>
  );
}

export default TaskList;
