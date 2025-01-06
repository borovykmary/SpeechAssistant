import React from "react";
import { useNavigate } from "react-router-dom";
import "./478Meditations.css";
import logo from "./assets/logo.png";

const Instructions = () => {
    const navigate = useNavigate();

    const startTimer = () => {
        navigate("/478-meditations-timer");
    };

    return (
        <div className="app-container">
            {}
            <div className="logo-container">
                <logo className="logo" />
            </div>

            <h1>4-7-8 Technique</h1>

            {}
            <ul className="instructions-list">
                <li>• Inhale for 4 seconds</li>
                <li>• Hold your breath for 7 seconds</li>
                <li>• Exhale for 8 seconds</li>
                <li>• Repeat 5 times</li>
            </ul>

            {}
            <button className="play-button" onClick={startTimer}>
                ▶
            </button>
        </div>
    );
};

export default Instructions;
