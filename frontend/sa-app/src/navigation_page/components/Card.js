// src/components/Card.js
import React from "react";
import "./Card.css";

const Card = ({ icon, title, description, className }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-hover-overlay"></div>
      <div className="card-icon">
        {icon && <img src={icon} alt={`${title} icon`} />}
      </div>
    </div>
  );
};

export default Card;
