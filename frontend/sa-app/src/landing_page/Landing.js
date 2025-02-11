import React from 'react';
import './Landing.css';
import logoIconBlack from '../assets/logo-black.svg';
import illustration from '../assets/illustration.svg';
import { useNavigate } from "react-router-dom";


function Landing() {
    const navigate = useNavigate();
    const getStarted = () => {
        navigate("/login")
    };

    return (
        <div className="landing-page">
            <header className="header">
                <img src={logoIconBlack} alt="Speech Assistant Logo" className="logo-landing"/>
                <h1>Introducing</h1>
                <h2 className="app-name">Speech Assistant</h2>
                <p className="description">
                    An application designed to help users who struggle with public presentations
                    improve their pronunciation, emotional expression, and manage performance anxiety
                    before and after speaking events.
                </p>
                <button className="get-started" onClick={getStarted}>Get Started</button>
            </header>
            <div className="illustration-container">
                <img src={illustration} alt="Illustration"
                     className="illustration"/> {}
            </div>
        </div>
    );
}

export default Landing;
