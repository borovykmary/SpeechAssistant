import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./navigation_page/Navigation";
import Login from "./login_page/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
