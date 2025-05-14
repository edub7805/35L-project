import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/create_job'

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

      </Routes>
    </Router>
  );
}

export default App;
