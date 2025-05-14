import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './mainPage.css';

interface Job {
  id: number;
  owner: string;
  title: string;
  description: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

const MainPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Fetch username
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(r => r.json())
      .then((u: UserResponse) => setUsername(u.name))
      .catch(() => setUsername(''));
  }, [id]);

  // Dummy jobs data
  const dummyJobs: Job[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    owner: `tempOwner`,
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
    <div className="page-wrapper">
      {/* Top nav / hero */}
      <nav className="main-nav">
        <div className="logo">
          {/* swap in your logo SVG or image here */}
          <strong>Sixxer</strong>
        </div>
        <button className="nav-button" onClick={handleCreatePost}>
          + Create Job
        </button>
      </nav>

      {/* Two-column layout */}
      <div className="main-page-container">
        <aside className="main-left">
          <div className="left-banner">
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
                <p>{job.owner}</p>
                <p>{job.description}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="main-right">
          <div className="action-box">
            <h2 className="action-title">
              Hello, {username || 'User'}!
            </h2>
            <p className="action-sub">Ready to post a new job?</p>
            <button className="action-button" onClick={handleCreatePost}>
              Create Job
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPage;
