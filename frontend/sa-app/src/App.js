import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./navigation_page/Navigation";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/navigation" element={<Navigation />} />
      </Routes>
    </Router>
  );
};

export default App;
