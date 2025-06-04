import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "./myJobs.css";

// Job and user types
type JobPostStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
interface JobPost {
  id: string;
  userId: string;
  assignedUserId?: string;
  jobName: string;
  description: string;
  status: JobPostStatus;
  date: string;
  startTime: string;
  endTime: string;
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

  // Load poster names
  useEffect(() => {
    const ids = pickedJobs.map(j => j.userId);
    const unique = Array.from(new Set(ids));
    Promise.all(
      unique.map(uid =>
        fetch(`http://localhost:8080/api/users/${uid}`)
          .then(r => r.json())
          .then((u: { id: string; name: string }) => [uid, u.name] as [string, string])
          .catch(() => [uid, uid] as [string, string])
      )
    ).then(entries => setPosterNames(Object.fromEntries(entries)));
  }, [pickedJobs]);

  // Load picker names
  useEffect(() => {
    const ids = outgoingJobs.map(j => j.assignedUserId).filter((u): u is string => !!u);
    const unique = Array.from(new Set(ids));
    Promise.all(
      unique.map(uid =>
        fetch(`http://localhost:8080/api/users/${uid}`)
          .then(r => r.json())
          .then((u: { id: string; name: string }) => [uid, u.name] as [string, string])
          .catch(() => [uid, uid] as [string, string])
      )
    ).then(entries => setPickerNames(Object.fromEntries(entries)));
  }, [outgoingJobs]);

  const handleTabClick = (tab: 'picked' | 'outgoing') => setActiveTab(tab);

  const toggleExpand = (jobId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(jobId) ? next.delete(jobId) : next.add(jobId);
      return next;
    });
  };

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
    fetch(`http://localhost:8080/api/jobs/${job.id}/complete?userId=${job.userId}`, { method: 'PUT' })
      .then(res => {
        if (!res.ok) throw new Error();
        setOutgoingJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'COMPLETED' } : j));
        setReviewingJob(job);
      })
      .catch(() => alert('Error completing job'));
  };

  const submitReview = () => {
    if (!reviewingJob || starRating < 1) return;
    fetch(`http://localhost:8080/api/jobs/${reviewingJob.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: id, rating: starRating, text: reviewText })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        alert('Thanks for your review!');
        setReviewingJob(null);
        setStarRating(0);
        setReviewText('');
      })
      .catch(() => alert('Error submitting review'));
  };

  const closeReviewModal = () => {
    setReviewingJob(null);
    setStarRating(0);
    setReviewText('');
  };

  const closeModal = () => {
    setModalJob(null);
    setConversation(null);
    setMessages([]);
    setNewMessage('');
  };

  const handleSend = () => {
    if (!modalJob || !id || !newMessage.trim()) return;
    fetch(`http://localhost:8080/api/messages/job/${modalJob.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: id, content: newMessage })
    })
      .then(res => res.json())
      .then((conv: Conversation) => {
        setConversation(conv);
        setMessages(conv.messages);
        setNewMessage('');
      });
  };

  const sortedPicked = [...pickedJobs].sort((a, b) =>
    a.status === 'COMPLETED' && b.status !== 'COMPLETED' ? 1 :
    b.status === 'COMPLETED' && a.status !== 'COMPLETED' ? -1 : 0
  );
  const sortedOutgoing = [...outgoingJobs].sort((a, b) =>
    a.status === 'COMPLETED' && b.status !== 'COMPLETED' ? 1 :
    b.status === 'COMPLETED' && a.status !== 'COMPLETED' ? -1 : 0
  );

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white font-sans">
      <nav className="flex justify-between items-center py-4 text-white w-full" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}>
        <div className="sixxer-logo" onClick={() => navigate(`/users/${id}/mainPage`)}>Sixxer</div>
        <div className="nav-buttons">
          <button onClick={() => navigate(-1)} className="nav-button-flush">Back</button>
        </div>
      </nav>
      <div className="flex flex-1 w-full overflow-hidden">
        <aside className="flex flex-col w-full max-w-4xl mx-auto p-8">
          <div className="mb-6">
            <h2 className="relative pb-1 mb-6 text-black text-3xl font-bold">
              My Jobs
              <div className="gradient-accent-line"></div>
            </h2>
          </div>
          <div className="flex border-b border-gray-300 mb-6">
            <button 
              className={`flex-1 py-3 px-4 text-base font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'picked' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => handleTabClick('picked')}
            >
              My Picked Up Jobs
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-base font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'outgoing' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => handleTabClick('outgoing')}
            >
              My Outgoing Jobs
            </button>
          </div>

          {/* Picked-Up Jobs */}
          <div className={`${activeTab === 'picked' ? 'block' : 'hidden'}`}>
            <div className="space-y-4">
              {sortedPicked.map(job => {
                const isExpanded = expanded.has(job.id);
                return (
                  <div key={job.id} className={`job-card ${job.status === 'COMPLETED' ? 'opacity-50' : ''}`}>
                    <div className="flex-1">
                      {/* Job Title */}
                      <div className="mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{job.jobName}</h3>
                      </div>
                      
                      {/* Poster Info */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Posted by</p>
                        <p className="text-lg font-semibold text-gray-800">{posterNames[job.userId] || job.userId}</p>
                      </div>
                      
                      {/* Dropdown Arrow */}
                      <div 
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleExpand(job.id)}
                      >
                        <span className={`text-gray-400 text-3xl transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}>
                          ▾
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="space-y-3">
                          {/* Description */}
                          <div className="mb-4">
                            <p className="text-gray-700 leading-relaxed text-base">{job.description}</p>
                          </div>
                          
                          {/* Additional Details */}
                          <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Date:</span> {job.date}</p>
                            <p><span className="font-semibold">Time:</span> {job.startTime} – {job.endTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="job-card-actions">
                      <button className="view-profile-btn" onClick={() => openMessage(job)}>
                        Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outgoing Jobs */}
          <div className={`${activeTab === 'outgoing' ? 'block' : 'hidden'}`}>
            <div className="space-y-4">
              {sortedOutgoing.map(job => {
                const isExpanded = expanded.has(job.id);
                return (
                  <div key={job.id} className={`job-card ${job.status === 'COMPLETED' ? 'opacity-50' : ''}`}>
                    <div className="flex-1">
                      {/* Job Title */}
                      <div className="mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{job.jobName}</h3>
                      </div>
                      
                      {/* Picker Info */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Picked up by</p>
                        <p className="text-lg font-semibold text-gray-800">{pickerNames[job.assignedUserId!] || '—'}</p>
                      </div>
                      
                      {/* Dropdown Arrow */}
                      <div 
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleExpand(job.id)}
                      >
                        <span className={`text-gray-400 text-3xl transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}>
                          ▾
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="space-y-3">
                          {/* Description */}
                          <div className="mb-4">
                            <p className="text-gray-700 leading-relaxed text-base">{job.description}</p>
                          </div>
                          
                          {/* Additional Details */}
                          <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Date:</span> {job.date}</p>
                            <p><span className="font-semibold">Time:</span> {job.startTime} – {job.endTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="job-card-actions">
                      {job.status !== 'COMPLETED' && (
                        <button className="illuminated-button-sm" onClick={() => completeJob(job)}>
                          Complete
                        </button>
                      )}
                      <button className="view-profile-btn" onClick={() => openMessage(job)}>
                        Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
        <section className="flex-1"></section>
      </div>

      {/* Message Modal */}
      {modalJob && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50" 
          onClick={closeModal}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl mx-4 flex flex-col"
            onClick={e => e.stopPropagation()}
            style={{ 
              width: '600px',
              height: '500px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              border: '2px solid #2575fc'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Conversation</h2>
            <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-50" style={{ borderColor: '#2575fc', borderWidth: '1px' }}>
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="mb-3 text-gray-700">
                    <span className="font-semibold text-gray-900">
                      {m.senderId === id ? 'You:' : 'Them:'}
                    </span> {m.content}
                  </div>
                ))
              )}
            </div>
            <textarea 
              className="w-full resize-none p-3 border border-gray-300 rounded mb-4 text-base focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,117,252,0.2)]"
              rows={3} 
              placeholder="Type a message..." 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
            />
            <button className="illuminated-button self-end" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingJob && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50" 
          onClick={closeReviewModal}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw'
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 mx-4" 
            onClick={e => e.stopPropagation()}
            style={{ 
              width: '400px',
              maxWidth: '90vw',
              border: '2px solid #2575fc'
            }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">How did they do?</h2>
            <div className="mb-6">
              <div className="flex justify-center gap-2 text-4xl">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n} 
                    type="button"
                    className={`p-2 transition-colors duration-200 ${n <= starRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-300`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStarRating(n);
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              className="w-full resize-none p-3 border border-gray-300 rounded mb-6 text-base focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,117,252,0.2)]"
              rows={4} 
              placeholder="Write your review..." 
              value={reviewText} 
              onChange={e => setReviewText(e.target.value)}
            />
            <button className="illuminated-button w-full" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
