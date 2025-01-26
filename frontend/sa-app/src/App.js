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
import Instructions from "./478_meditations/Instructions";
import Timer from "./478_meditations/Timer";
import ProfilePage from "./profile_page/Profile";
import Mindfulness from "./mindfulness_page/Mindfulness";
import StaticticsDetails from "./statistics_details_page/StatisticsDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {}
          <Route path="/profile-page" element={
              <ProtectedRoute><ProfilePage /> </ProtectedRoute>} /> {}
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
         <Route path="/478-meditations" element={
              <ProtectedRoute>
              <Instructions />
              </ProtectedRoute>} />

          <Route path="/478-meditations-timer" element={
              <ProtectedRoute>
              <Timer />
              </ProtectedRoute>} />
          <Route
          path="/mindfulness"
          element={
            <ProtectedRoute>
              <Mindfulness />
            </ProtectedRoute>
          }
        />
          <Route path="/statistics-details" element={
              <ProtectedRoute>
              <StaticticsDetails />
              </ProtectedRoute>} />
      </Routes>
    </Router>
  );
};
export default App;
