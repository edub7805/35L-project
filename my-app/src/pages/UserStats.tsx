import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserStats.css';

// runtime property for user data
interface UserData {
  id: string;
  name: string;
}
//User rating similar to seen in mainPage
interface UserRating {
  reviewCount: number;
  ratingSum: number;
  averageRating: number;
}
// review similar to seen in page
interface Review {
  id: string;
  jobId: string;
  authorId: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface JobHistory {
  id: string;
  jobName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'; // I like this addition to add the different type
  description: string;
}

const UserStats: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Basic profile info
  const [userData, setUserData] = useState<UserData>({ id: '', name: '' });

  // Rating summary pulled from /api/users/:id/rating
  const [userRating, setUserRating] = useState<UserRating | null>(null);

  // Detailed reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  // Job history
  const [jobsPosted, setJobsPosted] = useState<JobHistory[]>([]);
  const [jobsTaken, setJobsTaken] = useState<JobHistory[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'posted' | 'taken' | 'reviews'>('posted');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1) Fetch basic user info
        const userRes = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userJson = await userRes.json();
        setUserData({ id: userJson.id, name: userJson.name });

        // 2) Fetch rating summary
        const ratingRes = await fetch(`http://localhost:8080/api/users/${id}/rating`);
        if (!ratingRes.ok) throw new Error('Failed to fetch rating summary');
        const ratingJson: UserRating = await ratingRes.json();
        setUserRating(ratingJson);

        // 3) Fetch detailed reviews
        const reviewsRes = await fetch(`http://localhost:8080/api/users/${id}/reviews`);
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviewsJson: Review[] = await reviewsRes.json();

        // Enrich each review with authorName
        const reviewsWithNames = await Promise.all(
          reviewsJson.map(async r => {
            try {
              const authorRes = await fetch(`http://localhost:8080/api/users/${r.authorId}`);
              if (!authorRes.ok) throw new Error();
              const authorJson = await authorRes.json();
              return { ...r, authorName: authorJson.name };
            } catch {
              return { ...r, authorName: 'Unknown User' };
            }
          })
        );
        setReviews(reviewsWithNames);

        // 4) Fetch job history: posted
        const postedRes = await fetch(`http://localhost:8080/api/users/${id}/jobs`);
        if (!postedRes.ok) throw new Error('Failed to fetch posted jobs');
        const postedJson: JobHistory[] = await postedRes.json();
        setJobsPosted(postedJson);

        // 5) Fetch job history: taken
        const takenRes = await fetch(`http://localhost:8080/api/users/${id}/assigned-jobs`);
        if (!takenRes.ok) throw new Error('Failed to fetch taken jobs');
        const takenJson: JobHistory[] = await takenRes.json();
        setJobsTaken(takenJson);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBackToMain = () => {
    navigate(`/users/${id}/mainPage`);
  };

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackToMain}>Back to Main</button>
        </div>
      </div>
    );
  }

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
          <h2>{userData.name}</h2>
          <div className="rating-badge">
            {userRating
              ? `${userRating.averageRating.toFixed(1)} ★ (${userRating.reviewCount})`
              : 'No ratings yet'}
          </div>
        </div>
      </header>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{jobsPosted.length}</div>
          <div className="stat-label">Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{jobsTaken.length}</div>
          <div className="stat-label">Jobs Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userRating?.reviewCount || 0}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
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
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
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
                  <th>Time</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {jobsPosted.map(job => (
                  <tr key={job.id}>
                    <td>{job.jobName}</td>
                    <td>{new Date(job.date).toLocaleDateString()}</td>
                    <td>{`${job.startTime} - ${job.endTime}`}</td>
                    <td>
                      <span className={`status-badge ${job.status.toLowerCase()}`}>
                        {job.status === 'COMPLETED' ? 'Completed' : //conditionals in html is absolutely foul
                         job.status === 'IN_PROGRESS' ? 'In Progress' :
                                                         'Open'}
                      </span>
                    </td>
                    <td>{job.description}</td>
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
                  <th>Time</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {jobsTaken.map(job => (
                  <tr key={job.id}>
                    <td>{job.jobName}</td>
                    <td>{new Date(job.date).toLocaleDateString()}</td>
                    <td>{`${job.startTime} - ${job.endTime}`}</td>
                    <td>
                      <span className={`status-badge ${job.status.toLowerCase()}`}>
                        {job.status === 'COMPLETED' ? 'Completed' : //conditionals in html is absolutely foul
                         job.status === 'IN_PROGRESS' ? 'In Progress' :
                                                         'Open'}
                      </span>
                    </td>
                    <td>{job.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-list">
            <h3>Reviews Received</h3>
            <div className="reviews-summary">
              <p>
                <strong>Average Rating:</strong>{' '}
                {userRating ? userRating.averageRating.toFixed(1) : '0.0'} ★
              </p>
              <p>
                <strong>Total Reviews:</strong>{' '}
                {userRating?.reviewCount || 0}
              </p>
            </div>
            <div className="reviews-grid">
              {reviews.length ? (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-author">
                        <strong>{review.authorName}</strong>
                      </div>
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
