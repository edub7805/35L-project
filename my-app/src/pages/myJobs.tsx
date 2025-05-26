import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./myJobs.css";

// Job and user types
type JobPostStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ARCHIVED';

interface JobPost {
  id: string;
  userId: string;
  assignedUserId?: string;      // buyer/customer, optional
  jobName: string;
  description: string;
  status: JobPostStatus;
}

interface UserResponse {
  id: string;
  name: string;
}

export default function MyJobs() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'picked' | 'outgoing'>('picked');
  const [pickedJobs, setPickedJobs] = useState<JobPost[]>([]);
  const [outgoingJobs, setOutgoingJobs] = useState<JobPost[]>([]);
  const [posterNames, setPosterNames] = useState<Record<string, string>>({});

  // Fetch jobs the user picked up: filter by assignedUserId on backend and ensure match
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/assigned-jobs`)
      .then(res => res.json())
      .then((data: JobPost[]) => {
        // Fallback filter in case backend returns more
        const filtered = data.filter(job => job.assignedUserId === id);
        setPickedJobs(filtered);
      })
      .catch(err => {
        console.error('Failed to load picked-up jobs:', err);
        setPickedJobs([]);
      });
  }, [id]);

  // Fetch jobs the user posted: filter by userId on backend and ensure match
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/jobs`)
      .then(res => res.json())
      .then((data: JobPost[]) => {
        const filtered = data.filter(job => job.userId === id);
        setOutgoingJobs(filtered);
      })
      .catch(err => {
        console.error('Failed to load outgoing jobs:', err);
        setOutgoingJobs([]);
      });
  }, [id]);

  // Fetch poster names for picked-up jobs
  useEffect(() => {
    const uniqueIds = Array.from(new Set(pickedJobs.map(j => j.userId)));
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
  }, [pickedJobs]);

  const handleTabClick = (tab: 'picked' | 'outgoing') => setActiveTab(tab);

  // Update job status
  const handleUpdateStatus = (
    jobId: string,
    newStatus: JobPostStatus,
    isPicked: boolean
  ) => {
    fetch(`http://localhost:8080/api/jobs/${jobId}?status=${newStatus}`, {
      method: 'PUT'
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status update failed: ${res.status}`);
        if (isPicked) {
          setPickedJobs(prev =>
            prev.map(j => (j.id === jobId ? { ...j, status: newStatus } : j))
          );
        } else {
          setOutgoingJobs(prev =>
            prev.map(j => (j.id === jobId ? { ...j, status: newStatus } : j))
          );
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="page-wrapper">
      <nav className="main-nav">
        <div className="logo"><strong>Sixxer</strong></div>
        <div className="nav-buttons">
          <button onClick={() => navigate(-1)} className="nav-button">
            Back
          </button>
        </div>
      </nav>

      <div className="main-page-container">
        <aside className="main-left">
          <div className="left-banner">
            <h2>My Jobs</h2>
          </div>

          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'picked' ? 'active' : ''}`}
              onClick={() => handleTabClick('picked')}
            >
              My Picked Up Jobs
            </button>
            <button
              className={`tab-button ${activeTab === 'outgoing' ? 'active' : ''}`}
              onClick={() => handleTabClick('outgoing')}
            >
              My Outgoing Jobs
            </button>
          </div>

          <div
            className={`jobs-section job-list ${
              activeTab === 'picked' ? 'active' : ''
            }`}
          >
            {pickedJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.jobName}</h3>
                <p>
                  Posted by: {posterNames[job.userId] || job.userId}
                </p>
                <p>{job.description}</p>
                <div className="job-status">
                  Status: <span>{job.status}</span>
                </div>
                <div className="status-controls">
                  {job.status !== 'COMPLETED' && (
                    <button
                      className="status-button"
                      onClick={() =>
                        handleUpdateStatus(job.id, 'COMPLETED', true)
                      }
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pickedJobs.length === 0 && <p>No picked-up jobs.</p>}
          </div>

          <div
            className={`jobs-section job-list ${
              activeTab === 'outgoing' ? 'active' : ''
            }`}
          >
            {outgoingJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.jobName}</h3>
                <p>{job.description}</p>
                <div className="job-status">
                  Status: <span>{job.status}</span>
                </div>
                <div className="status-controls">
                  {job.status === 'OPEN' && (
                    <>
                      <button
                        className="status-button"
                        onClick={() =>
                          handleUpdateStatus(job.id, 'ARCHIVED', false)
                        }
                      >
                        Cancel Job
                      </button>
                      <button
                        className="status-button"
                        onClick={() =>
                          handleUpdateStatus(job.id, 'IN_PROGRESS', false)
                        }
                      >
                        Mark In Progress
                      </button>
                    </>
                  )}
                  {job.status === 'IN_PROGRESS' && (
                    <button
                      className="status-button"
                      onClick={() =>
                        handleUpdateStatus(job.id, 'COMPLETED', false)
                      }
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
            {outgoingJobs.length === 0 && <p>No outgoing jobs.</p>}
          </div>
        </aside>

        <section className="main-right">
          {/* Optional details pane */}
        </section>
      </div>
    </div>
  );
}