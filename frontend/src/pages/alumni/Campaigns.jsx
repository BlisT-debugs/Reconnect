import { useState, useEffect } from 'react';
import API from '../../services/api';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);

    // Edit States
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            const { data } = await API.get('/campaigns', { headers: { Authorization: `Bearer ${token}` } });
            setCampaigns(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });
        setShowModal(true);
    };

    const handleEdit = (camp) => {
        setEditMode(true);
        setEditId(camp.id);
        const formattedDate = camp.deadline ? new Date(camp.deadline).toISOString().slice(0, 10) : '';
        setFormData({
            title: camp.title,
            description: camp.description,
            categoryName: camp.category?.name || '',
            target_amount: camp.target_amount,
            deadline: formattedDate
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await API.put(`/campaigns/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Campaign Updated Successfully!');
            } else {
                await API.post('/campaigns', formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Campaign Created Successfully!');
            }
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving campaign'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Campaign?')) return;
        try {
            await API.delete(`/admin/moderate/campaign/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    const handleDonate = async (campaignId) => {
        try {
            await API.post('/campaigns/donate', { campaignId, amount: 50 }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert("Donation successful!");
            fetchData();
        } catch (err) { alert('Donation failed'); }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Campaigns...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#28a745', margin: 0 }}>Fundraising Campaigns</h1>
                <button onClick={handleAddNew} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Start Campaign</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {campaigns.map((camp) => (
                    <div key={camp.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', position: 'relative' }}>
                        
                        {(role === 'admin' || currentUserId === camp.userId) && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleEdit(camp)} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit</button>
                                <button onClick={() => handleDelete(camp.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        )}

                        <span style={{ fontSize: '12px', backgroundColor: '#28a745', color: '#fff', padding: '3px 8px', borderRadius: '12px' }}>{camp.category?.name}</span>
                        <h3 style={{ margin: '10px 0', fontSize: '20px', paddingRight: '90px' }}>{camp.title}</h3>
                        <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>{camp.description}</p>
                        
                        <div style={{ backgroundColor: '#2a2a3c', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span>Raised: <strong style={{ color: '#28a745' }}>INR {camp.raised_amount}</strong></span>
                                <span>Target: INR {camp.target_amount}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#444', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((camp.raised_amount / camp.target_amount) * 100, 100)}%`, height: '100%', backgroundColor: '#28a745' }}></div>
                            </div>
                        </div>

                        <button onClick={() => handleDonate(camp.id)} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Donate INR 50 (Simulate)
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>
                            {editMode ? 'Edit Campaign' : 'Start a Campaign'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Campaign Title *" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            <input type="text" name="categoryName" placeholder="Category (e.g., Scholarship, Relief) *" value={formData.categoryName} onChange={handleChange} required style={inputStyle} />
                            <input type="number" name="target_amount" placeholder="Target Amount (INR) *" value={formData.target_amount} onChange={handleChange} required style={inputStyle} />
                            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required style={inputStyle} />
                            <textarea name="description" placeholder="Description *" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '100px' }} />
                            
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editMode ? '#ffc107' : '#28a745', color: editMode ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {editMode ? 'Save Changes' : 'Launch'}
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

export default Campaigns;