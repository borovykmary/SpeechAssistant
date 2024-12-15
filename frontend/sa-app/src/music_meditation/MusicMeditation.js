import React, { useState, useEffect } from "react";
import "./MusicMeditation.css";
import logoIcon from "../assets/logo.svg";
import MusicIcon from "../assets/music_bg.svg";
import ArrowIconWhite from "../assets/arrow-small-left-white.svg";
import { useNavigate } from "react-router-dom";

function MusicMeditation() {
  const [step, setStep] = useState(1); // 1: Choose music, 2: Play screen, 3: Timer screen
  const [timeLeft, setTimeLeft] = useState(180); // 3-minute timer
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState("");
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // State Handlers
  const handleMusicSelection = (e) => {
    setSelectedMusic(e.target.value);
    setStep(2); // Move to the play state
  };

  const handlePlayClick = () => {
    setStep(3); // Move to timer screen
    setIsPlaying(true);
  };

  return (
    <div className="app-container-music">
      <div className="container-music">
        <div className="header-icons-music">
          <img
            src={ArrowIconWhite}
            alt="Arrow Icon"
            className="music-arrow"
            onClick={() => handleCardClick("/navigation")}
          />
          <div className="logo-stats">
            <img
              src={logoIcon}
              alt="Speech Assistant Logo"
              className="music-logo"
            />
          </div>
        </div>
        <div className="music-header">
          <h3>Music Meditation</h3>
        </div>

        {/* Step 1: Choose Music */}
        {step === 1 && (
          <div className="music-selection">
            <img src={MusicIcon} alt="Music" className="background-music" />
            <h2>Choose the melody for your relaxation:</h2>
            <select
              className="dropdown"
              value={selectedMusic}
              onChange={handleMusicSelection}
            >
              <option value="">Melodies</option>
              <option value="Melody1">Label1</option>
              <option value="Melody2">Label2</option>
              <option value="Melody3">Label3</option>
              <option value="Melody4">Label4</option>
              <option value="Melody5">Label5</option>
            </select>
          </div>
        )}

        {/* Step 2: Play Screen */}
        {step === 2 && (
          <div className="play-screen">
            <img src={MusicIcon} alt="Music" className="background-music" />
            <p>
              Start playing, when you are ready. Close your eyes, feel the
              melody, and concentrate on the sound.
            </p>
            <button className="play-button" onClick={handlePlayClick}>
              ►
            </button>
          </div>
        )}

        {/* Step 3: Timer Screen */}
        {step === 3 && (
          <div className="timer-screen">
            <div className="timer-circle">
              <span>{`${Math.floor(timeLeft / 60)}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}</span>
            </div>
            <div className="controls">
              <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={() => setStep(1)}>Quit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicMeditation;
