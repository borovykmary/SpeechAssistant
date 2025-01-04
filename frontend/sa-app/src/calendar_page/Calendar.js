import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import logo from "../assets/logo.svg";
import calendar from "../assets/calendar.svg";
import axios from "axios";

// Function to fetch CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const CalendarPage = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDescription, setEventDescription] = useState(
    "Description of your event"
  );
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isMeditationChecked, setMeditationChecked] = useState(false);
  const [events, setEvents] = useState({});
  const [independentEvents, setIndependentEvents] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDateBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
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
    };
  
    console.log("Adding event with payload:", payload);
  
    handleSubmit(payload, {
      setSubmitting: () => console.log("Submitting..."),
      setErrors: (errors) => console.error("Validation errors:", errors),
    });
  
    // Update local state and close popup
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDate.toDateString()]: payload.description,
    }));
    setPopupVisible(false);
  };
  
  
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const normalEvent = events[date.toDateString()];
      const meditationEvent = independentEvents.find(
        (event) => event.date.toDateString() === date.toDateString()
      );

      return (
        <>
          {normalEvent && (
            <div className="event-marker normal-event">
              <span role="img" aria-label="event">
                📅
              </span>
            </div>
          )}
          {meditationEvent && (
            <div className="event-marker meditation-event">
              <span role="img" aria-label="meditation">
                🧘
              </span>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="app-container">
      <div className="calendar-header">
        <img src={logo} alt="Speech Assistant Logo" className="calendar-logo" />
        <h3>Add your upcoming event!</h3>
        <button className="menu-button">☰</button>
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
          <p className="event-description">
            {events[selectedDate.toDateString()] ||
              independentEvents
                .filter(
                  (event) =>
                    event.date.toDateString() === selectedDate.toDateString()
                )
                .map((event) => event.description)
                .join(", ") ||
              "No description yet."}
          </p>
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
    </div>
  );
};

export default CalendarPage;
