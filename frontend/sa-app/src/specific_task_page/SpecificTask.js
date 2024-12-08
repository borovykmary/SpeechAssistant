import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpecificTask.css";

const SpecificTask = ({ selectedEmotion = "confidence" }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [taskId, setTaskId] = useState(null);

  const navigate = useNavigate();


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

  // Upload audio file
  const uploadAudio = async () => {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "recordedAudio.ogg");

      const response = await fetch("http://localhost:3000/api/upload_audio/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Audio uploaded successfully:", result);
        setTaskId(result.task_id);
        setFeedback(`Audio uploaded successfully! Task ID: ${result.task_id}`);
        setUploadStatus("success");
      } else {
        const error = await response.json();
        console.error("Audio upload failed:", error);
        setFeedback("Audio upload failed. Please try again.");
        setUploadStatus("failure");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      setFeedback("There was an issue uploading the audio. Please try again.");
      setUploadStatus("failure");
    }
  };

  // Cancel audio playback
  const cancelRecording = () => {
    setAudioUrl("");
    setAudioBlob(null);
  };

  return (
    <div className="specific-task-container">
      <h2>Task: {selectedEmotion}</h2>

      <div className="recording-section">
        <button
          className={`record-button ${isRecording ? "stop" : "start"}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "■ Stop" : "🎤 Record"}
        </button>
      </div>

      {audioUrl && (
        <div className="audio-playback">
          <h3>Your recorded audio:</h3>
          <audio controls src={audioUrl}></audio>
          <div className="playback-actions">
            <button onClick={uploadAudio}>✅ Upload Audio</button>
            <button onClick={cancelRecording}>❌ Cancel</button>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`feedback-message ${uploadStatus}`}>
          <p>{feedback}</p>
          {taskId && <p>Task ID: {taskId}</p>}
        </div>
      )}

      <button onClick={() => navigate("/tasks")}>← Back to Tasks</button>
    </div>
  );
};

export default SpecificTask;
