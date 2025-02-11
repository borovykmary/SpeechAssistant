import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";
import WarningPopup from "./WarningPopup";
import "./SpecificTask.css";
import logo from "../assets/logo.svg";
import Cookies from 'js-cookie';
import { mirage } from 'ldrs'


const SpecificTask = () => {
  const { taskId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [emotion, setEmotion] = useState(null); // To hold fetched emotion data
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [confirmedAudio, setConfirmedAudio] = useState(null);
  const [feedback, setFeedback] = useState(null); // To hold feedback text
  const [responseReceived, setResponseReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  mirage.register('mirage-spinner')

  useEffect(() => {
    // Fetch the task data based on taskId
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
        const data = await response.json();
        setEmotion(data);
        console.log("Task data fetched:", data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [taskId]);

  useEffect(() => {
    if (emotion && emotion.audio_sample) {
      const byteCharacters = atob(emotion.audio_sample);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  }, [emotion]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setMediaRecorder(recorder);
  
      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
  
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
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
    analyzeAndUploadAudio(audioBlob);
  };

  const analyzeAndUploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.wav');
    formData.append('emotion', emotion.emotion);

    try {
      setIsLoading(true);
      const analysisResponse = await fetch('http://127.0.0.1:8000/api/analyze_audio/', {
        method: 'POST',
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error(`Server error: ${analysisResponse.statusText}`);
      }

      const analysisResult = await analysisResponse.json();
      console.log("Analysis result:", analysisResult);
      setFeedback(analysisResult.llm_response);

      // Prepare data for upload
      const uploadFormData = new FormData();
      uploadFormData.append('task_id', taskId);
      uploadFormData.append('audio_file', audioBlob, 'recording.wav');
      const userId = Cookies.get('user_id');
      uploadFormData.append('user_id', userId);
      uploadFormData.append('voice_statistics', JSON.stringify(analysisResult.voice_analysis)); 
      uploadFormData.append('llm_response', analysisResult.llm_response); 

      // Upload data
      const uploadResponse = await fetch('http://127.0.0.1:8000/api/upload_audio/', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Server error: ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);
      setResponseReceived(true);
    } catch (error) {
      console.error("Error analyzing or uploading audio:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTryAgain = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setResponseReceived(false);
    setConfirmedAudio(null);
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

  

  if (!emotion) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="app-container">
      {isLoading && (
        <div className="loading-overlay">
          <mirage-spinner color='#464694' size='116' speed="4.0"></mirage-spinner>
        </div>
      )}
      <div className={`specific-task ${isLoading ? 'blurred' : ''}`}>
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
            <h2>{emotion.task_description}</h2>
          </div>
        </div>

        <div className="content-section">
          <div className="text-section">
            <h3>Text to reproduce:</h3>
            <p>{emotion.text_sample}</p>
          </div>

          <div className="imitation-audio">
            <h3>How the emotion sounds like:</h3>
            {console.log("Emotion Audio Sample URL:", emotion.audio_sample)}
            {audioUrl && (
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
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
            {console.log("Confirmed Audio URL:", confirmedAudio)}
            <div className="audio-playback">
              <h4>Your audio:</h4>
              <div className="audio-container">
                <audio controls>
                  <source src={confirmedAudio} type="audio/wav" />
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
        {responseReceived && (
            <button className="try-again-button" onClick={handleTryAgain}>
              Try Again!
            </button>
          )}
      </div>
    </div>
  );
};

export default SpecificTask;