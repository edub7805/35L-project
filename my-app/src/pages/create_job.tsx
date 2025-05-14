<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './create_job.css';
=======
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

    // You can replace this with a POST request to your backend
    // e.g., fetch('/api/jobs', { method: 'POST', body: JSON.stringify(jobData), ... })

    alert('Job posted!');
    navigate('/'); // Or redirect somewhere else
  };

  return (
    <div className="create-job-container">
      <h1>Create a job post for user {id}</h1>
      <form onSubmit={handleSubmit} className="create-job-form">
        <p>hiii</p> 
        <label>Job Name</label>
        <input
          type="text"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          placeholder="Enter job title"
        />

        <label>Time</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 2 PM - 5 PM"
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the job in detail"
        ></textarea>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
>>>>>>> create_jobpost
