import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowIconWhite from "../assets/arrow-small-left-purple.svg";
import logoIcon from "../assets/logo-black.svg";
import "./StatisticsDetails.css";
import VoiceStatisticsBar from "./VoiceStatisticsBar";

const StaticticsDetails = () => {
  const location = useLocation();
  const { resultId } = location.state || {};
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskById = async (resultId) => {
      try {
        const mockData = {
          1: {
            id: 1,
            task: {
              id: 101,
              description: "Complete the project presentation",
            },
            date: "2025-01-15",
            emotion: "happy",
            voice_statistic: {
              fear: 9.63,
              calm: 67.24,
              happy: 4.64,
              sad: 2.25,
              disgust: 14.05,
              surprise: 0.84,
              angry: 0.72,
              neutral: 0.63,
            },
            ai_response_text:
              "Based on the analysis results, the dominant emotion is calmness at 67.24%, indicating a strong sense of serenity and relaxation. Fear is present at 9.63%, suggesting some underlying anxiety or worry. Disgust at 14.05% could point to feelings of aversion or dissatisfaction with certain aspects. Overall, the emotional tone reflects a mix of calmness with hints of fear and disgust, while happiness and anger are minimal.",
            audio_url:
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          },
          2: {
            id: 2,
            task: {
              id: 102,
              description: "Write a blog post about React",
            },
            date: "2025-01-14",
            emotion: "sad",
            voice_statistic: {
              happy: 25,
              sad: 75,
            },
          },
        };

        const taskDetails = mockData[resultId];
        if (!taskDetails) throw new Error("Task not found");

        setResult(taskDetails);
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

  if (!result) return <div>No task found for this ID.</div>;

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
          <p>Name: {result.task?.description || "Unknown Task"}</p>
          <p>Task to work on emotion: {result.emotion || "Unknown Emotion"}</p>
          <p>
            Accuracy: {result.voice_statistic[result.emotion] || "Unknown"}%
          </p>
        </div>
        

        <div className="stats-det-bar">
          <VoiceStatisticsBar voiceStatistic={result.voice_statistic} />
        </div>
        <div className="stats-det-audio">
          {result.audio_url ? (
            <div className="audio-container">
              <p className="audio-label">Your audio: </p>
              <audio controls className="audio-player">
                <source src={result.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
            </div>
          ) : (
            <p className="no-audio-message">
              No audio recording available for this task.
            </p>
          )}
        </div>
        <div className="ai-stats-det-feedback">
          <r>Feedback to your attempt:</r>
          <br />
          <t>{result.ai_response_text}</t>
        </div>
      </div>
    </div>
  );
};

export default StaticticsDetails;
