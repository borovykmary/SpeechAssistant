import React from 'react';
import './Landing.css';
import logo from './assets/logo.png';
import illustration from './assets/illustration.svg';


function Landing() {
    return (
        <div className="landing-page">
            <header className="header">
                <img src={logo} alt="Speech Assistant Logo" className="logo"/>
                <h1>Introducing</h1>
                <h2 className="app-name">Speech Assistant</h2>
                <p className="description">
                    An application designed to help users who struggle with public presentations
                    improve their pronunciation, emotional expression, and manage performance anxiety
                    before and after speaking events.
                </p>
                <button className="get-started">Get Started</button>
            </header>
            <div className="illustration-container">
                <img src={illustration} alt="Illustration"
                     className="illustration"/> {}
            </div>
        </div>
    );
}

export default Landing;