import './Login.css';
// Maybe make it so the job posting pop up on the side



export default function Login() {

  const handleSubmit = (): void =>{
    alert('Sign in Button pressed');
  }
  const handleSignUp = (): void =>{
    alert('Sign up Button pressed');
  }
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="quote-box">
          <p className="quote-label">Six'err</p>
          <h2 className="quote-title">Release your tension</h2>
          <p className="quote-sub">You worked hard didn’t you</p>
        </div>
      </div>

      <div className="login-right">
        <div className="form-box">
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-sub">Enter your email and password to access your account</p>

          <form className="form">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <div className="form-options">
              <a href="#"></a>
            </div>

            <button type="submit" onClick={handleSubmit}>Sign In</button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="#" onClick={handleSignUp}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
