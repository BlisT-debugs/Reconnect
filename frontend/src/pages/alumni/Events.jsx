// frontend/src/pages/alumni/Events.jsx
import { useState, useEffect } from 'react';
import API from '../../services/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', banner_image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/events', { headers: { Authorization: `Bearer ${token}` } });
            setEvents(data);
            setLoading(false);
        } catch (err) { 
            console.error("Failed to fetch events", err);
            setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = '';

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); 
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            await API.post('/events', { ...formData, banner_image: uploadedImagePath }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Event Created Successfully!');
            setShowModal(false);
            setFormData({ title: '', description: '', date: '', location: '', banner_image: '' });
            setImageFile(null);
            fetchData();
        } catch (err) {
            alert('Error creating event');
            console.error(err);
        }
    };

    // --- Master Delete Function ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Event?')) return;
        try {
            await API.delete(`/admin/moderate/event/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { 
            alert('Failed to delete event. Admin access required.'); 
            console.error(err);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Events...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#ffc107', margin: 0 }}>Campus Events</h1>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Host Event</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {events.map((evt) => (
                    <div key={evt.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', position: 'relative' }}>
                        
                        {/* --- Admin Controls --- */}
                        {role === 'admin' && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>
                                <button onClick={() => alert('Edit functionality coming soon!')} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit</button>
                                <button onClick={() => handleDelete(evt.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        )}

                        <div style={{ height: '150px', backgroundColor: '#2a2a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {evt.banner_image ? <img src={`http://localhost:5000${evt.banner_image}`} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#888' }}>No Image</span>}
                        </div>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#ffc107', paddingRight: '100px' }}>{evt.title}</h3>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#ccc' }}>📅 {new Date(evt.date).toLocaleString()}</p>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ccc' }}>📍 {evt.location}</p>
                            <p style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>{evt.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Modal for adding Events */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Host an Event</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Event Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="location" placeholder="Location *" value={formData.location} onChange={handleChange} required style={inputStyle} />
                            <textarea name="description" placeholder="Description *" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '80px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Event Banner Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Create Event</button>
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

export default Events;