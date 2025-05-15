import React, { FC, useState, useEffect, useRef } from 'react';
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

interface UserStats {
  jobsPosted: number;
  jobsTaken: number;
  points: number;
  rank: number;
}

const MainPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(70); // Default 70% width
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Refs for resize handling
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Dummy stats data (would come from API in real app)
  const userStats: UserStats = {
    jobsPosted: 5,
    jobsTaken: 12,
    points: 340,
    rank: 8
  };

  // Fetch username
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(r => r.json())
      .then((u: UserResponse) => setUsername(u.name))
      .catch(() => setUsername(''));
  }, [id]);

  // Handle divider drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseXRelative = e.clientX - containerRect.left;
      
      // Calculate percentage width (constrained between 20% and 80%)
      const newWidthPercent = Math.min(Math.max(
        (mouseXRelative / containerWidth) * 100, 
        20), // min width
        80  // max width
      );
      
      setLeftPanelWidth(newWidthPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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

  const handleUserStats = () => {
    navigate(`/users/${id}/stats`);
  };

  const handleMyJobs = () => {
    navigate(`/users/${id}/my-jobs`);
  };

  const handleLeaderboard = () => {
    navigate(`/leaderboard`);
  };

  return (
    <div className="page-wrapper">
      {/* Top nav / hero */}
      <nav className="main-nav">
        <div className="logo">
          {/* swap in your logo SVG or image here */}
          <strong>Sixxer</strong>
        </div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={handleMyJobs}>
            My Jobs
          </button>
          <button className="nav-button" onClick={handleUserStats}>
            Stats ({userStats.points} pts)
          </button>
          <button className="nav-button" onClick={handleLeaderboard}>
            Leaderboard
          </button>
          <button className="nav-button" onClick={handleCreatePost}>
            + Create Job
          </button>
        </div>
      </nav>

      {/* Two-column layout with resizable panels */}
      <div className="main-page-container" ref={containerRef}>
        <aside 
          className="main-left" 
          ref={leftPanelRef}
          style={{ flex: `0 0 ${leftPanelWidth}%` }}
        >
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

        {/* Resizable divider */}
        <div 
          className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
          ref={dividerRef}
          onMouseDown={handleMouseDown}
        />

        <section className="main-right" style={{ flex: `0 0 ${100 - leftPanelWidth - 1}%` }}>
          <div className="action-box">
            <h2 className="action-title">
              Hello, {username || 'User'}!
            </h2>
            <p className="action-sub">Ready to post a new job?</p>
            <button className="action-button" onClick={handleCreatePost}>
              Create Job
            </button>
            
            <div className="stats-preview">
              <h3>Your Activity</h3>
              <p>Jobs Posted: {userStats.jobsPosted}</p>
              <p>Jobs Taken: {userStats.jobsTaken}</p>
              <p>Points: {userStats.points}</p>
              <p>Rank: #{userStats.rank}</p>
              <button className="action-button" onClick={handleUserStats}>
                View Details
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPage;
