import { useState, useEffect } from 'react';
import API from '../../services/api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);
    
    // --- NEW: Edit States ---
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', company: '', location: '', description: '',
        salary_range: '', experience_required: '', apply_link: '', deadline: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            const { data } = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
            setJobs(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', company: '', location: '', description: '', salary_range: '', experience_required: '', apply_link: '', deadline: '' });
        setShowModal(true);
    };

    const handleEdit = (job) => {
        setEditMode(true);
        setEditId(job.id);
        setFormData({
            title: job.title, company: job.company, 
            location: job.location || '', description: job.description, 
            salary_range: job.salary_range || '', experience_required: job.experience_required || '', 
            apply_link: job.apply_link || '', 
            deadline: job.deadline ? job.deadline.split('T')[0] : ''
        });
        setShowModal(true);
    };

    // --- UPDATED: Smart Submit handles both POST and PUT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await API.put(`/jobs/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Job Updated Successfully!');
            } else {
                await API.post('/jobs', formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Job Posted Successfully!');
            }
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving job'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this job?')) return;
        try {
            await API.delete(`/admin/moderate/job/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete job.'); }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Jobs...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff', margin: 0 }}>Alumni Job Board</h1>
                <button onClick={handleAddNew} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Post a Job</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {jobs.map((job) => (
                    <div key={job.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        {(role === 'admin' || currentUserId === job.userId) && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                {/* Hooked up the handleEdit function! */}
                                <button onClick={() => handleEdit(job)} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit</button>
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
                        </div>
                    </div>
                ))}
            </div>

            {/* Smart Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>
                            {editMode ? 'Edit Job Post' : 'Post a New Job'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Job Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="company" placeholder="Company Name *" value={formData.company} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="location" placeholder="Location (e.g. Chennai, Remote)" value={formData.location} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="salary_range" placeholder="Salary Range (e.g. 8-12 LPA)" value={formData.salary_range} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="experience_required" placeholder="Experience Required" value={formData.experience_required} onChange={handleChange} style={inputStyle} />
                            <textarea name="description" placeholder="Job Description *" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px' }} />
                            <input type="text" name="apply_link" placeholder="Apply Link or Contact Email" value={formData.apply_link} onChange={handleChange} style={inputStyle} />
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editMode ? '#ffc107' : '#28a745', color: editMode ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {editMode ? 'Save Changes' : 'Submit Job'}
                                </button>
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