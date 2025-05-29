import React, { FC, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './mainPage.css';


//define a type for the status of jobpost from backend
type JobPostStatus = 
  'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
// Match backend JSON shape
interface JobPost {
  id: string;
  userId: string;
  jobName: string;
  time: string;
  description: string;
  createdAt: string;
  status : JobPostStatus; // of type 
}

interface UserResponse {
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
  rating: number;
  text: string;
  createdAt: string;
}



const MainPage: FC = () => {
  const { id } = useParams<{ id: string }>(); // used only for greeting
  const navigate = useNavigate();

  // UI state
  const [username, setUsername] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [posterNames, setPosterNames] = useState<Record<string, string>>({});
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(70);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);


  // Refs for resize handling
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);



  // Fetch username (for greeting)
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(res => res.json())
      .then((u: UserResponse) => setUsername(u.name))
      .catch(err => {
        console.error('Failed to load user:', err);
        setUsername('');
      });
  }, [id]);

  // Fetch all jobs
  useEffect(() => {
    fetch(`http://localhost:8080/api/jobs?status=OPEN`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: JobPost[]) => setJobs(data))
      .catch(err => {
        console.error('Failed to load jobs:', err);
        setJobs([]);
      });
  }, []);

  // Fetch poster names for each unique userId
  useEffect(() => {
    const uniqueIds = Array.from(new Set(jobs.map(j => j.userId)));
    Promise.all(
      uniqueIds.map(uid =>
        fetch(`http://localhost:8080/api/users/${uid}`)
          .then(res => res.json())
          .then((u: UserResponse) => [uid, u.name] as [string, string])
          .catch(() => [uid, uid] as [string, string])
      )
    )
      .then(entries => setPosterNames(Object.fromEntries(entries)))
      .catch(err => console.error('Failed to load poster names:', err));
  }, [jobs]);

  // Filter jobs by search term (job name or poster name)
  const filtered = jobs.filter(job =>
    job.jobName.toLowerCase().includes(search.toLowerCase()) ||
    (posterNames[job.userId] || '').toLowerCase().includes(search.toLowerCase())
  );

  //job review
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/rating`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((r: UserRating) => setUserRating(r))
      .catch(err => {
        console.error("Failed to load rating:", err);
      });
  }, [id]);


  // Divider drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handlePickUp = (jobId: string, ownerId: string) => {
      if (!id) {
        alert("Missing user ID.");
        return;
      }
      if (id === ownerId) {
        alert("Can't pick up your own job!");
        return;
      }

      fetch(`http://localhost:8080/api/jobs/${jobId}/pickup?userId=${id}`, {
        method: 'PUT'
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to pick up job");
          alert("Successfully picked up job!");
          // Remove from the available jobs list
          setJobs(prev => prev.filter(j => j.id !== jobId));
        })
        .catch(err => {
          console.error(err);
          alert("Error picking up job.");
        });
    };

    // view Reviews
    const viewReviews = () => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/reviews`)
      .then(res => res.json())
      .then((rev: Review[]) => { setUserReviews(rev); setReviewModalOpen(true); })
      .catch(() => setUserReviews([]));
  };
  const closeReviewModal = () => setReviewModalOpen(false);


  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = Math.min(
        Math.max(((e.clientX - rect.left) / rect.width) * 100, 20),
        80
      );
      setLeftPanelWidth(percent);
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // Navigation handlers
  const handleCreatePost = () => navigate(`/users/${id}/createpost`);
  const handleUserStats = () => navigate(`/users/${id}/stats`);
  const handleMyJobs = () => navigate(`/users/${id}/myJobs`);

  return (
    <div className="page-wrapper">
      <nav className="main-nav">
        <div className="logo"><strong>Sixxer</strong></div>
        <div className="nav-buttons">
          <button onClick={handleMyJobs} className="nav-button">My Jobs</button>
          <button onClick={handleUserStats} className="nav-button">Statistics</button>
          <button onClick={handleCreatePost} className="nav-button">+ Create Job</button>
        </div>
      </nav>

      <div className="main-page-container" ref={containerRef}>
        <aside className="main-left" style={{ flex: `0 0 ${leftPanelWidth}%` }}>
          <div className="left-banner">
            <h2>Available Jobs</h2>
            <input
              className="job-search"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="job-list">
            {filtered.map(job => (
              <div key={job.id} className="job-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="job-card-body">
                  <div className="job-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{job.jobName}</div>
                  <p className="job-poster">Posted by: {posterNames[job.userId] || job.userId}</p>
                  <p className="job-desc">{job.description}</p>
                </div>
                <div className="job-card-actions">
                  <button
                    onClick={() => handlePickUp(job.id, job.userId)}
                    className="nav-button job-pickup-btn"
                  >Pick Up</button>
                  <button
                    className="nav-button view-profile-btn"
                    onClick={() => navigate(`/users/${job.userId}/profile`)}
                  >View Profile</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p>No jobs found.</p>}
          </div>
        </aside>

        <div
          ref={dividerRef}
          className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        <section className="main-right" style={{ flex: `0 0 ${100 - leftPanelWidth - 1}%` }}>
          <div className="action-box">
            <h2 className="action-title">Hello, {username || 'User'}!</h2>
            <p className="action-sub">Ready to post a new job?</p>
            <button onClick={handleCreatePost} className="action-button">Create Job</button>
            <div className="stats-preview">
              <h3>Your Rating</h3>
              {userRating ? (
                <>
                  <p>Average: {userRating.averageRating.toFixed(1)} ★</p>
                  <p>Reviews: {userRating.reviewCount}</p>

                  
                  {/* --------------------------------------------------------------------------
                   temporary removal of this button i dont think we need it
                  <button onClick={() => viewReviews()} className="action-button">
                    View Details
                  </button>*/}
                </>
              ) : (
                <p>Loading…</p>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* Reviews Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>User Reviews</h2>
            <div className="review-list">
              <table>
                <thead>
                  <tr><th>Rating</th><th>Comment</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {userReviews.map(r => (
                    <tr key={r.id}>
                      <td>{r.rating} ★</td>
                      <td>{r.text}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="send-button" onClick={closeReviewModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
