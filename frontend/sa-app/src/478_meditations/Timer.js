import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./478Meditations.css";
import logo from "./assets/logo.png";

const Timer = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState("Inhaling");
    const [timeLeft, setTimeLeft] = useState(4);
    const [cycle, setCycle] = useState(1);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 1) {
                    if (phase === "Inhaling") {
                        setPhase("Holding");
                        return 7;
                    } else if (phase === "Holding") {
                        setPhase("Exhaling");
                        return 8;
                    } else if (phase === "Exhaling") {
                        if (cycle === 5) {
                            setIsRunning(false);
                            return 0;
                        }
                        setCycle((prevCycle) => prevCycle + 1);
                        setPhase("Inhaling");
                        return 4;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, phase, cycle]);

    const handleQuit = () => {
        navigate("/meditations");
    };

    return (
        <div className="app-container">
            <div className="logo-container">
                <logo className="logo" />
            </div>
            <h1>4-7-8 Technique</h1>
            <p className="timer-phase">Now: <strong>{phase}</strong></p>
            <div className="timer-circle">
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
            <div className="timer-controls">
                <button className="control-button" onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? "Pause" : "Resume"}
                </button>
                <button className="control-button" onClick={handleQuit}>
                    Quit
                </button>
            </div>
        </div>
    );
};

export default Timer;
