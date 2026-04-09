import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Gets the current URL path
    const [role, setRole] = useState('user');

    useEffect(() => {
        // Fetch the user's role so we know whether to show the Admin button
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');
                const { data } = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                setRole(data.role);
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // A helper function to make the active link light up!
    const linkStyle = (path) => ({
        display: 'block',
        padding: '12px 20px',
        color: location.pathname === path ? '#fff' : '#aaa',
        backgroundColor: location.pathname === path ? '#0056b3' : 'transparent',
        textDecoration: 'none',
        borderRadius: '4px',
        marginBottom: '10px',
        fontWeight: location.pathname === path ? 'bold' : 'normal',
        transition: '0.2s ease-in-out'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
            
            {/* --- SIDEBAR --- */}
            <div style={{ width: '250px', backgroundColor: '#1e1e2f', padding: '20px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '40px', fontSize: '24px' }}>
                    Alumni Portal
                </h2>
                
                {/* Navigation Links */}
                <div style={{ flex: 1 }}>
                    <Link to="/dashboard" style={linkStyle('/dashboard')}>🏠 Dashboard</Link>
                    <Link to="/edit-profile" style={linkStyle('/edit-profile')}>👤 My Profile</Link>
                    <Link to="/directory" style={linkStyle('/directory')}>👥 Directory</Link>
                    <Link to="/jobs" style={linkStyle('/jobs')}>💼 Job Board</Link>
                    <Link to="/events" style={linkStyle('/events')}>📅 Events</Link>
                    <Link to="/news" style={linkStyle('/news')}>📰 News</Link>
                    <Link to="/notices" style={linkStyle('/notices')}>📌 Notices</Link>
                    <Link to="/campaigns" style={linkStyle('/campaigns')}>💰 Campaigns</Link>
                    
                    {/* Only Admins see this link */}
                    {role === 'admin' && (
                        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
                            <Link to="/admin" style={linkStyle('/admin')}>🔒 Admin Panel</Link>
                        </div>
                    )}
                </div>

                {/* Logout Button sticks to the bottom */}
                <button onClick={handleLogout} style={{ padding: '12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                    🚪 Logout
                </button>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#121212' }}>
                {/* This <Outlet /> is magic. It renders whatever page you are currently on! */}
                <Outlet /> 
            </div>
            
        </div>
    );
};

export default Layout;