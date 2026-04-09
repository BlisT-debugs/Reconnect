// frontend/src/pages/alumni/Jobs.jsx
import { useState, useEffect } from 'react';
import API from '../../services/api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '', company: '', location: '', description: '',
        salary_range: '', experience_required: '', apply_link: '', deadline: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            // Get user role for permissions
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            // Get jobs
            const { data } = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
            setJobs(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/jobs', formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert('Job Posted Successfully!');
            setShowModal(false);
            setFormData({ title: '', company: '', location: '', description: '', salary_range: '', experience_required: '', apply_link: '', deadline: '' }); 
            fetchData();
        } catch (err) { 
            alert('Error posting job'); 
            console.error(err);
        }
    };

    // --- Master Delete Function ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this job?')) return;
        try {
            await API.delete(`/admin/moderate/job/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); // Refresh list instantly
        } catch (err) { 
            alert('Failed to delete job. Admin access required.'); 
            console.error(err);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Jobs...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff', margin: 0 }}>Alumni Job Board</h1>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Post a Job</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {jobs.map((job) => (
                    <div key={job.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        {/* --- Admin / Owner Controls --- */}
                        {(role === 'admin' || currentUserId === job.userId) && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                <button onClick={() => alert('Edit functionality coming soon!')} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit</button>
                                <button onClick={() => handleDelete(job.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        )}

                        <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#fff', paddingRight: '100px' }}>{job.title}</h3>
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#007bff', fontWeight: 'bold' }}>{job.company}</p>
                        <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span>📍 {job.location || 'Remote'}</span>
                            <span>💼 Exp: {job.experience_required || 'Not specified'}</span>
                            <span>💰 {job.salary_range || 'Competitive'}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#aaa', flexGrow: 1 }}>{job.description}</p>
                        
                        <div style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#777' }}>Posted by: {job.postedBy?.name || 'Unknown'}</span>
                            {job.apply_link && (
                                <a href={job.apply_link.startsWith('http') ? job.apply_link : `mailto:${job.apply_link}`} target="_blank" rel="noreferrer" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>Apply</a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Job Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Post a New Job</h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Job Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="company" placeholder="Company Name *" value={formData.company} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="location" placeholder="Location (e.g. Chennai, Remote)" value={formData.location} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="salary_range" placeholder="Salary Range (e.g. 8-12 LPA)" value={formData.salary_range} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="experience_required" placeholder="Experience Required (e.g. 2+ Years, Fresher)" value={formData.experience_required} onChange={handleChange} style={inputStyle} />
                            <textarea name="description" placeholder="Job Description *" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px' }} />
                            <input type="text" name="apply_link" placeholder="Apply Link or Contact Email" value={formData.apply_link} onChange={handleChange} style={inputStyle} />
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Job</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', boxSizing: 'border-box', width: '100%' };

export default Jobs;