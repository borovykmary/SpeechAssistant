import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mindfulness.css";
import logo from "../assets/logo.svg";
import splash from "../assets/splash.svg";
import girlIllustration from "../assets/mindfulness_girl.svg";
import ArrowIconWhite from "../assets/arrow-small-left-white.svg";
import audioUrl from "../assets/audios/5_minute_mindfulness_meditation.mp3";

const Mindfulness = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/navigation");
    }

  return (
    <div className="mindfulness-container">
      <header className="mindfulness-header">
        <img
                    src={ArrowIconWhite}
                    alt="Arrow Icon"
                    className="mindfulness-arrow"
                    onClick={handleGoBack}
                  />
        <img src={logo} alt="Logo" className="mindfulness-logo" />
      </header>
      <div
        className="mindfulness-content"
        style={{
          backgroundImage: `url(${splash})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% -20%",
        }}
      >
        <h1 className="mindfulness-title">Mindfulness Meditation</h1>
        <p className="mindfulness-description">
          The audio provides instructions which will help you to calm,
          acknowledge, and accept the thoughts that pass through your mind. When
          you are ready, start the audio.
        </p>
        <audio controls src={audioUrl} className="mindfulness-audio-player">
          Your browser does not support the audio element.
        </audio>

        <div className="mindfulness-illustration">
          <img
            src={girlIllustration}
            alt="Girl meditating"
            className="mindfulness-girl-illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;