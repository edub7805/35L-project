// create_job.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./create_job.css";

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobName, setJobName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("9:00");
  const [endTime, setEndTime] = useState("17:00");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (![jobName, date, startTime, endTime, description].every((s) => s.trim())) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          jobName, 
          date,
          startTime,
          endTime,
          description 
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.message || "Server error");
      }

      console.log("Created job:", payload);
      navigate(`/users/${id}/mainPage`);
    } catch (error: unknown) {
      console.error("Failed to submit:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Submission failed: " + errorMessage);
    }
  };

  // Generate time options for the select dropdowns
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  return (
    <div className="createjob-wrapper">
      <div className="createjob-background"></div>
      <div className="createjob-overlay">
        <h1 className="form-title">Post a Gig!</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jobName">Job Name</label>
            <input
              id="jobName"
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group time-range">
            <label>Time Range</label>
            <div className="time-selects">
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="time-select"
              >
                {timeOptions.map(time => (
                  <option key={`start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span>to</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="time-select"
              >
                {timeOptions.map(time => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job"
            ></textarea>
          </div>

          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}
