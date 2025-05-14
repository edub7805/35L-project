import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './mainPage.css';

type Job = {
  id: number;
  title: string;
  description: string;
};

type UserResponse = {
  id: string;
  name: string;
  email: string;
};

export default function MainPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');

  // Fetch user info on mount
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch user (${res.status})`);
        }
        return res.json() as Promise<UserResponse>;
      })
      .then(user => {
        setUsername(user.name);
      })
      .catch(err => {
        console.error(err);
        setUsername(''); // fallback
      });
  }, [id]);

  const dummyJobs: Job[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    title: `Job Title ${i + 1}`,
    description: `This is the description for job ${i + 1}.`,
  }));

  const handleCreatePost = () => {
    navigate(`/users/${id}/createpost`);
  };

  return (
    <div className="main-page-container">
      <div className="main-left">
        {dummyJobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
          </div>
        ))}
      </div>

      <div className="main-right">
        <div className="action-box">
          <h2 className="action-title">
            Hello, {username || 'User'}!
          </h2>
          <p className="action-sub">Ready to post a new job?</p>
          <button className="action-button" onClick={handleCreatePost}>
            Create Job
          </button>
        </div>
      </div>
    </div>
  );
}
