// Import React and ReactDOM components to persist throughout the application
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import all CSS styles
import './index.css';
import './css/defaults.css';
import './css/todo-list.css';

// Import the app and web vitals
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <script src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
