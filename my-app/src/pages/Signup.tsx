import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';



export default function SignUp() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      await response.json(); // Just await the response without storing it
      // Redirect to login page instead of main page
      //alert('Signup successful! Please login with your credentials.');
      navigate('/login');

    } catch (error) {
    console.error('Signup failed:', error);
    if (error instanceof Error) {
      alert('Signup failed: ' + error.message);
    } else {
      alert('Signup failed. Please check console.');
    }
}
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="quote-box">
          <p className="quote-label">SIX'ERR</p>
          <h2 className="quote-title">Join the Calm</h2>
          <p className="quote-sub">Let's start fresh, together</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="form-box">
          <h1 className="form-title">Create Account</h1>
          <p className="form-sub">Enter your information to get started</p>

          <form className="form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />

            <label>Password</label>
            <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />

            <label>Confirm Password</label>
            <input type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

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
