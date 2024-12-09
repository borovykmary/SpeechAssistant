import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import WarningPopup from "./WarningPopup";
import "./SpecificTask.css";
import emotionDataMockup from "./emotionDataMockup";
import logo from "../assets/logo.svg";

const SpecificTask = ({ selectedEmotion = "confidence" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [confirmedAudio, setConfirmedAudio] = useState(null);
  const [feedback, setFeedback] = useState(null); // To hold feedback text

  const navigate = useNavigate();
  const emotion = emotionDataMockup[selectedEmotion] || emotionDataMockup["confidence"];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/ogg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);

        setShowConfirmationPopup(true);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationPopup(false);
    setAudioUrl("");
  };

  const handleConfirmAudio = () => {
    setShowConfirmationPopup(false);
    setConfirmedAudio(audioUrl);
    setFeedback("Great job! You pronounced the text clearly, but there were slight variations in the emotional tone. Keep practicing to align more closely with the intended emotion.");

  
    /*
    try {
      // Prepare FormData to send the audio
      const formData = new FormData();
      formData.append("audio", audioBlob, "recordedAudio.ogg"); // Attach the audio blob

      // Send the audio file to the backend API using a POST request
      const response = await fetch("/api/uploadAudio", {
        method: "POST",
        body: formData,  // Sending FormData with audio
      });

      if (response.ok) {
        console.log("Audio successfully sent to the backend.");
        // You can handle the response here, such as saving metadata or showing a success message
      } else {
        throw new Error("Audio upload failed.");
      }
    } catch (error) {
      console.error("Error sending audio:", error);
      setFeedback("There was an issue sending the audio. Please try again.");
    }
    */
  };

  const handleBackButtonClick = () => {
    setShowWarningPopup(true);
  };

  const handleCancelWarning = () => {
    setShowWarningPopup(false);
  };

  const handleConfirmWarning = () => {
    setShowWarningPopup(false);
    navigate("/tasks");
  };

  return (
    <div className="app-container">
      <div className="specific-task">
        <div className="task-header">
          <div className="back-button-container">
            <button className="back-button" onClick={handleBackButtonClick}>
              ←
            </button>
          </div>

          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <div className="title-container">
            <h2>{emotion.title}</h2>
          </div>
        </div>

        <div className="content-section">
          <div className="text-section">
            <h3>Text to reproduce:</h3>
            <p>{emotion.text}</p>
          </div>

          <div className="imitation-audio">
            <h3>How the emotion sounds like:</h3>
            <audio controls>
              <source src={emotion.audioSample} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        <div className="recording-section">
          <h3>Record your audio, pronouncing the given text clearly and attempting to reproduce the emotion:</h3>
          <div className="recording-button-container">
            <button
              className={`record-button ${isRecording ? "stop" : "start"}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "■ Stop" : "🎤 Record"}
            </button>
          </div>
        </div>

        {showConfirmationPopup && (
          <ConfirmationPopup
            audioUrl={audioUrl}
            onCancel={handleCancelConfirmation}
            onConfirm={handleConfirmAudio}
          />
        )}

        {showWarningPopup && (
          <WarningPopup onCancel={handleCancelWarning} onConfirm={handleConfirmWarning} />
        )}

        {/* Audio Playback and Feedback Section */}
        {confirmedAudio && (
          <>
            <div className="audio-playback">
              <h4>Your audio:</h4>
              <div className="audio-container">
                <audio controls>
                  <source src={confirmedAudio} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            <div className="feedback-section">
              <h3>Feedback to your attempt:</h3>
              <p>{feedback}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpecificTask;
