// frontend/src/pages/public/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send email and password to the Node backend
            const response = await API.post('/auth/login', formData);
            
            // If successful, save the new digital ID badge and go to the dashboard
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Alumni Login</h2>
            {message && <p style={{ color: 'red', marginBottom: '10px' }}>{message}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Official Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;