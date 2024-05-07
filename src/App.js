/**
 * @file App.js
 * @author Kyle Ho <kyleho@csu.fullerton.edu>
 * @author Ryan Nishikawa <ryannishikawa48@csu.fullerton.edu>
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file is responsible for routing to specific pages within our app.
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./components/privateRoute";

import LoginPage from "./pages/login";
import Home from "./pages/home";
import RegisterPage from "./pages/register";
import ToDoListPage from "./pages/todo-list";
import SettingsPage from "./pages/settings";

const App = () => {
  return (
    <div className='center-content'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<ToDoListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;