import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  jobsPosted: number;
  jobsTaken: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  
  // Dummy data - would come from API in real app
  const topUsers: LeaderboardUser[] = Array.from({ length: 20 }, (_, i) => ({
    id: `user${i + 1}`,
    name: `User ${i + 1}`,
    points: 1000 - i * 45 + Math.floor(Math.random() * 20),
    jobsPosted: 20 - Math.floor(Math.random() * 10),
    jobsTaken: 30 - Math.floor(Math.random() * 15),
    rank: i + 1
  }));

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h1>Leaderboard</h1>
        </div>
        <div className="time-selector">
          <button 
            className={timeFrame === 'weekly' ? 'active' : ''} 
            onClick={() => setTimeFrame('weekly')}
          >
            This Week
          </button>
          <button 
            className={timeFrame === 'monthly' ? 'active' : ''} 
            onClick={() => setTimeFrame('monthly')}
          >
            This Month
          </button>
          <button 
            className={timeFrame === 'allTime' ? 'active' : ''} 
            onClick={() => setTimeFrame('allTime')}
          >
            All Time
          </button>
        </div>
      </header>

      <div className="leaderboard-medals">
        {topUsers.slice(0, 3).map((user, index) => (
          <div key={user.id} className={`medal-card medal-${index + 1}`}>
            <div className="medal-rank">{index + 1}</div>
            <div className="medal-info">
              <h3>{user.name}</h3>
              <div className="medal-points">{user.points} points</div>
              <div className="medal-stats">
                <span>{user.jobsPosted} jobs posted</span>
                <span>{user.jobsTaken} jobs taken</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Jobs Posted</th>
              <th>Jobs Taken</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map(user => (
              <tr key={user.id} className={user.rank <= 3 ? `highlight-${user.rank}` : ''}>
                <td className="rank-cell">{user.rank}</td>
                <td>{user.name}</td>
                <td className="points-cell">{user.points}</td>
                <td>{user.jobsPosted}</td>
                <td>{user.jobsTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-info">
        <h3>How the Leaderboard Works</h3>
        <p>
          The leaderboard ranks users based on their overall activity and contributions to the platform.
          Points are earned by posting jobs, taking jobs, and completing tasks.
          Higher rankings give you recognition and access to special features!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard; 