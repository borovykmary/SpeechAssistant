import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css";
import logoIcon from "../navigation_page/assets/logo.svg";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(33);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
        setTasks(response.data);
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
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <span className="task-number">0{index + 1}</span>
              <span className="task-title">Emotion: {task.emotion}</span>
              <span className="task-description">text variation {index + 1}</span>
            </div>
            <div className="arrow-icon">↘</div> {/* Arrow in bottom-right */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
