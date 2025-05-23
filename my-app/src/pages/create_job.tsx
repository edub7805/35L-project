// create_job.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./create_job.css";

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobName, setJobName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("normal");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      alert("Please select both start and end times.");
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }
    const time = `${startTime} - ${endTime}`;
    if (![jobName, time, description].every((s) => s.trim())) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobName, time, date, description, status }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.message || "Server error");
      }
      navigate(`/users/${id}/mainPage`);
    } catch (err: any) {
      console.error("Failed to submit:", err);
      alert("Submission failed: " + err.message);
    }
  };

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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <div className="time-inputs">
              <div className="time-input-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="time-input-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="status">Job Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="flexible">Flexible</option>
            </select>
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
          <div className="button-group">
            <button type="button" onClick={() => navigate(`/users/${id}/mainPage`)} className="cancel-button">
              Cancel
            </button>
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
