import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css";
import logoIcon from "../navigation_page/assets/logo.svg";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(33); // Progress is 33% by default

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
        setTasks(response.data);
        // Optionally calculate progress based on tasks
        const progressPercentage = (response.data.length / 4) * 100; // Assuming 4 tasks is 100%
        setProgress(Math.min(progressPercentage, 100));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header">
        <img src={logoIcon} alt="Logo" className="logo" />
        <h1>
          Let's start training your ability to <strong>express emotions!</strong>
        </h1>
        <p>Choose the task first.</p>

        {/* Progress Bar */}
        <div className="progress-container">
          <span className="progress-text">Your progress {progress}%</span>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
            {[5, 33, 66, 95].map((dotProgress, index) => (
              <div
                key={index}
                className="progress-bar-dot"
                style={{
                  left: `${dotProgress}%`,
                  transform: `translateX(-50%)`,
                  position: "absolute",
                }}
              ></div>
            ))}
          </div>
        </div>
      </header>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <span className="task-number">0{index + 1}</span>
              <span className="task-title">Emotion: {task.emotion}</span>
              <span className="task-description">{task.task_description}</span>
            </div>
            <div className="arrow-icon">↘</div> {/* Arrow in bottom-right */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
