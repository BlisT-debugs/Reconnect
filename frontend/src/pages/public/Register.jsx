// frontend/src/pages/public/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- 1. Import useNavigate and Link
import API from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        tenantId: 'admin'
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // <-- 2. Initialize the navigate function

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            
            // <-- 3. Tell React to change the page!
            navigate('/dashboard'); 
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Alumni Registration</h2>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" name="name" placeholder="Full Name" 
                    value={formData.name} onChange={handleChange} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="email" name="email" placeholder="Official Email" 
                    value={formData.email} onChange={handleChange} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" name="password" placeholder="Password" 
                    value={formData.password} onChange={handleChange} required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
            </form>

            {/* Added a quick link to the Login page for convenience */}
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;