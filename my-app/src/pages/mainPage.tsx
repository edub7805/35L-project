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
  const [search, setSearch]     = useState<string>('');

  // fetch user name...
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(r => r.json())
      .then((u: UserResponse) => setUsername(u.name))
      .catch(() => setUsername(''));
  }, [id]);

  const dummyJobs: Job[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    title: `Job Title ${i + 1}`,
    description: `This is the description for job ${i + 1}.`,
  }));

  const filtered = dummyJobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreatePost = () => {
    navigate(`/users/${id}/createpost`);
  };

  return (
    <div className="main-page-container">
      <div className="main-left">
        <div className="left-header">
          <h2>Available Jobs</h2>
          <input
            className="job-search"
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="job-list">
          {filtered.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </div>
          ))}
        </div>
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
