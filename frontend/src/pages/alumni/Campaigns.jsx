import { useState, useEffect } from 'react';
import API from '../../services/api';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            const { data } = await API.get('/campaigns', { headers: { Authorization: `Bearer ${token}` } });
            setCampaigns(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await API.post('/campaigns', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData(); 
    };

    const handleDonate = async (campaignId) => {
        await API.post('/campaigns/donate', { campaignId, amount: 50 }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData(); 
    };

    // --- Master Delete Function ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Campaign and all its donations?')) return;
        try {
            await API.delete(`/admin/moderate/campaign/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { 
            alert('Failed to delete campaign. Admin access required.'); 
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#28a745', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Fundraising Campaigns</h2>
            
            {/* Create Campaign Form */}
            <div style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Start a Campaign</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} />
                    <input type="text" placeholder="Category" onChange={e => setForm({...form, categoryName: e.target.value})} required style={inputStyle} />
                    <input type="number" placeholder="Target $" onChange={e => setForm({...form, target_amount: e.target.value})} required style={inputStyle} />
                    <input type="date" onChange={e => setForm({...form, deadline: e.target.value})} required style={inputStyle} />
                    <input type="text" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} required style={{...inputStyle, flex: '1 1 100%'}} />
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Launch API</button>
                </form>
            </div>

            {/* Campaign List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {campaigns.map(camp => (
                    <div key={camp.id} style={{ backgroundColor: '#1e1e2f', border: '1px solid #333', padding: '20px', borderRadius: '8px', position: 'relative' }}>
                        
                        {/* --- Admin Controls --- */}
                        {(role === 'admin' || currentUserId === camp.userId) && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                <button onClick={() => alert('Edit coming soon!')} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Edit</button>
                                <button onClick={() => handleDelete(camp.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                            </div>
                        )}

                        <h3 style={{ margin: '0 0 5px 0', color: '#28a745' }}>{camp.title}</h3>
                        <span style={{ fontSize: '12px', backgroundColor: '#333', padding: '3px 8px', borderRadius: '12px', color: '#ccc' }}>{camp.category?.name}</span>
                        
                        <div style={{ margin: '15px 0', padding: '15px', backgroundColor: '#2a2a3c', borderRadius: '4px' }}>
                            <p style={{ margin: '0 0 10px 0' }}>Goal: <strong>${camp.target_amount}</strong> | Raised: <strong style={{ color: '#28a745' }}>${camp.raised_amount}</strong></p>
                            <button onClick={() => handleDonate(camp.id)} style={{ padding: '10px', background: '#007bff', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                Simulate $50 Donation
                            </button>
                        </div>
                        
                        <div style={{ fontSize: '13px', color: '#aaa' }}>
                            <strong>Recent Donations:</strong>
                            {camp.donations.length === 0 ? <p style={{margin: '5px 0'}}>No donations yet.</p> : (
                                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                    {camp.donations.map((d, i) => <li key={i}>{d.donor.name} donated ${d.amount}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', flex: '1 1 200px' };

export default Campaigns;