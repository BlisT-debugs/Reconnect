import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', banner_image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/events', { headers: { Authorization: `Bearer ${token}` } });
            setEvents(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = '';

            // Step 1: Upload the banner image (reusing our existing upload route!)
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); // We use 'profile_pic' field name since our multer expects it
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            // Step 2: Save the Event
            await API.post('/events', { ...formData, banner_image: uploadedImagePath }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Event Created Successfully!');
            setShowModal(false);
            setFormData({ title: '', description: '', date: '', location: '', banner_image: '' });
            setImageFile(null);
            fetchEvents();
        } catch (err) {
            alert('Error creating event');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Events...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#ffc107' }}>Campus Events & Meets</h1>
                <div>
                    <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>+ Host Event</button>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dashboard</button>
                </div>
            </div>

            {/* Event Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {events.map((evt) => (
                    <div key={evt.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                        {/* Event Banner */}
                        <div style={{ height: '150px', backgroundColor: '#2a2a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {evt.banner_image ? (
                                <img src={`http://localhost:5000${evt.banner_image}`} alt="Event Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#888' }}>No Image</span>
                            )}
                        </div>
                        
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#ffc107' }}>{evt.title}</h3>
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