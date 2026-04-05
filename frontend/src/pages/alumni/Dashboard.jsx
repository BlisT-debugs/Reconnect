import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/register'); // Kick them out if no token
                return;
            }

            try {
                // Send the token in the headers!
                const response = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Token failed", error);
                localStorage.removeItem('token');
                navigate('/register');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/register');
    };

    if (!userData) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h3>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Alumni Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            <Link to="/edit-profile">
                <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Complete Your Profile
                </button>
            </Link>
            <Link to="/directory">
                <button style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    View Alumni Directory
                </button>
            </Link>
            <Link to="/jobs">
                <button style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Job Board
                </button>
            </Link>
            <div style={{ padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '8px', marginTop: '20px' }}>
                <h2>Welcome back, {userData.name}!</h2>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.role}</p>
                <p><strong>Tenant Link:</strong> {userData.tenantId}</p>
            </div>
        </div>
    );
};

export default Dashboard;