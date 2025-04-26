import React from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="quote-box">
          <p className="quote-label">SIX'ERR</p>
          <h2 className="quote-title">Join the Calm</h2>
          <p className="quote-sub">Let’s start fresh, together</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="form-box">
          <h1 className="form-title">Create Account</h1>
          <p className="form-sub">Enter your information to get started</p>

          <form className="form">
            <label>Username</label>
            <input type="text" placeholder="Choose a username" />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Create a password" />

            <label>Confirm Password</label>
            <input type="password" placeholder="Re-enter your password" />

            <button type="submit">Sign Up</button>
          </form>

          <p className="form-sub">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
