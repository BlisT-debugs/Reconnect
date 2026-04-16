import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
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
import Campaigns from './pages/alumni/Campaigns';
import Elections from './pages/alumni/Elections';
import Moderation from './pages/admin/Moderation';
import Chat from './pages/alumni/Chat';
import Membership from './pages/alumni/Membership';
import SocialFeed from './pages/alumni/SocialFeed';
import Helpdesk from './pages/alumni/Helpdesk';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (No Sidebar) */}
        <Route path="/" element={<Landing />} />
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
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;