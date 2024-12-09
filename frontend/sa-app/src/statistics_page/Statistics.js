import React from "react";
import "./Statistics.css";
import logo from "../assets/logo.svg";
import arrow from "../assets/arrow-down-right.svg";

// mock data
const taskData = [
  { date: "20.11.2024", accuracy: "80%" },
  { date: "14.11.2024", accuracy: "60%" },
  { date: "30.10.2024", accuracy: "70%" },
  { date: "18.10.2024", accuracy: "50%" },
];

const Statistics = () => {
  return (
    <div className="statistics-container">
      <div className="logo-stats">
        <img src={logo} alt="Speech Assistant Logo" className="statistics-logo" />
      </div>
      <div className="statistics-header">
        <h3>Tasks History</h3>
      </div>
      <div className="tasks-list">
        {taskData.map((task, index) => (
          <div key={index} className="task-item">
            <div className="task-info">
                <div className="task-date">{task.date}</div>
                <div className="accuracy-info">
                    <div className="task-accuracy-text">Accuracy: </div>
                    <div className="task-accuracy">{task.accuracy}</div>
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