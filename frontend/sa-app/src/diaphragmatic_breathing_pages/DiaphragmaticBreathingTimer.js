import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DiaphragmaticBreathingTimer.css";
import logoIcon from "../assets/logo-black.svg";
import ArrowIconWhite from "../assets/arrow-small-left.svg";

const Timer = () => {
  const { timer: initialTimer } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(
    initialTimer
      .split(":")
      .reduce((min, sec) => parseInt(min) * 60 + parseInt(sec))
  );
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleQuit = () => {
    navigate("/meditations");
  };
  const handleClickOnArrow = () => {
    navigate("/diaphragmatic-breathing", { state: null });
  };
  return (
    <div className="app-container">
      <div className="container-478">
        <div className="header-icons-478">
          <img
            src={ArrowIconWhite}
            alt="Back"
            className="arrow-478"
            onClick={handleClickOnArrow}
          />
          <img src={logoIcon} alt="Logo" className="logo-478" />
        </div>

        <h2 className="header-478">Time left:</h2>

        <div className="timer-circle">
          <div className="timer-number">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button
            className="control-button"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
          <button className="control-button" onClick={handleQuit}>
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
