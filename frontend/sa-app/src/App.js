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
import ProtectedRoute from "./authorization/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {}
        <Route path="/navigation" element={<ProtectedRoute> <Navigation /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<ProtectedRoute> <Tasks /> </ProtectedRoute>}/>
        <Route path="/specific-task" element={<ProtectedRoute><SpecificTask /> </ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><Statistics /> </ProtectedRoute>} />
        <Route path="/meditations" element={<ProtectedRoute><Meditations /> </ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};
export default App;
