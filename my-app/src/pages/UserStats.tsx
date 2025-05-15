import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserStats.css';

interface UserData {
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

interface JobHistory {
  id: number;
  title: string;
  date: string;
  status: 'posted' | 'taken' | 'completed';
  points: number;
}

const UserStats: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'posted' | 'taken' | 'points'>('posted');

  // Dummy data - would come from API in real app
  const userStats: UserStats = {
    jobsPosted: 15,
    jobsTaken: 22,
    points: 740,
    rank: 8
  };

  const jobsPosted: JobHistory[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Posted Job #${i + 1}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    status: i < 3 ? 'completed' : 'posted',
    points: i < 3 ? 50 : 20
  }));

  const jobsTaken: JobHistory[] = Array.from({ length: 7 }, (_, i) => ({
    id: i + 100,
    title: `Taken Job #${i + 1}`,
    date: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString(),
    status: i < 5 ? 'completed' : 'taken',
    points: i < 5 ? 70 : 30
  }));

  // Fetch user data
  useEffect(() => {
    if (!id) {
      navigate('/login');
      return;
    }

    // In a real app, this would be an API call
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(r => r.json())
      .then((data: UserData) => setUserData(data))
      .catch(err => {
        console.error('Error fetching user data:', err);
        navigate('/login');
      });
  }, [id, navigate]);

  const handleBackToMain = () => {
    navigate(`/users/${id}/mainPage`);
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="stats-page">
      <header className="stats-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBackToMain}>
            ← Back
          </button>
          <h1>User Statistics</h1>
        </div>
        <div className="user-info">
          <h2>{userData?.name || 'Loading...'}</h2>
          <div className="rank-badge">Rank #{userStats.rank}</div>
        </div>
      </header>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{userStats.jobsPosted}</div>
          <div className="stat-label">Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userStats.jobsTaken}</div>
          <div className="stat-label">Jobs Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userStats.points}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <button className="leaderboard-button" onClick={handleLeaderboard}>
          View Leaderboard
        </button>
      </div>

      <div className="stats-tabs">
        <button 
          className={activeTab === 'posted' ? 'active' : ''} 
          onClick={() => setActiveTab('posted')}
        >
          Jobs Posted
        </button>
        <button 
          className={activeTab === 'taken' ? 'active' : ''} 
          onClick={() => setActiveTab('taken')}
        >
          Jobs Taken
        </button>
        <button 
          className={activeTab === 'points' ? 'active' : ''} 
          onClick={() => setActiveTab('points')}
        >
          Points History
        </button>
      </div>

      <div className="stats-content">
        {activeTab === 'posted' && (
          <div className="jobs-list">
            <h3>Jobs You've Posted</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {jobsPosted.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.date}</td>
                    <td>
                      <span className={`status-badge ${job.status}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td>+{job.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'taken' && (
          <div className="jobs-list">
            <h3>Jobs You've Taken</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {jobsTaken.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.date}</td>
                    <td>
                      <span className={`status-badge ${job.status}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td>+{job.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="points-history">
            <h3>Points History</h3>
            <div className="points-summary">
              <p><strong>Current Point Total:</strong> {userStats.points}</p>
              <p><strong>Points from Posted Jobs:</strong> {jobsPosted.reduce((acc, job) => acc + job.points, 0)}</p>
              <p><strong>Points from Taken Jobs:</strong> {jobsTaken.reduce((acc, job) => acc + job.points, 0)}</p>
              <p><strong>Bonus Points:</strong> 100</p>
            </div>
            <div className="points-explanation">
              <h4>How Points Work</h4>
              <ul>
                <li>Earn 20 points when you post a job</li>
                <li>Earn additional 30 points when your posted job is completed</li>
                <li>Earn 30 points when you take a job</li>
                <li>Earn additional 40 points when you complete a taken job</li>
                <li>Bonus points awarded for consistent activity</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats; 