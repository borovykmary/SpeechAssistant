import React from "react";
import "./WarningPopup.css"; // Ensure styling matches your design

const WarningPopup = ({ onCancel, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>
        <h3 className="popup-title">Confirm leaving the page</h3>
        <p className="popup-message">
          By clicking on this button your progress will not be saved.
        </p>
        <p className="popup-message">Still want to leave?</p>
        <button className="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default WarningPopup;
