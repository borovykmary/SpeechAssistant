import React from 'react';
import './PopupTemplate.css';

const ConfirmationPopup = ({ audioUrl, onCancel, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onCancel}>&times;</button>
        <h3>Confirm the audio</h3>
        <p>
          By confirming recorded audio, it will be sent to AI analysis. In a few moments, feedback will be generated.
        </p>
        <audio controls src={audioUrl} className="audio-player">
          Your browser does not support the audio element.
        </audio>
        <button className="confirm-button" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
