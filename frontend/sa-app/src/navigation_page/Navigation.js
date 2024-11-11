// Navigation.js
import React, { useState } from "react";
import "./Navigation.css";
import Card from "./components/Card";
import hamburgerIcon from "./assets/bars-3.svg";
import logoIcon from "./assets/logo.svg";
import cardsBg from "./assets/cardsBg.svg";

const Navigation = () => {
  return (
    <div className="navigation-container">
      <header className="navigation-header">
        <img src={hamburgerIcon} alt="Menu" className="hamburger-icon" />
        <img src={logoIcon} alt="Logo" className="logo-icon" />
      </header>
      <div className="background-image-container">
        <img src={cardsBg} alt="Background" className="background-image" />
      </div>
      <div className="cards-container">
        <Card
          className="card-statistics"
          title="Statistics"
          description="View your stats"
        />
        <Card
          className="card-events"
          title="Events"
          description="description description..."
        />
        <Card
          className="card-meditations"
          title="Meditations"
          description="description description description..."
        />
        <Card
          className="card-tasks"
          title="Tasks"
          description="description description description..."
        />
      </div>
    </div>
  );
};
export default Navigation;
