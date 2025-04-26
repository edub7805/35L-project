// Login.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

type Job = {
  id: number;
  text: string;
  top: string;
  left: string;
};

export default function Login() {
  const placeholders = ['placeholder'];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [nextIdx, setNextIdx] = useState(0);

  // refs for measuring
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current || !quoteRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const quoteRect     = quoteRef.current.getBoundingClientRect();

      // approximate popup size (tweak if yours differs)
      const popupWidth  = 120; // px
      const popupHeight = 30;  // px

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
    }, 3000);

    return () => clearInterval(interval);
  }, [nextIdx, placeholders]);

  const handleSubmit = () => {
    alert('Sign in Button pressed');
  };
  const handleSignUp = () => {
    alert('Sign up Button pressed');
  };

  return (
    <div className="login-container">
      <div className="login-left" ref={containerRef}>
        <div className="quote-box" ref={quoteRef}>
          <p className="quote-label">Six'err</p>
          <h2 className="quote-title">Release your tension</h2>
          <p className="quote-sub">You worked hard didn’t you</p>
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

          <form className="form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <div className="form-options">
              <label><input type="checkbox" /> Remember me</label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="#" onClick={handleSignUp}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
