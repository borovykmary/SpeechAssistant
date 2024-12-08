import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css";
import hamburgerIconBlack from "../navigation_page/assets/bars-3-black.svg";
import logoIconBlack from "../navigation_page/assets/logo-black.svg";
import logoIcon from "../navigation_page/assets/logo.svg";
import { useNavigate } from "react-router-dom";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(33); 
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
        setTasks(response.data);
      
        const progressPercentage = (response.data.length / 4) * 100; 
        setProgress(Math.min(progressPercentage, 100));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="app-container">
    <div className="tasks-container">
  
      <header className="tasks-header">
        <img src={logoIconBlack} alt="Logo" className="logo-icon" />
        <img
          src={hamburgerIconBlack}
          alt="Menu"
          className="hamburger-icon"
          onClick={toggleMenu}
        />
        </header>
        <p className="tasks-text">
          Let's start training your ability to <strong>express emotions!</strong>
               Choose the task first.
        </p>
      
    
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
      

        {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
        <div
          className="slide-menu"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="top-rectangle"></div>
          <button className="close-btn" onClick={toggleMenu}>
            ✕
          </button>
          <div className="menu-content">
            <img src={logoIcon} alt="Logo" className="menu-logo" />
            <div className="menu-item">Profile Settings →</div>
            <div className="menu-item" onClick={() => handleCardClick("/")}>
              Home Page →
            </div>
            <div className="user-avatar">AB</div>
            <button
              className="logout-btn"
              onClick={() => handleCardClick("/login")}
            >
              Log Out
            </button>
          </div>
        </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <span className="task-number">0{index + 1}</span>
              <span className="task-title">Emotion: {task.emotion}</span>
              <span className="task-description">{task.task_description}</span>
            </div>
            <div className="arrow-icon">↘</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TasksPage;
