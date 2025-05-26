import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/create_job'
import MainPage from './pages/mainPage'
import UserStats from './pages/UserStats';
import Leaderboard from './pages/Leaderboard';
import myJobs from './pages/myJobs';
import MyJobs from './pages/myJobs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        
        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* make job post Page*/} 
        <Route path="/users/:id/createpost" element={<CreatePost />} />

        {/* main page*/} 
        <Route path="/users/:id/mainPage" element={<MainPage />} />

        {/* User Statistics Page */}
        <Route path="/users/:id/stats" element={<UserStats />} />

        {/* My Jobs Page */}
        <Route path="/users/:id/myJobs" element={<MyJobs />} />

        {/* Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />

      </Routes>
    </Router>
  );
}

export default App;
