import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const EditProfile = () => {
    const navigate = useNavigate();
    
    // Changed batchId, departmentId to simple strings!
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', official_email: '', nickname: '', 
        phone: '', dob: '', blood_group: '', gender: '', about_me: '',
        company: '', designation: '',
        facebook_url: '', twitter_url: '', linkedin_url: '', instagram_url: '', github_url: '',
        state: '', city: '', zip: '', address: '',
        batch: '', department: '', passing_year: '',
        profile_pic: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExistingProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/alumni/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (data) {
                    if (data.dob) data.dob = data.dob.split('T')[0];
                    
                    // Map the actual string names from the relational tables back into our form
                    const mappedData = {
                        ...data,
                        batch: data.batch?.name || '',
                        department: data.department?.name || '',
                        passing_year: data.passingYear?.name || ''
                    };

                    const sanitizedData = Object.fromEntries(
                        Object.entries(mappedData).map(([key, value]) => [key, value === null ? '' : value])
                    );
                    setFormData(sanitizedData);
                    
                    if (sanitizedData.profile_pic) {
                        setImagePreview(`http://localhost:5000${sanitizedData.profile_pic}`);
                    }
                }
                setLoading(false);
            } catch (err) {
                setLoading(false); 
            }
        };
        fetchExistingProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.official_email && !formData.official_email.endsWith('@srmist.edu.in')) {
            alert('Official Email must end with @srmist.edu.in');
            return; 
        }
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = formData.profile_pic;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile);

                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            const finalProfileData = { ...formData, profile_pic: uploadedImagePath };

            await API.post('/alumni/profile', finalProfileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Full Profile & Image Updated Successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert('Error updating profile');
            console.error(err);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Profile Data...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '30px', backgroundColor: '#1e1e2f', color: 'white', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #0056b3', paddingBottom: '10px', textAlign: 'center' }}>Complete Alumni Profile</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ 
                        width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#2a2a3c', 
                        border: '3px solid #0056b3', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: '#aaa' }}>No Photo</span>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: '#fff', backgroundColor: '#2a2a3c', padding: '10px', borderRadius: '4px', cursor: 'pointer' }} />
                </div>

                <h3 style={headerStyle}>Personal Information</h3>
                <div style={gridStyle}>
                    <input type="text" name="first_name" placeholder="First Name *" value={formData.first_name} onChange={handleChange} required style={inputStyle} />
                    <input type="text" name="last_name" placeholder="Last Name *" value={formData.last_name} onChange={handleChange} required style={inputStyle} />
                    <input type="email" name="official_email" placeholder="Official Email" value={formData.official_email} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={inputStyle} />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
                    
                    <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* NEW: Blood Group Dropdown! */}
                    <select name="blood_group" value={formData.blood_group} onChange={handleChange} style={inputStyle}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <textarea name="about_me" placeholder="About Me / Bio" value={formData.about_me} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', width: '100%' }} />

                {/* NEW: Academic Text Fields (No more negative IDs!) */}
                <h3 style={headerStyle}>Academic Details</h3>
                <div style={gridStyle}>
                    <input type="text" name="batch" placeholder="Batch (e.g. 2022-2026)" value={formData.batch} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="department" placeholder="Department (e.g. Computer Science)" value={formData.department} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="passing_year" placeholder="Passing Year (e.g. 2026)" value={formData.passing_year} onChange={handleChange} style={inputStyle} />
                </div>

                <h3 style={headerStyle}>Professional Details</h3>
                <div style={gridStyle}>
                    <input type="text" name="company" placeholder="Current Company" value={formData.company} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} style={inputStyle} />
                </div>

                <h3 style={headerStyle}>Location Information</h3>
                <div style={gridStyle}>
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="zip" placeholder="ZIP / Postal Code" value={formData.zip} onChange={handleChange} style={inputStyle} />
                </div>
                <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px', width: '100%' }} />

                <h3 style={headerStyle}>Social Media Profiles</h3>
                <div style={gridStyle}>
                    <input type="text" name="linkedin_url" placeholder="LinkedIn URL" value={formData.linkedin_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="github_url" placeholder="GitHub URL" value={formData.github_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="twitter_url" placeholder="Twitter URL" value={formData.twitter_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="instagram_url" placeholder="Instagram URL" value={formData.instagram_url} onChange={handleChange} style={inputStyle} />
                    <input type="text" name="facebook_url" placeholder="Facebook URL" value={formData.facebook_url} onChange={handleChange} style={inputStyle} />
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button type="submit" style={btnStyle}>Save All Profile Data</button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ ...btnStyle, backgroundColor: '#6c757d' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', boxSizing: 'border-box' };
const headerStyle = { marginTop: '20px', marginBottom: '10px', color: '#a0a0ff' };
const btnStyle = { padding: '12px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', minWidth: '150px' };

export default EditProfile;