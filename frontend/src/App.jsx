import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import Dashboard from './pages/alumni/Dashboard';
import EditProfile from './pages/alumni/EditProfile';
import Directory from './pages/alumni/Directory';
import Jobs from './pages/alumni/Jobs';
import Events from './pages/alumni/Events';
import AdminDashboard from './pages/admin/AdminDashboard';
import Layout from './components/Layout'; 
import News from './pages/alumni/News';
import Notices from './pages/alumni/Notices';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (No Sidebar) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* PRIVATE ROUTES (Wrapped inside the Sidebar Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/notices" element={<Notices />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;