import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import logo from "../assets/logo.svg";
import calendar from "../assets/calendar.svg";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDescription, setEventDescription] = useState("Description of your event");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isMeditationChecked, setMeditationChecked] = useState(false);
  const [meditationDates, setMeditationDates] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [events, setEvents] = useState({}); 

  const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
  
    const toggleMenu = () => {
      setMenuOpen((prev) => !prev);
    };

    const handleCardClick = (route) => {
      navigate(route);
    };

  useEffect(() => {
    handleGetEvents();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDateBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors } = {}) => {
    try {
      const csrfToken = getCookie("csrftoken");
      const response = await axios.post(
        "http://localhost:8000/api/schedule_event/",
        values,
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken || "" },
        }
      );
      console.log("Event submitted successfully:", response.data);
      alert("Event successfully added!");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error response from backend:", error.response.data);
        setErrors(error.response.data);
      } else {
        console.error("Submission error:", error);
        alert("An error occurred while adding the event.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddEvent = () => {
    const payload = {
      event_date: formatDateBackend(selectedDate),
      description: eventDescription.trim() || "No description provided.",
      suggestMeditations: isMeditationChecked,
    };
  
    console.log("Adding event with payload:", payload);
  
    handleSubmit(payload, {
      setSubmitting: () => console.log("Submitting..."),
      setErrors: (errors) => console.error("Validation errors:", errors),
    });
  
    setEvents((prevEvents) => {
      const dateKey = selectedDate.toDateString();
      const updatedEvents = { ...prevEvents };
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = [];
      }
      updatedEvents[dateKey].push(payload);
      return updatedEvents;
    });
  
    setEventDates((prevEventDates) => [...prevEventDates, selectedDate.toDateString()]);
  
    if (isMeditationChecked) {
      const meditationMarkers = [];
      for (let i = -4; i <= 1; i++) {
        if (i === 0) continue;
        const meditationDate = new Date(selectedDate);
        meditationDate.setDate(selectedDate.getDate() + i);
  
        const meditationDateKey = meditationDate.toDateString();
  
        setEvents((prevEvents) => {
          const updatedEvents = { ...prevEvents };
          if (!updatedEvents[meditationDateKey]) {
            updatedEvents[meditationDateKey] = [];
          }
  
          updatedEvents[meditationDateKey].push({
            description: "Meditation suggested",
            suggest_meditation: true,
          });
  
          return updatedEvents;
        });
  
        meditationMarkers.push(meditationDate.toDateString());
      }
  
      setMeditationDates((prevMeditationDates) => [
        ...prevMeditationDates,
        ...meditationMarkers,
      ]);
    }
  
    setPopupVisible(false); 
  };
  
  
  
  

  const handleGetEvents = async () => {
    try {
      const csrfToken = getCookie("csrftoken");
      const response = await axios.get(
        "http://localhost:8000/api/get_events/",
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken || "" },
        }
      );
  
      console.log("Events fetched successfully:", response.data);
  
      const fetchedEvents = {};
      const meditationMarkers = [];
      const eventMarkers = [];
  
      response.data.forEach((event) => {
        const eventDate = new Date(event.event_date);
        const dateKey = eventDate.toDateString();
  
        if (!fetchedEvents[dateKey]) {
          fetchedEvents[dateKey] = [];
        }
  
        fetchedEvents[dateKey].push({
          description: event.description,
          suggest_meditation: event.suggestMeditations,
        });
  
        if (event.suggestMeditations) {
          for (let i = -4; i <= 1; i++) {
            if (i === 0) continue;
  
            const meditationDate = new Date(eventDate);
            meditationDate.setDate(eventDate.getDate() + i);
            
            const meditationKey = meditationDate.toDateString();
            if (!fetchedEvents[meditationKey]) {
              fetchedEvents[meditationKey] = [];
            }
  
            fetchedEvents[meditationKey].push({
              description: "Meditation suggested.",
              suggest_meditation: true,
            });
  
            meditationMarkers.push(meditationDate.toDateString());
          }
        }

        const eventKey = eventDate.toDateString();
        if (!fetchedEvents[eventKey]) {
          fetchedEvents[eventKey] = [];
        }

        eventMarkers.push(eventDate.toDateString());


      });
  
      setEvents(fetchedEvents);
      setEventDates(eventMarkers);
      setMeditationDates(meditationMarkers);
      console.log("fetchedEvents", eventMarkers);
      console.log("meditationMarkers", meditationMarkers);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  const handleLogout = async () => {
      try {
        // Get the CSRF token from the cookie
        const csrfToken = Cookies.get("csrftoken");
    
        // Make a POST request to the logout endpoint
        const response = await axios.post(
          "http://localhost:8000/api/logout/",
          {},
          {
            withCredentials: true,  // Include credentials (cookies)
            headers: {
              "X-CSRFToken": csrfToken,  // Add the CSRF token to the headers
            },
          }
        );
    
        console.log("Logout successful:", response);
    
        Cookies.remove("sessionid");
    
        // Navigate to the login page after successful logout
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const normalEvents = eventDates.includes(date.toDateString());
      const meditationEvent = meditationDates.includes(date.toDateString()); // Check if it's a meditation day
      
      if (normalEvents){
        return (
          <div className="event-marker normal-event">
            <span role="img" aria-label="event">
              📅
            </span>
          </div>
        );
      }
  
      if (meditationEvent) {
        return (
          <div className="event-marker meditation-event">
            <span role="img" aria-label="meditation">
              🧘
            </span>
          </div>
        );
      }
    }
  };
  


  return (
    <div className="app-container">
      <div className="calendar-header">
        <img src={logo} alt="Speech Assistant Logo" className="calendar-logo" />
        <h3>Add your upcoming event!</h3>
        <button className="menu-button" onClick={toggleMenu}>☰</button>
      </div>

      <div className="calendar-content">
        <div className="selected-date">
          <p>Pick a date</p>
          <div className="date-display">
            <span className="date-text">{formatDate(selectedDate)}</span>
          </div>
        </div>

        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="react-calendar"
          tileContent={tileContent}
        />

        <div className="event-details">
          <div className="event-date">
            <span>{formatDate(selectedDate)}</span>
            <button className="calendar-button" onClick={togglePopup}>
              <img src={calendar} alt="Add Event" className="calendar-icon" />
            </button>
          </div>
          <div className="event-description">
            {events[selectedDate.toDateString()]?.length > 0 ? (
              <ul>
                {events[selectedDate.toDateString()].map((event, index) => (
                  <li key={index}>{event.description}</li> // Render description here
                ))}
              </ul>
            ) : (
              <p>No events for this day.</p>
            )}
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup-modal">
          <div className="popup-content">
            <button className="close-button" onClick={togglePopup}>
              ✖
            </button>
            <h4>Add a new event?</h4>
            <p>{formatDate(selectedDate)}</p>
            <div className="popup-form">
              <label>
                <input
                  type="checkbox"
                  checked={isMeditationChecked}
                  onChange={(e) => setMeditationChecked(e.target.checked)}
                />
                Suggest meditations
              </label>
              <textarea
                placeholder="Description"
                rows="3"
                onChange={(e) => setEventDescription(e.target.value)}
              ></textarea>
            </div>
            <button className="add-button" onClick={handleAddEvent}>
              Add
            </button>
          </div>
        </div>
      )}
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
                  <img src={logo} alt="Logo" className="menu-logo" />
                  <div className="menu-item">Profile Settings →</div>
                  <div className="menu-item" onClick={() => handleCardClick("/navigation")}>
                    Home Page →
                  </div>
                  <div className="user-avatar">AB</div>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
    </div>
  );
};

export default CalendarPage;
