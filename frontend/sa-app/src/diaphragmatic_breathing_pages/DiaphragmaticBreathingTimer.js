import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./diaphragmaticBreathing.css";
import pauseIcon from "./assets/pause.png";
import quitIcon from "./assets/quit.png";

const DiaphragmaticBreathingTimer = () => {
    const { timer: initialTimer } = useParams();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(
        initialTimer.split(":").reduce((min, sec) => parseInt(min) * 60 + parseInt(sec))
    );
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="timer-page">
            <header className="header">
                <h1>Diaphragmatic Breathing</h1>
            </header>
            <div className="timer-container">
                <div className="time-display">{formatTime(timeLeft)}</div>
                <div className="controls">
                    <button onClick={() => setIsRunning(!isRunning)}>
                        <img src={pauseIcon} alt={isRunning ? "Pause" : "Resume"} />
                    </button>
                    <button onClick={() => navigate("/meditations")}>
                        <img src={quitIcon} alt="Quit" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiaphragmaticBreathingTimer;
