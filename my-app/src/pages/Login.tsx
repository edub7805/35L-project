import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

type Job = {
  id: number;
  text: string;
  top: string;
  left: string;
};

export default function Login() {
  const placeholders = ['SIXXER'];
  
  // list of catchphrases
  const catchphrases = [
    "Release your tension",
    "Let others handle the work",
    "Relax while tasks get done",
    "Delegate and unwind",
    "Your time is precious",
    "Sit back and breathe",
    "Outsource your stress",
    "Find your peace",
    "Let go of the burden",
    "Others work, you relax"
  ];
    
  const [jobs, setJobs] = useState<Job[]>([]);
  const [nextIdx, setNextIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [catchphrase, setCatchphrase] = useState("");

  // refs for measuring
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef     = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Select a random catchphrase
    const randomIndex = Math.floor(Math.random() * catchphrases.length);
    setCatchphrase(catchphrases[randomIndex]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current || !quoteRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const quoteRect     = quoteRef.current.getBoundingClientRect();

      // approximate popup size (tweak if yours differs)
      const popupWidth  = 120; // px
      const popupHeight = 40;  // px

      let topPct: number;
      let leftPct: number;
      let topPx: number;
      let leftPx: number;

      // retry until the popup rect does NOT overlap the quote-box rect
      do {
        topPct  = 10 + Math.random() * 60; // anywhere from 10% to 70%
        leftPct = 10 + Math.random() * 60; // anywhere from 10% to 70%

        topPx   = (containerRect.height * topPct)  / 100;
        leftPx  = (containerRect.width  * leftPct) / 100;
      } while (
        leftPx  < quoteRect.right  - containerRect.left  &&
        leftPx + popupWidth > quoteRect.left   - containerRect.left &&
        topPx   < quoteRect.bottom - containerRect.top   &&
        topPx  + popupHeight> quoteRect.top    - containerRect.top
      );

      const id   = Date.now();
      const text = placeholders[nextIdx % placeholders.length];
      const top  = `${topPct}%`;
      const left = `${leftPct}%`;

      setJobs(js => [...js, { id, text, top, left }]);
      setNextIdx(i => i + 1);

      // remove after 5s
      setTimeout(() => {
        setJobs(js => js.filter(j => j.id !== id));
      }, 5000);
    }, 2000);

    return () => clearInterval(interval);
  }, [nextIdx, placeholders]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    
    const payload = {
      email: email,
      password: password,
    };
    
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const data = await response.json();
      const userId = data.id;
      
      // Navigate to the main page with the user ID
      navigate(`/users/${userId}/mainPage`);
      
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('Login failed. Please check your credentials.');
      }
    }
  };
  
  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/signup');
  }

  return (
    <div className="login-container">
      <div className="login-left" ref={containerRef}>
        <div className="quote-box" ref={quoteRef}>
          <p className="quote-label">Sixxer®</p>
          <h2 className="quote-title">{catchphrase}</h2>
          <p className="quote-sub">You worked hard didn't you</p>
        </div>

        {jobs.map(({ id, text, top, left }) => (
          <div
            key={id}
            className="job-popup"
            style={{ top, left }}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="login-right">
        <div className="form-box">
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-sub">Enter your email and password to access your account</p>

          <form className="form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div className="form-options">
              <label><input type="checkbox" /> Remember me</label>
              <a href="#" onClick={handleForgotPassword} >Forgot Password?</a>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="#" onClick={handleSignUp}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
