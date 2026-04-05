import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // State for the "Post a Job" form
    const [formData, setFormData] = useState({
        title: '', company: '', location: '', description: '',
        salary_range: '', experience_required: '', apply_link: '', deadline: ''
    });

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await API.post('/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Job Posted Successfully!');
            setShowModal(false); // Close the popup
            setFormData({ title: '', company: '', location: '', description: '', salary_range: '', experience_required: '', apply_link: '', deadline: '' }); // Clear form
            fetchJobs(); // Refresh the job list instantly
        } catch (err) {
            alert('Error posting job');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Jobs...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff' }}>Alumni Job Board</h1>
                <div>
                    <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>
                        + Post a Job
                    </button>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Dashboard
                    </button>
                </div>
            </div>

            {/* Grid of Job Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {jobs.map((job) => (
                    <div key={job.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#fff' }}>{job.title}</h3>
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#007bff', fontWeight: 'bold' }}>{job.company}</p>
                        
                        <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span>📍 {job.location || 'Remote / Not specified'}</span>
                            <span>💼 Exp: {job.experience_required || 'Not specified'}</span>
                            <span>💰 {job.salary_range || 'Competitive'}</span>
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#aaa', flexGrow: 1 }}>{job.description}</p>
                        
                        <div style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#777' }}>Posted by: {job.postedBy.name}</span>
                            {job.apply_link && (
                                <a href={job.apply_link.startsWith('http') ? job.apply_link : `mailto:${job.apply_link}`} target="_blank" rel="noreferrer" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>
                                    Apply Now
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>No active jobs found. Be the first to post one!</p>}

            {/* --- MODAL FOR POSTING A NEW JOB --- */}
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