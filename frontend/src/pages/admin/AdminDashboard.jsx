import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPendingUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/admin/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(data);
            setLoading(false);
        } catch (err) {
            setError('Access Denied: You do not have admin privileges.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await API.post('/admin/approve', { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User Approved Successfully!');
            fetchPendingUsers(); // Refresh the list instantly
        } catch (err) {
            alert('Failed to approve user');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Admin Panel...</p>;
    if (error) return <p style={{ textAlign: 'center', marginTop: '50px', color: '#ff4d4d', fontWeight: 'bold', fontSize: '20px' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#dc3545' }}>Admin Security Panel</h1>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Back to Dashboard
                </button>
            </div>

            <div style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', padding: '20px', border: '1px solid #444' }}>
                <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Pending Approvals</h2>

                {pendingUsers.length === 0 ? (
                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>No pending users. The directory is secure!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {pendingUsers.map(user => (
                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2a2a3c', padding: '15px', borderRadius: '4px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{user.name}</h3>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>{user.email} | Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => handleApprove(user.id)} 
                                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Approve Access
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;