import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserProfile.css';

interface UserData {
  id: string;
  name: string;
  email: string;
}
interface UserRating {
  reviewCount: number;
  ratingSum: number;
  averageRating: number;
}
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
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  description: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData>({ id: '', name: '', email: '' });
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [jobsPosted, setJobsPosted] = useState<JobHistory[]>([]);
  const [jobsTaken, setJobsTaken] = useState<JobHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'posted' | 'taken'>('reviews');
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
        // User info
        const userRes = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userJson = await userRes.json();
        setUserData({ id: userJson.id, name: userJson.name, email: userJson.email });
        // Rating
        const ratingRes = await fetch(`http://localhost:8080/api/users/${id}/rating`);
        if (!ratingRes.ok) throw new Error('Failed to fetch rating summary');
        const ratingJson: UserRating = await ratingRes.json();
        setUserRating(ratingJson);
        // Reviews
        const reviewsRes = await fetch(`http://localhost:8080/api/users/${id}/reviews`);
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviewsJson: Review[] = await reviewsRes.json();
        // Enrich with author names
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
        // Jobs posted
        const postedRes = await fetch(`http://localhost:8080/api/users/${id}/jobs`);
        if (!postedRes.ok) throw new Error('Failed to fetch posted jobs');
        const postedJson: JobHistory[] = await postedRes.json();
        setJobsPosted(postedJson);
        // Jobs taken
        const takenRes = await fetch(`http://localhost:8080/api/users/${id}/assigned-jobs`);
        if (!takenRes.ok) throw new Error('Failed to fetch taken jobs');
        const takenJson: JobHistory[] = await takenRes.json();
        setJobsTaken(takenJson);
      } catch (e) {
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
      <div className="profile-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackToMain}>Back to Main</button>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <button className="back-button" style={{alignSelf: 'flex-start', margin: '1rem 0 0 2rem'}} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="profile-header">
        <h2>{userData.name}</h2>
        <div className="user-email">{userData.email}</div>
        <div className="rating-badge">
          {userRating
            ? `${userRating.averageRating.toFixed(1)} ★ (${userRating.reviewCount})`
            : 'No ratings yet'}
        </div>
      </div>
      <div className="profile-tabs">
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>
          Reviews
        </button>
        <button className={activeTab === 'posted' ? 'active' : ''} onClick={() => setActiveTab('posted')}>
          Jobs Posted
        </button>
        <button className={activeTab === 'taken' ? 'active' : ''} onClick={() => setActiveTab('taken')}>
          Jobs Taken
        </button>
      </div>
      <div className="profile-section">
        {activeTab === 'reviews' && (
          <div className="reviews-list">
            <h3>Reviews Given</h3>
            {reviews.length === 0 ? (
              <div>No reviews yet.</div>
            ) : (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td>{r.authorName}</td>
                      <td>{r.rating} ★</td>
                      <td>{r.text}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'posted' && (
          <div className="jobs-list">
            <h3>Jobs Posted</h3>
            <table className="profile-table">
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
                        {job.status === 'COMPLETED' ? 'Completed' :
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
            <h3>Jobs Taken</h3>
            <table className="profile-table">
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
                        {job.status === 'COMPLETED' ? 'Completed' :
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
      </div>
    </div>
  );
};

export default UserProfile; 