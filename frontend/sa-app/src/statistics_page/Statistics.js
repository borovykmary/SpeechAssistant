import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Statistics.css";
import { useNavigate } from "react-router-dom";
import LogoIconBlack from "../assets/logo-black.svg";
import arrow from "../assets/arrow-down-right.svg";
import ArrowIcon from "../assets/arrow-small-left.svg";

const Statistics = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/results/");
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task history:", err);
        setError("Failed to load task history.");
        setLoading(false);
      }
    };

    fetchTaskHistory();
  }, []);

  if (loading) {
    return <div className="statistics-container">Loading...</div>;
  }

  if (error) {
    return <div className="statistics-container">{error}</div>;
  }

  return (
    <div className="statistics-container">
      <div className="header-icons">
        <img
          src={ArrowIcon}
          alt="Arrow Icon"
          className="statistics-arrow"
          onClick={() => handleCardClick("/navigation")}
        />
        <div className="logo-stats">
          <img
            src={LogoIconBlack}
            alt="Speech Assistant Logo"
            className="statistics-logo"
          />
        </div>
      </div>
      <div className="statistics-header">
        <h3>Tasks History</h3>
      </div>
      <div className="tasks-list">
        {results.map((result, index) => (
          <div key={result.id || index} className="task-item">
            <div className="task-info">
              <div className="task-date">Date: {result.date || "Unknown"}</div>
              <div className="accuracy-info">
                <div className="task-accuracy-text">Accuracy: </div>
                <div className="task-accuracy"> accuracy percentage</div>{" "}
                {/* Add the accuracy percentage here, when algorithm finished*/}
              </div>
            </div>
            <img src={arrow} alt="arrow" className="task-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
