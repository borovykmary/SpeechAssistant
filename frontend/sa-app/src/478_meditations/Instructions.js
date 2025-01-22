import React from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css";
import logoIcon from "../assets/logo-black.svg";
import ArrowIconWhite from "../assets/arrow-small-left.svg";

const Instructions = () => {
  const navigate = useNavigate();

  const startTimer = () => {
    navigate("/478-meditations-timer");
  };

  const handleArrowClick = () => {
    navigate("/meditations");
  };

  return (
    <div className="app-container">
      <div className="container-478">
        <div className="header-icons-478">
            <img
              src={ArrowIconWhite}
              alt="Arrow Icon"
              className="arrow-478"
              onClick={handleArrowClick}
            />
              <img
                src={logoIcon}
                alt="Speech Assistant Logo"
                className="logo-478"
              />
        </div>
        <h2 className="header-478">4-7-8 Technique</h2>
        <div className="instructions-list">
          <p>• Inhale for 4 seconds.</p>
          <p>• Hold your breath for 7 seconds.</p>
          <p>• Exhale for 8 seconds.</p>
          <p>• Repeat 5 times.</p>
        </div>
        <button className="play-button" onClick={startTimer}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default Instructions;
