import { useState, useEffect } from 'react';
import API from '../../services/api';

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [role, setRole] = useState('user');
    
    // Edit States
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', start_date: '', end_date: '' });

    const fetchElections = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/elections', { headers: { Authorization: `Bearer ${token}` } });
            setElections(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchElections(); }, []);

    const handleSetup = async () => {
        await API.post('/elections/setup-test', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchElections();
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEdit = (election) => {
        setEditMode(true);
        setEditId(election.id);
        const formatStart = election.start_date ? new Date(election.start_date).toISOString().slice(0, 16) : '';
        const formatEnd = election.end_date ? new Date(election.end_date).toISOString().slice(0, 16) : '';
        
        setFormData({ title: election.title, start_date: formatStart, end_date: formatEnd });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/elections/${editId}`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert('Election Updated Successfully!');
            setShowModal(false);
            fetchElections();
        } catch (err) { alert('Error updating election'); }
    };

    const handleDeleteElection = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Election?')) return;
        try {
            await API.delete(`/admin/moderate/election/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchElections(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    const handleDeleteCandidate = async (id) => {
        if (!window.confirm('Remove this candidate from the election?')) return;
        try {
            await API.delete(`/admin/moderate/candidate/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchElections(); 
        } catch (err) { alert('Failed to delete candidate.'); }
    };

    const handleVote = async (electionId, candidateId, designationId) => {
        try {
            await API.post('/elections/vote', { electionId, candidateId, designationId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert("Vote Cast Successfully!");
            fetchElections();
        } catch (err) { alert(err.response?.data?.message || 'Error casting vote'); }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff', margin: 0 }}>Committee Elections</h1>
                {role === 'admin' && (
                    <button onClick={handleSetup} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Auto-Gen Test Election
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {elections.map(election => (
                    <div key={election.id} style={{ border: '1px solid #444', backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', position: 'relative' }}>
                        
                        {role === 'admin' && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleEdit(election)} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>Edit Info</button>
                                <button onClick={() => handleDeleteElection(election.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete Poll</button>
                            </div>
                        )}

                        <h3 style={{ margin: '0 0 5px 0', color: '#007bff', fontSize: '22px' }}>{election.title}</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#aaa' }}>
                            {election.committee.name} | Ends: {new Date(election.end_date).toLocaleDateString()}
                        </p>
                        
                        <h4 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Candidates on the Ballot:</h4>
                        
                        {election.candidates.map(candidate => (
                            <div key={candidate.id} style={{ background: '#2a2a3c', padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative' }}>
                                <div>
                                    <strong style={{ fontSize: '18px' }}>{candidate.user.name}</strong> 
                                    <span style={{ color: '#ffc107', marginLeft: '10px', fontSize: '12px', padding: '3px 8px', background: '#333', borderRadius: '12px' }}>{candidate.designation.name}</span>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', fontStyle: 'italic' }}>"{candidate.manifesto}"</p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>{candidate.votes_count} Votes</p>
                                    
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => handleVote(election.id, candidate.id, candidate.designationId)} style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Vote
                                        </button>
                                        {role === 'admin' && (
                                            <button onClick={() => handleDeleteCandidate(candidate.id)} style={{ padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Edit Election</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" name="title" placeholder="Election Title" value={formData.title} onChange={handleChange} required style={inputStyle} />
                            
                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px', display: 'block' }}>Start Date</label>
                                <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px', display: 'block' }}>End Date</label>
                                <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} required style={inputStyle} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
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

export default Elections;