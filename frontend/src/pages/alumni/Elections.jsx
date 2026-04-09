import { useState, useEffect } from 'react';
import API from '../../services/api';

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/elections', { headers: { Authorization: `Bearer ${token}` } });
            setElections(data);
            setError('');
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSetup = async () => {
        await API.post('/elections/setup-test', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData();
    };

    const handleVote = async (electionId, candidateId, designationId) => {
        try {
            await API.post('/elections/vote', { electionId, candidateId, designationId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert("Vote Cast Successfully!");
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error casting vote');
        }
    };

    // --- Master Delete Functions ---
    const handleDeleteElection = async (id) => {
        if (!window.confirm('WARNING: Are you sure you want to permanently delete this Entire Election and all its votes?')) return;
        try {
            await API.delete(`/admin/moderate/election/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    const handleDeleteCandidate = async (id) => {
        if (!window.confirm('Are you sure you want to remove this Candidate from the ballot?')) return;
        try {
            await API.delete(`/admin/moderate/candidate/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#007bff', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Committee Elections</h2>
            
            <button onClick={handleSetup} style={{ padding: '12px 20px', background: '#ffc107', color: '#000', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold', border: 'none', borderRadius: '4px' }}>
                ⚡ Auto-Generate Test Election
            </button>

            {error && <div style={{ background: '#dc3545', padding: '15px', marginBottom: '20px', borderRadius: '4px', fontWeight: 'bold' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {elections.map(election => (
                    <div key={election.id} style={{ backgroundColor: '#1e1e2f', border: '1px solid #333', padding: '20px', borderRadius: '8px', position: 'relative' }}>
                        
                        {/* --- Admin Controls: ELECTION --- */}
                        {role === 'admin' && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                <button onClick={() => alert('Edit coming soon!')} style={{ background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Edit Election</button>
                                <button onClick={() => handleDeleteElection(election.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold' }}>Delete Election</button>
                            </div>
                        )}

                        <h3 style={{ margin: '0 0 5px 0', color: '#007bff', paddingRight: '180px' }}>{election.title}</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#aaa' }}>For Committee: {election.committee?.name}</p>
                        
                        <h4 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Candidates on the Ballot:</h4>
                        
                        {election.candidates.length === 0 ? <p style={{color: '#aaa'}}>No candidates found.</p> : election.candidates.map(candidate => (
                            <div key={candidate.id} style={{ background: '#2a2a3c', padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <strong style={{ fontSize: '18px' }}>{candidate.user?.name}</strong> 
                                    <span style={{ color: '#ffc107', marginLeft: '10px', fontSize: '14px' }}>({candidate.designation?.name})</span>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', fontStyle: 'italic' }}>"{candidate.manifesto}"</p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                    
                                    {/* --- Admin Controls: CANDIDATE --- */}
                                    {role === 'admin' && (
                                        <button onClick={() => handleDeleteCandidate(candidate.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold' }}>Remove Candidate</button>
                                    )}

                                    <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>Votes: {candidate.votes_count}</p>
                                    <button onClick={() => handleVote(election.id, candidate.id, candidate.designationId)} style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Vote for {candidate.user?.name?.split(' ')[0] || 'Candidate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Elections;