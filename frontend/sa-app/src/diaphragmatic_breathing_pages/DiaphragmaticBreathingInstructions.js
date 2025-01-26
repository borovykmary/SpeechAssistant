import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./diaphragmaticBreathing.css";
import purple from "../assets/purple.svg";
import playIcon from "./assets/play.png";
import ArrowIconWhite from "../assets/arrow-small-left-purple.svg";
import logoIcon from "../assets/logo-black.svg";

const DiaphragmaticBreathingInstructions = () => {
  const [timer, setTimer] = useState("3:00");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/diaphragmatic-breathing-timer/${timer}`);
  };
  const handleClickOnArrow = () => {
    navigate("/meditations", { state: null });
  };


  return (
    <div className="instructions-page">
      <div className="instructions-content">
        <div className="header-diap">
          <img
            src={ArrowIconWhite}
            alt="Arrow Icon"
            className="arrow-diap"
            onClick={handleClickOnArrow}
          />
          <div className="logo-diap">
            <img src={logoIcon} alt="Speech Assistant Logo" className="logo-diap" />
          </div>
        </div>
        <div>
          <p>
            Lie down on a flat surface with a pillow under the head and pillows
            beneath the knees.
          </p>
          <p>Place one hand on the middle of the upper chest.</p>
          <p>
            Place the other hand on the stomach, just beneath the rib cage but
            above the diaphragm.
          </p>
          <p>
            To inhale, breathe slowly through the nose, drawing the breath
            toward the stomach. The stomach should push upward against the hand,
            while the chest remains still.
          </p>
          <p>
            To exhale, tighten the abdominal muscles and let the stomach fall
            downward while exhaling through pursed lips.
          </p>
        </div>
        <div className="timer-select">
          <label htmlFor="timer">Start timer for:</label>
          <select
            id="timer"
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
          >
            <option value="3:00">3:00 min</option>
            <option value="5:00">5:00 min</option>
            <option value="7:00">7:00 min</option>
          </select>
        </div>
        <button className="start-button" onClick={handleStart}>
          <img src={playIcon} alt="Start" />
        </button>
        <div className="illustration-container">
          <img src={purple} alt="Illustration" className="illustration" /> {}
        </div>
      </div>
    </div>
  );
};

export default DiaphragmaticBreathingInstructions;
