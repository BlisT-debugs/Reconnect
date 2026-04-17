import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const ResetPassword = () => {
    const { token } = useParams(); // Grabs the exact token from the URL!
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            // Hit the backend with the token in the URL and the new password in the body
            const { data } = await API.put(`/auth/reset-password/${token}`, { password });
            setMessage(data.message);
            
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: '#1e1e2f', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#28a745', textAlign: 'center' }}>Create New Password</h2>

                {message && <div style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>✅ {message} Redirecting...</div>}
                {error && <div style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="password" 
                        placeholder="New Password (min 5 chars)" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        minLength="5"
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', outline: 'none' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        minLength="5"
                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', outline: 'none' }}
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Save Password & Log In
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                    <Link to="/login" style={{ color: '#888', textDecoration: 'none' }}>Cancel and go back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;