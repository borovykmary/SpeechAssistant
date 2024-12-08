import React, { useState } from "react";
import "./Meditations.css";
import logoIcon from "../assets/logo.svg";
import hamburgerIcon from "../assets/bars-3.svg";
import { useNavigate } from "react-router-dom";
import YogaBg from "../assets/yoga-girl.svg";
import arrowIcon from "../assets/arrow-right-circle.svg";

function Meditations() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="app-container-med">
      <div className="navigation-container-med">
        <header className="navigation-header-med">
          <img src={logoIcon} alt="Logo" className="logo-icon" />
          <img
            src={hamburgerIcon}
            alt="Menu"
            className="hamburger-icon"
            onClick={toggleMenu}
          />
        </header>
        {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
        <div
          className="slide-menu"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="top-rectangle"></div>
          <button className="close-btn" onClick={toggleMenu}>
            ✕
          </button>
          <div className="menu-content">
            <img src={logoIcon} alt="Logo" className="menu-logo" />
            <div className="menu-item">Profile Settings →</div>
            <div className="menu-item" onClick={() => handleCardClick("/")}>
              Home Page →
            </div>
            <div
              className="menu-item"
              onClick={() => handleCardClick("/navigation")}
            >
              Navigation Page →
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
        <img src={YogaBg} alt="Yoga Girl" className="background-svg" />
        <div className="cards-med-container">
          <div
            className="card-med card-med-big"
            style={{ gridRow: "1 / span 2", gridColumn: "1" }}
          >
            <div className="card-content">
              <div className="card-title">Mindfullness Meditation</div>

              <img src={arrowIcon} alt="Arrow" className="card-arrow" />
            </div>
          </div>
          <div
            className="card-med card-med-small"
            style={{ gridRow: "1", gridColumn: "2" }}
          >
            <div className="card-content">
              <div className="card-title">4-7-8 technique</div>

              <img src={arrowIcon} alt="Arrow" className="card-arrow" />
            </div>
          </div>
          <div
            className="card-med card-med-small"
            style={{ gridRow: "3", gridColumn: "1" }}
          >
            <div className="card-content">
              <div className="card-title">Music meditation</div>

              <img src={arrowIcon} alt="Arrow" className="card-arrow" />
            </div>
          </div>
          <div
            className="card-med card-med-big"
            style={{ gridRow: "2 / span 2", gridColumn: "2" }}
          >
            <div className="card-content">
              <div className="card-title">Diaphragmatic breathing</div>

              <img src={arrowIcon} alt="Arrow" className="card-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Meditations;
