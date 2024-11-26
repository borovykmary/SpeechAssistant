import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import Card from "./components/Card";
import hamburgerIcon from "./assets/bars-3.svg";
import logoIcon from "./assets/logo.svg";
import cardsBg from "./assets/cardsBg.svg";
import arrowIcon from "./assets/arrow-right-circle.svg";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="app-container">
      <div className="navigation-container">
        <header className="navigation-header">
          <img src={logoIcon} alt="Logo" className="logo-icon" />
          <img
            src={hamburgerIcon}
            alt="Menu"
            className="hamburger-icon"
            onClick={toggleMenu}
          />
        </header>
        <div className="background-image-container">
          <img src={cardsBg} alt="Background" className="background-image" />
        </div>
        <div className="cards-container">
          <Card
            className="card-statistics"
            title="Statistics Dashboard"
            icon={arrowIcon}
            onClick={() => handleCardClick("/statistics")}
          />
          <Card
            className="card-events"
            title="Events Calendar"
            description="description description description..."
            icon={arrowIcon}
            onClick={() => handleCardClick("/calendar")}
          />
          <Card
            className="card-meditations"
            title="Meditations"
            description="description description description..."
            icon={arrowIcon}
            onClick={() => handleCardClick("/meditations")}
          />
          <Card
            className="card-tasks"
            title="Tasks"
            description="description description description..."
            icon={arrowIcon}
            onClick={() => handleCardClick("/tasks")}
          />
        </div>
        {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
        <div
          className="slide-menu"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <button className="close-btn" onClick={toggleMenu}>
            ✕
          </button>
          <div className="menu-content">
            <img src={logoIcon} alt="Logo" className="menu-logo" />
            <div className="menu-item">Profile Settings →</div>
            <div className="menu-item" onClick={() => handleCardClick("/")}>
              Home Page →
            </div>
            <div className="user-avatar">AB</div>
            <button
              className="logout-btn"
              onClick={() => handleCardClick("/login")}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navigation;
