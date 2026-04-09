import { useState, useEffect } from 'react';
import API from '../../services/api';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });

    const fetchCampaigns = async () => {
        const { data } = await API.get('/campaigns', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setCampaigns(data);
    };

    useEffect(() => { fetchCampaigns(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await API.post('/campaigns', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchCampaigns(); // Refresh list
    };

    const handleDonate = async (campaignId) => {
        // Simulating a INR 100 donation
        await API.post('/campaigns/donate', { campaignId, amount: 100 }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchCampaigns(); // Refresh list to see the updated raised_amount!
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>Campaigns & Donations</h2>
            
            {/* Create Campaign Form */}
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input type="text" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} required />
                <input type="text" placeholder="Category" onChange={e => setForm({...form, categoryName: e.target.value})} required />
                <input type="number" placeholder="Target $" onChange={e => setForm({...form, target_amount: e.target.value})} required />
                <input type="date" onChange={e => setForm({...form, deadline: e.target.value})} required />
                <input type="text" placeholder="Desc" onChange={e => setForm({...form, description: e.target.value})} required />
                <button type="submit">Create API</button>
            </form>

            {/* Campaign List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {campaigns.map(camp => (
                    <div key={camp.id} style={{ border: '1px solid #555', padding: '15px' }}>
                        <h3>{camp.title} ({camp.category.name})</h3>
                        <p>Target: INR {camp.target_amount} | <strong>Raised: INR {camp.raised_amount}</strong></p>
                        <button onClick={() => handleDonate(camp.id)} style={{ padding: '10px', background: 'green', color: 'white', cursor: 'pointer' }}>
                            Donate INR 100
                        </button>
                        
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
                            <p>Donation Records from DB:</p>
                            {camp.donations.map((d, i) => <li key={i}>{d.donor.name} donated INR {d.amount}</li>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Campaigns;