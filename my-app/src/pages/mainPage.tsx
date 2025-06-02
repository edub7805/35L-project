import React, { FC, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import './mainPage.css';


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
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white font-sans">
      {/* Navigation with gradient background */}
      <nav className="flex justify-between items-center px-8 py-4 text-white w-full" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}>
        <div className="sixxer-logo">Sixxer</div>
        <div className="flex gap-2">
          <button onClick={handleMyJobs} className="nav-button-flush">My Jobs</button>
          <button onClick={handleUserStats} className="nav-button-flush">Statistics</button>
          <button onClick={handleCreatePost} className="nav-button-flush">+ Create Job</button>
        </div>
      </nav>

      {/* Main content container */}
      <div className="flex flex-1 w-full overflow-hidden relative" ref={containerRef}>
        {/* Left sidebar - Available Jobs */}
        <aside className="flex flex-col overflow-hidden min-w-[300px] sticky top-16 self-start h-[calc(100vh-4rem)]" style={{ flex: `0 0 ${leftPanelWidth}%` }}>
          {/* Banner with search */}
          <div className="bg-white pl-16 pr-8 py-6 sticky top-0 z-10 border-b border-gray-300">
            <h2 className="relative pb-1 mb-4 text-black text-2xl">
              Available Jobs
              <div className="gradient-accent-line"></div>
            </h2>
            <input
              className="search-icon-bg w-full py-2 pl-8 pr-2 border border-gray-300 rounded text-base text-black transition-all duration-200 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_2px_rgba(37,117,252,0.2)]"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          {/* Scrollable job list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 w-full scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {filtered.map(job => (
              <div key={job.id} className="job-card">
                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{job.jobName}</h3>
                  
                  {/* Poster Info */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Posted by</p>
                    <p className="text-lg font-semibold text-gray-800">{posterNames[job.userId] || job.userId}</p>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-base">{job.description}</p>
                  </div>
                </div>
                
                <div className="job-card-actions">
                  <button
                    onClick={() => handlePickUp(job.id, job.userId)}
                    className="illuminated-button-sm"
                  >
                    Pick Up
                  </button>
                  <button
                    className="view-profile-btn"
                    onClick={() => navigate(`/users/${job.userId}/profile`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-gray-600 text-center">No jobs found.</p>}
          </div>
        </aside>

        {/* Resizable divider */}
        <div
          ref={dividerRef}
          className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        {/* Right action panel */}
        <section className="flex justify-center items-center bg-white min-w-[250px]" style={{ flex: `0 0 ${100 - leftPanelWidth - 1}%` }}>
          <div className="action-box">
            <h2 className="mb-3 text-black relative pb-1 whitespace-nowrap overflow-hidden text-ellipsis text-2xl">
              Hello, {username || 'User'}!
              <div className="absolute rounded-sm bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}></div>
            </h2>
            <p className="mb-6 text-black">Ready to post a new job?</p>
            <button onClick={handleCreatePost} className="illuminated-button" style={{ marginTop: '0rem' }}>Create Job</button>
            
            <div className="pt- text-left border-t border-gray-300" style={{ marginTop: '1rem' }}>
              <h3 className="text-xl mb-4 text-black text-center">Your Rating</h3>
              {userRating ? (
                <>
                  <p className="mb-2 flex justify-between text-black">
                    <span className="flex items-center">
                      <span className="mr-2" style={{ color: '#2575fc' }}>•</span>
                      Average:
                    </span>
                    <span>{userRating.averageRating.toFixed(1)} ★</span>
                  </p>
                  <p className="mb-2 flex justify-between text-black">
                    <span className="flex items-center">
                      <span className="mr-2" style={{ color: '#2575fc' }}>•</span>
                      Reviews:
                    </span>
                    <span>{userRating.reviewCount}</span>
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Loading…</p>
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* Reviews Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeReviewModal}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Rating</th>
                    <th className="text-left p-2">Comment</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userReviews.map(r => (
                    <tr key={r.id} className="border-b">
                      <td className="p-2">{r.rating} ★</td>
                      <td className="p-2">{r.text}</td>
                      <td className="p-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 action-button w-full" onClick={closeReviewModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
