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

  // Close the modal
  const closeModal = () => {
    setModalJob(null);
    setConversation(null);
    setMessages([]);
    setNewMessage('');
  };

  // Send a new message
  const handleSend = () => {
    if (!modalJob || !id || newMessage.trim() === '') return;
    const payload = { senderId: id, content: newMessage };
    fetch(`http://localhost:8080/api/messages/job/${modalJob.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then((conv: Conversation) => {
        setConversation(conv);
        setMessages(conv.messages);
        setNewMessage('');
      })
      .catch(err => console.error('Send message error:', err));
  };

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
            >My Picked Up Jobs</button>
            <button
              className={`tab-button ${activeTab === 'outgoing' ? 'active' : ''}`}
              onClick={() => handleTabClick('outgoing')}
            >My Outgoing Jobs</button>
          </div>

          <div className={`jobs-section job-list ${activeTab === 'picked' ? 'active' : ''}`}>
            {pickedJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.jobName}</h3>
                <p>{job.description}</p>
                <div className="status-controls">
                  <button className="status-button" onClick={() => openMessage(job)}>
                    Message
                  </button>
                </div>
              </div>
            ))}
            {pickedJobs.length === 0 && <p>No picked-up jobs.</p>}
          </div>

          <div className={`jobs-section job-list ${activeTab === 'outgoing' ? 'active' : ''}`}>
            {outgoingJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.jobName}</h3>
                <p>{job.description}</p>
                <div className="status-controls">
                  <button className="status-button" onClick={() => openMessage(job)}>
                    Message
                  </button>
                </div>
              </div>
            ))}
            {outgoingJobs.length === 0 && <p>No outgoing jobs.</p>}
          </div>
        </aside>

        <section className="main-right">{/* Optional details pane */}</section>
      </div>

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
    </div>
  );
}
