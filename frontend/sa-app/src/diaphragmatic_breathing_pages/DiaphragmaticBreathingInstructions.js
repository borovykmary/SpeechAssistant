import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./diaphragmaticBreathing.css";
import logo from "./assets/logo.png";
import purple from "./assets/purple.png";
import playIcon from "./assets/play.png";
import illustration from "../assets/illustration.svg";

const DiaphragmaticBreathingInstructions = () => {
    const [timer, setTimer] = useState("3:00");
    const navigate = useNavigate();

    const handleStart = () => {
        navigate(`/diaphragmatic-breathing-timer/${timer}`);
    };

    return (
        <div className="instructions-page">
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
                <h1>Diaphragmatic Breathing</h1>
            </header>
            <div className="instructions-content">
                <ul>
                    <li>Lie down on a flat surface with a pillow under the head and pillows beneath the knees.</li>
                    <li>Place one hand on the middle of the upper chest.</li>
                    <li>
                        Place the other hand on the stomach, just beneath the rib cage but above the diaphragm.
                    </li>
                    <li>
                        To inhale, breathe slowly through the nose, drawing the breath toward the stomach. The stomach
                        should push upward against the hand, while the chest remains still.
                    </li>
                    <li>
                        To exhale, tighten the abdominal muscles and let the stomach fall downward while exhaling
                        through pursed lips.
                    </li>
                </ul>
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
                    <img src={playIcon} alt="Start"/>
                </button>
                <div className="illustration-container">
                    <img src={purple} alt="Illustration"
                         className="illustration"/> {}
                </div>
            </div>
        </div>
    );
};

export default DiaphragmaticBreathingInstructions;
