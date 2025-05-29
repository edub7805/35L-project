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
  assignedUserId?: string;
  jobName: string;
  description: string;
  status: JobPostStatus;
  time: string;
}

interface ConversationContent {
  messageId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  jobId: string;
  participants: string[];
  messages: ConversationContent[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}



export default function MyJobs() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'picked' | 'outgoing'>('picked');
  const [pickedJobs, setPickedJobs] = useState<JobPost[]>([]);
  const [outgoingJobs, setOutgoingJobs] = useState<JobPost[]>([]);
  const [posterNames, setPosterNames] = useState<Record<string, string>>({});

  // Messaging state
  const [modalJob, setModalJob] = useState<JobPost | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationContent[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const [reviewingJob, setReviewingJob] = useState<JobPost | null>(null);
  const [starRating, setStarRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const [pickerNames, setPickerNames] = useState<Record<string,string>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());


  // Fetch picked-up jobs
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/assigned-jobs`)
      .then(res => res.json())
      .then(setPickedJobs)
      .catch(() => setPickedJobs([]));
  }, [id]);

  // Fetch outgoing jobs
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/users/${id}/jobs`)
      .then(res => res.json())
      .then(setOutgoingJobs)
      .catch(() => setOutgoingJobs([]));
  }, [id]);

  const handleTabClick = (tab: 'picked' | 'outgoing') => setActiveTab(tab);

  // Open messaging modal and load conversation
  const openMessage = (job: JobPost) => {
    setModalJob(job);
    fetch(`http://localhost:8080/api/messages/job/${job.id}`)
      .then(res => res.json())
      .then((conv: Conversation) => {
        setConversation(conv);
        setMessages(conv.messages);
      })
      .catch(() => {
        setConversation(null);
        setMessages([]);
      });
  };

  const completeJob = (job: JobPost) => {
    fetch(`http://localhost:8080/api/jobs/${job.id}/complete?userId=${job.userId}`, {
        method: 'PUT'
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to pick up job");
          setOutgoingJobs(prev =>
            prev.map(j =>
              j.id === job.id ? { ...j, status: 'COMPLETED' } : j
            )
          );
          setReviewingJob(job);
          // Remove from the available jobs list
          //setJobs(prev => prev.filter(j => j.id !== jobId));
        })
        .catch(err => {
          console.error(err);
          alert("Error picking up job.");
        });
  }
   const submitReview = () => {
    if (!reviewingJob || starRating < 1) {
      alert("Please select 1–5 stars");
      return;
    }
    const payload = {
      authorId: id,
      rating: starRating,
      text: reviewText
    };
    fetch(
      `http://localhost:8080/api/jobs/${reviewingJob.id}/reviews`,  // <-- added `/api`
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )
      .then(res => {
        if (!res.ok) throw new Error("Review failed");
        alert("Thanks for your review!");
        setReviewingJob(null);
        setStarRating(0);
        setReviewText("");
      })
      .catch(err => {
        console.error(err);
        alert("Error submitting review.");
      });
  };


  const closeReviewModal = () => {
    setReviewingJob(null);
    setStarRating(0);
    setReviewText('');
  };


  // Close the modal
  const closeModal = () => {
    setModalJob(null);
    setConversation(null);
    setMessages([]);
    setNewMessage('');
  };

  // Send a new message
  const handleSend = () => {
    if (!modalJob || !id || newMessage.trim() === "") return;

    const payload = { senderId: id, content: newMessage };
    fetch(
      `http://localhost:8080/api/messages/job/${modalJob.id}`,  // <-- back to messages
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )
      .then(res => res.json())
      .then((conv: Conversation) => {
        setConversation(conv);
        setMessages(conv.messages);
        setNewMessage("");
      })
      .catch(err => console.error("Send message error:", err));
  };

  const toggleExpand = (jobId: string) => {
  setExpanded(prev => {
    const next = new Set(prev);
    next.has(jobId) ? next.delete(jobId) : next.add(jobId);
    return next;
  });
};


  // sotring jobs
  const sortedPicked = [...pickedJobs].sort((a, b) =>
    a.status === 'COMPLETED' && b.status !== 'COMPLETED'
      ? 1
      : b.status === 'COMPLETED' && a.status !== 'COMPLETED'
      ? -1
      : 0
  );
  const sortedOutgoing = [...outgoingJobs].sort((a, b) =>
    a.status === 'COMPLETED' && b.status !== 'COMPLETED'
      ? 1
      : b.status === 'COMPLETED' && a.status !== 'COMPLETED'
      ? -1
      : 0
  );

  
   // mention user for job
  useEffect(() => {
    const ids = outgoingJobs
      .map(j => j.assignedUserId)
      .filter((u): u is string => !!u);
    const unique = Array.from(new Set(ids));
    Promise.all(
      unique.map(uid =>
        fetch(`http://localhost:8080/api/users/${uid}`)
          .then(r => r.json())
          .then((u: { id:string, name:string }) => [uid, u.name] as [string,string])
          .catch(() => [uid, uid] as [string,string])
      )
    ).then(entries => setPickerNames(Object.fromEntries(entries)));
  }, [outgoingJobs]);

  useEffect(() => {
  const ids = pickedJobs.map(j => j.userId);
  const unique = Array.from(new Set(ids));
  Promise.all(
    unique.map(uid =>
      fetch(`http://localhost:8080/api/users/${uid}`)
        .then(r => r.json())
        .then((u: { id: string; name: string }) => [uid, u.name] as [string,string])
        .catch(() => [uid, uid] as [string,string])
    )
  ).then(entries => setPosterNames(Object.fromEntries(entries)));
}, [pickedJobs]);

  return (
  <div className="page-wrapper">
    <nav className="main-nav">
      <div className="logo"><strong>Sixxer</strong></div>
      <div className="nav-buttons">
        <button onClick={() => navigate(-1)} className="nav-button">Back</button>
      </div>
    </nav>

    <div className="main-page-container">
      <aside className="main-left">
        <div className="left-banner"><h2>My Jobs</h2></div>

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

        <div className={`jobs-section job-list ${activeTab === 'picked' ? 'active' : ''}`}>
          {sortedPicked.map(job => {
            const isExpanded = expanded.has(job.id);
            return (
              <div
                key={job.id}
                className={`job-card ${job.status === 'COMPLETED' ? 'completed' : ''}`}
              >
                <div
                  className="job-header"
                  onClick={() => toggleExpand(job.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{job.jobName}</h3>
                  <span className={`chevron ${isExpanded ? 'open' : ''}`}>▾</span>
                </div>
                {isExpanded && (
                  <div className="job-details">
                    <p><strong>Posted by:</strong> {posterNames[job.userId] || job.userId}</p>
                    <p>{job.description}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                  </div>
                )}
                <div className="status-controls">
                  <button className="status-button" onClick={() => openMessage(job)}>
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        <div className={`jobs-section job-list ${activeTab === 'outgoing' ? 'active' : ''}`}>
          {sortedOutgoing.map(job => {
            const isExpanded = expanded.has(job.id);
            return (
              <div
                key={job.id}
                className={`job-card ${job.status === 'COMPLETED' ? 'completed' : ''}`}
              >
                <div
                  className="job-header"
                  onClick={() => toggleExpand(job.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{job.jobName}</h3>
                  <span className={`chevron ${isExpanded ? 'open' : ''}`}>▾</span>
                </div>
                {isExpanded && (
                  <div className="job-details">
                    <p><strong>Picked up by:</strong> {pickerNames[job.assignedUserId!] || '—'}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p>{job.jobName} PLEASE UPDATE ME</p>
                  </div>
                )}
                <div className="status-controls">
                  {job.status !== 'COMPLETED' && (
                    <button className="status-button" onClick={() => completeJob(job)}>
                      Complete
                    </button>
                  )}
                  {job.status !== 'COMPLETED' && (
                    <button className="status-button" onClick={() => openMessage(job)}>
                      Message
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </aside>

      <section className="main-right"></section>
    </div>

    {/* Message Modal */}
    {modalJob && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Conversation</h2>
          <div className="message-list">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="message-item">
                  <strong>{m.senderId === id ? 'You:' : 'Them:'}</strong> {m.content}
                </div>
              ))
            )}
          </div>
          <textarea
            className="message-input"
            rows={3}
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button className="send-button" onClick={handleSend}>Send</button>
        </div>
      </div>
    )}

    {/* Review Modal */}
    {reviewingJob && (
      <div className="modal-overlay" onClick={closeReviewModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>How did they do?</h2>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                className={`star ${n <= starRating ? 'filled' : ''}`}
                onClick={() => setStarRating(n)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className="message-input"
            rows={3}
            placeholder="Write your review..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
          />
          <button className="send-button" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      </div>
    )}
  </div>
);

}
