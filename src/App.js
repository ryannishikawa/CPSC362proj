// import LoginPage from './pages/login';
import ToDoListPage from './pages/todo-list.jsx';

const DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

function App() {
  return(
    // <LoginPage />
    <ToDoListPage tasks={DATA} />
  );
}

export default App;
