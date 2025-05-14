// create_job.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './create_job.css';

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobName, setJobName] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      userId: id,
      jobName,
      time,
      description,
    };

    console.log('Submitting job:', jobData);

    alert('Job posted!');
    navigate('/');
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
