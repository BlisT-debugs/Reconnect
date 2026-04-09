import { useState, useEffect } from 'react';
import API from '../../services/api';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', details: '', categoryName: '' });

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/content/notices', { headers: { Authorization: `Bearer ${token}` } });
            setNotices(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotices(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await API.post('/content/notices', formData, { headers: { Authorization: `Bearer ${token}` } });
            alert('Notice Posted Successfully!');
            setShowModal(false);
            setFormData({ title: '', details: '', categoryName: '' });
            fetchNotices();
        } catch (err) {
            alert('Error posting notice');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Notices...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#ff4d4d' }}>Official Notices</h1>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Post Notice</button>
            </div>

            {/* List of Notices (Vertical layout because they are text-heavy) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notices.map((notice) => (
                    <div key={notice.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ff4d4d' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{notice.title}</h3>
                            <span style={{ fontSize: '12px', backgroundColor: '#333', padding: '4px 10px', borderRadius: '15px', color: '#ccc' }}>{notice.category?.name}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Posted on: {new Date(notice.date).toLocaleDateString()}</p>
                        <p style={{ margin: 0, color: '#ddd', lineHeight: '1.5' }}>{notice.details}</p>
                    </div>
                ))}
                {notices.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No official notices at this time.</p>}
            </div>

            {/* Post Notice Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Post Official Notice</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Notice Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="categoryName" placeholder="Category (e.g., Exam, Admin) *" value={formData.categoryName} onChange={handleChange} required style={inputStyle} />
                            <textarea name="details" placeholder="Notice Details *" value={formData.details} onChange={handleChange} required style={{ ...inputStyle, minHeight: '150px' }} />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Post Notice</button>
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

export default Notices;