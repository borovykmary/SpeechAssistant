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
  const [task, setTask] = useState(null);  // State to store task details
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskById = async (resultId) => {
      try {
        const resultResponse = await axios.get(
          `http://localhost:8000/api/results/${resultId}/`
        );
        const resultData = resultResponse.data;

        // Fetch the task using the task ID from the result
        const taskResponse = await axios.get(
          `http://localhost:8000/api/tasks/${resultData.task}/`
        );
        const taskData = taskResponse.data;

        if (resultData.recoded_audio) {
          const audioBlob = new Blob([resultData.recoded_audio], {
            type: "audio/mpeg",
          });

          console.log("Audio Blob Created:", audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("Audio URL Created:", audioUrl);
          setAudioUrl(audioUrl);
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


   
  console.log("Result Data:", result);
  console.log("Voice Statistics:", result?.voice_statistics);
  console.log("Task Data:", task);

  const isVoiceStatLoaded = result?.voice_statistics && Object.keys(result.voice_statistics).length > 0;
  const hasValidEmotion = task?.emotion && result?.voice_statistics[task.emotion] !== undefined;

  console.log("isVoiceStatLoaded:", isVoiceStatLoaded);
  console.log("hasValidEmotion:", hasValidEmotion);
  

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
          <p>Name: {task?.task_description || "Unknown Task"}</p>  {/* Display task name */}
          <p>Task to work on emotion: {task.emotion || "Unknown Emotion"}</p>  {/* Display emotion */}
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

        {result.voice_statistics &&
          Object.keys(result.voice_statistics).length > 0 && (
            <div className="stats-det-bar">
              <p>
                Accuracy: {result.voice_statistics[task.emotion] || "Unknown"}%
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
