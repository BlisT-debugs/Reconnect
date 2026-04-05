import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', official_email: '', nickname: '', 
        phone: '', dob: '', blood_group: '', gender: '', about_me: '',
        company: '', designation: '',
        facebook_url: '', twitter_url: '', linkedin_url: '', instagram_url: '', github_url: '',
        state: '', city: '', zip: '', address: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExistingProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/alumni/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data) {
                    // Format date for the input field (YYYY-MM-DD)
                    if (data.dob) data.dob = data.dob.split('T')[0];
                    setFormData(data);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false); // If 404, it just means they haven't made a profile yet
            }
        };
        fetchExistingProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await API.post('/alumni/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile Updated Successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert('Error updating profile');
        }
    };

    if (loading) return <p>Loading Profile Data...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #0056b3', paddingBottom: '10px' }}>Edit Alumni Profile</h2>
            
            <form onSubmit={handleSubmit}>
                {/* --- Section 1: Personal Details --- */}
                <h3>Personal Information</h3>
                <div style={gridStyle}>
                    <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required style={inputStyle} />
                    <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required style={inputStyle} />
                    <input type="email" name="official_email" placeholder="Official Email (srmist.edu.in)" value={formData.official_email} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={inputStyle} />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
                    <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* --- Section 2: Professional Details --- */}
                <h3>Professional Details</h3>
                <div style={gridStyle}>
                    <input type="text" name="company" placeholder="Current Company" value={formData.company} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} style={inputStyle} />
                </div>

                {/* --- Section 3: Social Links --- */}
                <h3>Social Media Profiles</h3>
                <div style={gridStyle}>
                    <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={formData.linkedin_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="github_url" placeholder="GitHub URL" value={formData.github_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="facebook_url" placeholder="Facebook URL" value={formData.facebook_url} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={{ marginTop: '30px' }}>
                    <button type="submit" style={btnStyle}>Save All Profile Data</button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ ...btnStyle, backgroundColor: '#6c757d', marginLeft: '10px' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

// Simple styles for layout
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle = { padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default EditProfile;