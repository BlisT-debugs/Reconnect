// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import Dashboard from './pages/alumni/Dashboard';
import EditProfile from './pages/alumni/EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Register for now */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;