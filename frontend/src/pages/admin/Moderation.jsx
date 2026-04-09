import { useState } from 'react';
import API from '../../services/api';

const Moderation = () => {
    const [entityType, setEntityType] = useState('job');
    const [entityId, setEntityId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        
        // Confirm before nuking data
        if (!window.confirm(`Are you sure you want to FORCE DELETE ${entityType} #${entityId}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await API.delete(`/admin/moderate/${entityType}/${entityId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage(`✅ Success: ${response.data.message}`);
            setEntityId(''); // Clear the input
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || 'Failed to delete entity'}`);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: '#1e1e2f', color: 'white', borderRadius: '8px', border: '1px solid #dc3545' }}>
            <h2 style={{ color: '#dc3545', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>
                ⚠️ Super Admin: Moderation Engine
            </h2>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
                Use this tool to test the Master Deletion API. Check your database (pgAdmin) to find an ID, select the entity type, and nuke it.
            </p>

            <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Entity Type:</label>
                    <select 
                        value={entityType} 
                        onChange={(e) => setEntityType(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="job">Job Post</option>
                        <option value="event">Event</option>
                        <option value="news">News Article</option>
                        <option value="notice">Notice</option>
                        <option value="campaign">Fundraising Campaign</option>
                        <option value="election">Committee Election</option>
                        <option value="candidate">Election Candidate</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Database ID (Number):</label>
                    <input 
                        type="number" 
                        required 
                        value={entityId} 
                        onChange={(e) => setEntityId(e.target.value)} 
                        placeholder="e.g., 12"
                        style={inputStyle}
                    />
                </div>

                <button type="submit" style={{ padding: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                    FORCE DELETE ENTITY
                </button>
            </form>

            {message && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2a2a3c', borderRadius: '4px', fontWeight: 'bold', wordBreak: 'break-word' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

const inputStyle = { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', boxSizing: 'border-box' };

export default Moderation;