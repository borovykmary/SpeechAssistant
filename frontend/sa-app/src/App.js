import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./navigation_page/Navigation";
import Login from "./login_page/Login";
import Register from "./register_page/Register";
import Tasks from "./tasks_page/Tasks";
import Landing from "./landing_page/Landing";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} /> {}
                <Route path="/navigation" element={<Navigation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    );
};

export default App;