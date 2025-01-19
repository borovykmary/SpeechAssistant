import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowIconWhite from "../assets/arrow-small-left-purple.svg";
import logoIcon from "../assets/logo-black.svg";
import "./StatisticsDetails.css";
import VoiceStatisticsBar from "./VoiceStatisticsBar";

const StatisticsDetails = () => {
  const location = useLocation();
  const { resultId } = location.state || {};
  const [result, setResult] = useState(null);
  const [task, setTask] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskById = async (resultId) => {
      try {
        const resultResponse = await axios.get(
          `http://localhost:8000/api/results/${resultId}/`,
        );
        const resultData = resultResponse.data;

        const taskResponse = await axios.get(
          `http://localhost:8000/api/tasks/${resultData.task}/`
        );
        const taskData = taskResponse.data;

        // Handle audio if available
        if (resultData.recoded_audio) {
          const byteCharacters = atob(resultData.recoded_audio);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(blob);
          setAudioUrl(audioUrl); // Set the audio URL for playback
        }

        setResult(resultData);
        setTask(taskData);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching task for resultId ${resultId}:`, err);
        setError("Failed to load the task.");
        setLoading(false);
      }
    };

    if (resultId) {
      fetchTaskById(resultId);
    }
  }, [resultId]);

  const handleClickOnArrow = () => {
    navigate("/statistics", { state: null });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
      <div className="statistics-details-container">
        <header className="header-statistics-details">
          <img
            src={ArrowIconWhite}
            alt="Arrow Icon"
            className="det-stat-arrow"
            onClick={handleClickOnArrow}
          />
          <div className="logo-stats">
            <img
              src={logoIcon}
              alt="Speech Assistant Logo"
              className="det-stat-logo"
            />
          </div>
        </header>
        <div className="stats-det-title">
          <h2>Task from {result.date || "Unknown Date"}</h2>
        </div>
        <div className="stats-det-info">
          <p>Name: {task?.task_description || "Unknown Task"}</p>
          <p>Task to work on emotion: {task.emotion || "Unknown Emotion"}</p>
        </div>

        {/* Audio Section */}
        <div className="stats-det-audio">
          {audioUrl ? (
            <div className="audio-container">
              <p className="audio-label">Your audio: </p>
              <audio controls className="audio-player">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="no-audio-message">
              NO AUDIO RECORDING AVALIABLE FOR THIS TASK.
            </p>
          )}
        </div>

        {Object.keys(result.voice_statistics).length > 0 && (
          <div className="stats-det-bar">
            <p>
              {(() => {
                const parsedVoiceStatistics =
                  typeof result.voice_statistics === "string"
                    ? JSON.parse(result.voice_statistics)
                    : result.voice_statistics;

                if (task.emotion in parsedVoiceStatistics) {
                  return `Accuracy: ${
                    parsedVoiceStatistics[task.emotion] || "Unknown"
                  }%`;
                } else {
                  const [mostProminentEmotion] = Object.entries(
                    parsedVoiceStatistics
                  ).reduce((a, b) =>
                    parseFloat(a[1]) > parseFloat(b[1]) ? a : b
                  );
                  console.log("Most prominent emotion:", mostProminentEmotion);
                  return `Most prominent emotion: ${mostProminentEmotion}`;
                }
              })()}
            </p>
            <VoiceStatisticsBar voiceStatistic={result.voice_statistics} />
          </div>
        )}

        {result.ai_response_text && (
          <div className="ai-stats-det-feedback">
            <p>Feedback to your attempt:</p>
            <div className="ai-stats-det-feedback-text-container">
              <p>{result.ai_response_text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsDetails;
