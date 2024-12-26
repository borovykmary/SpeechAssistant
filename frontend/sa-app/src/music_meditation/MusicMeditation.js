import React, { useState, useEffect, useRef } from "react";
import "./MusicMeditation.css";
import logoIcon from "../assets/logo.svg";
import MusicIcon from "../assets/music_bg.svg";
import ArrowIconWhite from "../assets/arrow-small-left-white.svg";
import { useNavigate } from "react-router-dom";
import audio_Chimera from "../assets/audios/audio_Chimera.mp3";
import audio_Pappa from "../assets/audios/audio_Pappa.mp3";
import audio_Through_Valleys from "../assets/audios/audio_Through_Valleys.mp3";

function MusicMeditation() {
  const [step, setStep] = useState(1); // 1: Choose music, 2: Play screen, 3: Timer screen
  const [timeLeft, setTimeLeft] = useState(180); // 3-minute timer
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Confirmation popup state
  const [selectedMusic, setSelectedMusic] = useState("");
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const handleCardClick = (route) => {
    setShowConfirm(true);
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

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  const handleQuit = () => {
    setStep(1);
    setTimeLeft(180);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  const handleConfirmLeave = () => {
    setShowConfirm(false);
    navigate("/navigation");
  };

  const handleCancelLeave = () => {
    setShowConfirm(false);
  };

  const handleMusicSelection = (e) => {
    setSelectedMusic(e.target.value);
    setStep(2);
  };

  const handlePlayClick = () => {
    setStep(3);
    setIsPlaying(true);
  };
  const audioFiles = {
    Chimera: audio_Chimera,
    Pappa: audio_Pappa,
    "Through Valleys": audio_Through_Valleys,
  };

  return (
    <div className="app-container-music">
      <div className="container-music">
        <div className="header-icons-music">
          <img
            src={ArrowIconWhite}
            alt="Arrow Icon"
            className="music-arrow"
            onClick={handleCardClick}
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
              onChange={(e) => setSelectedMusic(e.target.value)}
            >
              <option value="">Melodies</option>
              <option value="Chimera">Chimera</option>
              <option value="Pappa">Pappa</option>
              <option value="Through Valleys">Through Valleys</option>
            </select>
            <button
              className="next-step-button"
              disabled={!selectedMusic}
              onClick={() => setStep(2)}
            >
              →
            </button>
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
            {selectedMusic && (
              <audio ref={audioRef} src={audioFiles[selectedMusic]} loop />
            )}
            <div className="timer-circle">
              <span>{`${Math.floor(timeLeft / 60)}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}</span>
            </div>
            <div className="controls">
              <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={handleQuit}>Quit</button>
            </div>
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="confirmation-popup">
          <div className="popup-content">
            <p>
              Are you sure you want to leave? The progress will not be saved.
            </p>
            <div className="popup-actions">
              <button onClick={handleConfirmLeave}>Yes</button>
              <button onClick={handleCancelLeave}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicMeditation;
