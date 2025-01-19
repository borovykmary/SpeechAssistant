import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Statistics.css";
import { useNavigate } from "react-router-dom";
import LogoIconBlack from "../assets/logo-black.svg";
import arrow from "../assets/arrow-down-right.svg";
import hamburgerIcon from "../assets/bars-3-purple.svg";
import Cookies from "js-cookie";
import logoIcon from "../assets/logo.svg";

const Statistics = () => {
  const [results, setResults] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCardClick = (resultId) => {
    navigate("/statistics-details", {
      state: { resultId }, 
    });
  };

  const handleLogout = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      console.log("Logout successful:", response);
      Cookies.remove("sessionid");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // useEffect(() => {
  //   const fetchResultsAndTasks = async () => {
  //     try {
  //       const resultsResponse = await axios.get(
  //         "http://127.0.0.1:8000/api/results/"
  //       );
  //       const fetchedResults = resultsResponse.data;

  //       const uniqueTaskIds = [
  //         ...new Set(fetchedResults.map((result) => result.task)),
  //       ];

  //       const tasksMap = {};
  //       await Promise.all(
  //         uniqueTaskIds.map(async (taskid) => {
  //           try {
  //             const taskResponse = await axios.get(
  //               `http://127.0.0.1:8000/api/tasks/${taskid}/`
  //             );
  //             tasksMap[taskid] = taskResponse.data.task_description;
  //           } catch (err) {
  //             console.error(`Error fetching task for taskid ${taskid}:`, err);
  //           }
  //         })
  //       );

  //       setResults(fetchedResults);
  //       setTasksMap(tasksMap);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching results or tasks:", err);
  //       setError("Failed to load task history.");
  //       setLoading(false);
  //     }
  //   };

  //   fetchResultsAndTasks();
  // }, []);

  useEffect(() => {
    const fetchResultsAndTasks = async () => {
      try {
        const fetchedResults = [
          {
            id: 1,
            task: 101,
            date: "2025-01-15",
            emotion: "happy",
            voice_statistic: '{"happy": 92, "sad": 8}',
          },
          {
            id: 2,
            task: 102,
            date: "2025-01-14",
            emotion: "sad",
            voice_statistic: '{"happy": 25, "sad": 75}',
          },
          {
            id: 3,
            task: 103,
            date: "2025-01-13",
            emotion: "angry",
            voice_statistic: '{"happy": 10, "angry": 90}',
          },
          {
            id: 4,
            task: 101,
            date: "2025-01-15",
            emotion: "happy",
            voice_statistic: '{"happy": 92, "sad": 8}',
          },
          {
            id: 5,
            task: 102,
            date: "2025-01-14",
            emotion: "sad",
            voice_statistic: '{"happy": 25, "sad": 75}',
          },
          {
            id: 6,
            task: 103,
            date: "2025-01-13",
            emotion: "angry",
            voice_statistic: '{"happy": 10, "angry": 90}',
          },
        ];

        const tasksMap = {
          101: "Complete the project presentation",
          102: "Write a blog post about React",
          103: "Prepare for the team meeting",
        };

        setResults(fetchedResults);
        setTasksMap(tasksMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results or tasks:", err);
        setError("Failed to load task history.");
        setLoading(false);
      }
    };

    fetchResultsAndTasks();
  }, []);

  if (loading) {
    return <div className="statistics-container">Loading...</div>;
  }

  if (error) {
    return <div className="statistics-container">{error}</div>;
  }

  return (
    <div className="app-container">
      <div className="statistics-container">
        <header className="statistics-header">
          <div className="logo-stats">
            <img
              src={LogoIconBlack}
              alt="Speech Assistant Logo"
              className="statistics-logo"
            />
          </div>
          <div className="hamburger-icon">
            <img
              src={hamburgerIcon}
              alt="Menu"
              className="hamburger-icon"
              onClick={toggleMenu}
            />
          </div>
        </header>

        <div className="statistics-tittle">
          <h3>Tasks History</h3>
        </div>
        <div className="tasks-list">
          {results.map((result, index) => {
            let voiceStatistics = {};
            try {
              voiceStatistics = JSON.parse(result.voice_statistic || "{}");
            } catch (err) {
              console.error("Error parsing voice_statistic:", err);
            }

            const emotion = result.emotion;
            const emotionAccuracy = voiceStatistics[emotion] || "N/A";

            return (
              <div key={result.id || index} className="task-item">
                <div className="task-info">
                  <div className="task-date">
                    Date: {result.date || "Unknown"}
                  </div>
                  <div className="task-name">
                    Task: {tasksMap[result.task] || "Loading..."}
                  </div>
                  <div className="accuracy-info">
                    <div className="task-accuracy-text">Accuracy: </div>
                    <div className="task-accuracy">{emotionAccuracy}</div>
                  </div>
                </div>
                <img
                  src={arrow}
                  alt="arrow"
                  className="task-arrow"
                  onClick={() => handleCardClick(result.id)}
                />
              </div>
            );
          })}
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
            <div
              className="menu-item"
              onClick={() => navigate("/navigation")}
            >
              Home Page →
            </div>
            <div className="user-avatar">AB</div>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
