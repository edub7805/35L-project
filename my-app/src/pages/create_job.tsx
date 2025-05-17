// create_job.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./create_job.css";

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobName, setJobName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ② stop the browser reload
    e.preventDefault();

    // 1) quick frontend guard
    if (![jobName, time, description].every((s) => s.trim())) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobName, time, description }),
      });

      const payload = await res.json();
      if (!res.ok) {
        // server sent a 4xx/5xx with { message }
        throw new Error(payload.message || "Server error");
      }

      console.log("Created job:", payload);
      console.log("✔️ About to redirect to:", `/users/${id}/mainPage`);
      navigate(`/users/${id}/mainPage`);
    } catch (err) {
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
            <label htmlFor="time">Time</label>
            <input
              id="time"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 2 PM - 5 PM"
            />
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
