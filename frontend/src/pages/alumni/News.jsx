import { useState, useEffect } from 'react';
import API from '../../services/api';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    
    // Edit States
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({ title: '', details: '', categoryName: '', image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/content/news', { headers: { Authorization: `Bearer ${token}` } });
            setNewsList(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', details: '', categoryName: '', image: '' });
        setImageFile(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setEditId(item.id);
        setFormData({
            title: item.title,
            details: item.details,
            categoryName: item.category?.name || '',
            image: item.image || ''
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = formData.image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); 
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            const payload = { ...formData, image: uploadedImagePath };

            if (editMode) {
                await API.put(`/content/news/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                alert('News Updated Successfully!');
            } else {
                await API.post('/content/news', payload, { headers: { Authorization: `Bearer ${token}` } });
                alert('News Published Successfully!');
            }
            
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving news'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this News Article?')) return;
        try {
            await API.delete(`/admin/moderate/news/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading News...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#17a2b8', margin: 0 }}>Campus News</h1>
                <button onClick={handleAddNew} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Publish News</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {newsList.map((item) => (
                    <div key={item.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', position: 'relative' }}>
                        
                        {role === 'admin' && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>
                                <button onClick={() => handleEdit(item)} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        )}

                        <div style={{ height: '180px', backgroundColor: '#2a2a3c' }}>
                            {item.image ? <img src={`http://localhost:5000${item.image}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Image</div>}
                        </div>
                        <div style={{ padding: '20px' }}>
                            <span style={{ fontSize: '12px', backgroundColor: '#17a2b8', color: '#000', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{item.category?.name}</span>
                            <h3 style={{ margin: '10px 0', fontSize: '18px', paddingRight: role==='admin'?'90px':'0' }}>{item.title}</h3>
                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '10px' }}>{new Date(item.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: '14px', color: '#ccc', margin: 0 }}>{item.details}</p>
                        </div>
                    </div>
                ))}
                {newsList.length === 0 && <p style={{ color: '#aaa', gridColumn: '1 / -1' }}>No news published yet.</p>}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>
                            {editMode ? 'Edit News Article' : 'Publish News Article'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="News Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="categoryName" placeholder="Category (e.g., Campus, Sports) *" value={formData.categoryName} onChange={handleChange} required style={inputStyle} />
                            <textarea name="details" placeholder="Full Story / Details *" value={formData.details} onChange={handleChange} required style={{ ...inputStyle, minHeight: '120px' }} />
                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Thumbnail Image (Leave empty to keep current)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editMode ? '#ffc107' : '#28a745', color: editMode ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {editMode ? 'Save Changes' : 'Publish'}
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

export default News;