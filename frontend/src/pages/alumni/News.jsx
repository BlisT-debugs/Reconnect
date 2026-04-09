import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const News = () => {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({ title: '', details: '', categoryName: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/content/news', { headers: { Authorization: `Bearer ${token}` } });
            setNewsList(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = '';

            // Upload the thumbnail image first
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); // Reusing our multer setup
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            // Save the News Article
            await API.post('/content/news', { ...formData, image: uploadedImagePath }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('News Published Successfully!');
            setShowModal(false);
            setFormData({ title: '', details: '', categoryName: '' });
            setImageFile(null);
            fetchNews();
        } catch (err) {
            alert('Error publishing news');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading News...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#17a2b8' }}>Campus News & Updates</h1>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Publish News</button>
            </div>

            {/* News Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {newsList.map((item) => (
                    <div key={item.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                        <div style={{ height: '180px', backgroundColor: '#2a2a3c' }}>
                            {item.image ? (
                                <img src={`http://localhost:5000${item.image}`} alt="News Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Image</div>
                            )}
                        </div>
                        <div style={{ padding: '20px' }}>
                            <span style={{ fontSize: '12px', backgroundColor: '#17a2b8', color: '#000', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{item.category?.name}</span>
                            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{item.title}</h3>
                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '10px' }}>{new Date(item.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: '14px', color: '#ccc', margin: 0 }}>{item.details}</p>
                        </div>
                    </div>
                ))}
                {newsList.length === 0 && <p style={{ color: '#aaa' }}>No news published yet.</p>}
            </div>

            {/* Post News Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Publish News Article</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="News Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="categoryName" placeholder="Category (e.g., Campus, Sports) *" value={formData.categoryName} onChange={handleChange} required style={inputStyle} />
                            <textarea name="details" placeholder="Full Story / Details *" value={formData.details} onChange={handleChange} required style={{ ...inputStyle, minHeight: '120px' }} />
                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '5px' }}>Thumbnail Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Publish</button>
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