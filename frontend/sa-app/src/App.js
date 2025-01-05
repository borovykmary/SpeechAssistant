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
import DiaphragmaticBreathingInstructions from "./diaphragmatic_breathing_pages/DiaphragmaticBreathingInstructions";
import DiaphragmaticBreathingTimer from "./diaphragmatic_breathing_pages/DiaphragmaticBreathingTimer";
import MusicMeditation from "./music_meditation/MusicMeditation";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {}
        <Route
          path="/navigation"
          element={
            <ProtectedRoute>
              {" "}
              <Navigation />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              {" "}
              <Tasks />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/specific-task/:taskId"
          element={
            <ProtectedRoute>
              <SpecificTask />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/meditations"
          element={
            <ProtectedRoute>
              <Meditations />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diaphragmatic-breathing"
          element={
            <ProtectedRoute>
              <DiaphragmaticBreathingInstructions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diaphragmatic-breathing-timer/:timer"
          element={
            <ProtectedRoute>
              <DiaphragmaticBreathingTimer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/music-meditation"
          element={
            <ProtectedRoute>
              <MusicMeditation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
