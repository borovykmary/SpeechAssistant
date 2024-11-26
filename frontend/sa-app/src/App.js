import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./navigation_page/Navigation";
import Login from "./login_page/Login";
import Register from "./register_page/Register";
import Tasks from "./tasks_page/Tasks";
import SpecificTask from "./specific_task_page/SpecificTask";
import Landing from "./landing_page/Landing";
import Statistics from "./statistics_page/Statistics";
import Meditations from "./meditations_page/Meditations";
import Calendar from "./calendar_page/Calendar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {}
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/specific-task" element={<SpecificTask />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
};
export default App;
