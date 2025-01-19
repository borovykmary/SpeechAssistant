import React from "react";
import "./VoiceStatisticsBar.css";

const VoiceStatisticsBar = ({ voiceStatistic }) => {
  const parsedVoiceStatistic =
    typeof voiceStatistic === "string"
      ? JSON.parse(voiceStatistic)
      : voiceStatistic;

  const emotionColors = {
    fear: "#bdb2ff",
    calm: "#9bf6ff",
    happy: "#fdffb6",
    sad: "#a0c4ff",
    disgust: "#caffbf",
    surprise: "#ffd6a5",
    angry: "#ffadad",
    neutral: "#ffc6ff",
  };

  const parsedStatistics = Object.entries(parsedVoiceStatistic).reduce(
    (acc, [emotion, value]) => {
      const numericValue =
        typeof value === "string" && value.includes("%")
          ? parseFloat(value.replace("%", ""))
          : typeof value === "number"
          ? value
          : 0;

      if (!isNaN(numericValue) && numericValue >= 0) {
        acc[emotion] = numericValue;
      }
      return acc;
    },
    {}
  );

  const totalPercentage = Object.values(parsedStatistics).reduce(
    (acc, value) => acc + value,
    0
  );

  return (
    <div className="voice-statistics-container">
      <div className="voice-statistics-bar">
        {Object.entries(parsedStatistics).map(([emotion, percentage]) => (
          <div
            key={emotion}
            className="progress-segment"
            style={{
              width: `${(percentage / totalPercentage) * 100}%`,
              backgroundColor: emotionColors[emotion] || "#000",
            }}
          />
        ))}
      </div>
      <div className="legend-container">
        {Object.entries(parsedStatistics).map(([emotion, percentage]) => (
          <div key={emotion} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: emotionColors[emotion] }}
            ></div>
            <span className="legend-label">
              {emotion}: {percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceStatisticsBar;
