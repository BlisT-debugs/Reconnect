import { useState, useEffect } from 'react';
import API from '../../services/api';

const Helpdesk = () => {
    const [tickets, setTickets] = useState([]);
    const [role, setRole] = useState('user');
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    
    // Create new ticket state
    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/tickets', { headers: { Authorization: `Bearer ${token}` } });
            setTickets(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchTickets(); }, []);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tickets', newTicket, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setShowModal(false);
            setNewTicket({ subject: '', message: '' });
            fetchTickets();
        } catch (err) { alert('Failed to create ticket'); }
    };

    const handleReply = async (e, ticketId) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await API.post(`/tickets/${ticketId}/reply`, { message: replyText }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setReplyText('');
            fetchTickets();
        } catch (err) { alert('Failed to reply'); }
    };

    const handleClose = async (ticketId) => {
        if (!window.confirm('Mark this ticket as closed?')) return;
        try {
            await API.put(`/tickets/${ticketId}/close`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchTickets();
        } catch (err) { alert('Failed to close ticket'); }
    };

    const getStatusColor = (status) => {
        if (status === 'closed') return '#dc3545';
        if (status === 'in_progress') return '#ffc107';
        return '#28a745';
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#007bff' }}>{role === 'admin' ? 'Admin Helpdesk Inbox' : 'My Support Tickets'}</h1>
                <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Open New Ticket</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tickets.map(ticket => (
                    <div key={ticket.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                        
                        {/* Ticket Header */}
                        <div 
                            onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: expandedTicket === ticket.id ? '#2a2a3c' : 'transparent' }}
                        >
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>#{ticket.id}: {ticket.subject}</h3>
                                <span style={{ fontSize: '13px', color: '#aaa' }}>Opened by {ticket.user.name} on {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ backgroundColor: getStatusColor(ticket.status), color: ticket.status === 'in_progress' ? '#000' : '#fff', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                                <span style={{ fontSize: '20px' }}>{expandedTicket === ticket.id ? '▼' : '▶'}</span>
                            </div>
                        </div>

                        {/* Expanded Thread */}
                        {expandedTicket === ticket.id && (
                            <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                    {ticket.replies.map(reply => {
                                        const isAdmin = reply.user.role === 'admin';
                                        return (
                                            <div key={reply.id} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '75%', backgroundColor: isAdmin ? '#007bff' : '#333', padding: '15px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: `1px solid ${isAdmin ? '#4da3ff' : '#555'}`, paddingBottom: '5px' }}>
                                                    <strong style={{ fontSize: '12px' }}>{reply.user.name} {isAdmin && '🛡️'}</strong>
                                                    <span style={{ fontSize: '11px', color: isAdmin ? '#cce5ff' : '#aaa' }}>{new Date(reply.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{reply.message}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {ticket.status !== 'closed' ? (
                                    <form onSubmit={(e) => handleReply(e, ticket.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." required style={{ width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#121212', color: 'white', minHeight: '80px', boxSizing: 'border-box' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Send Reply</button>
                                            <button type="button" onClick={() => handleClose(ticket.id)} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Close Ticket</button>
                                        </div>
                                    </form>
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#dc3545', fontWeight: 'bold', margin: 0 }}>🔒 This ticket has been closed.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {tickets.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No support tickets found.</p>}
            </div>

            {/* Create Ticket Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e1e2f', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Open Support Ticket</h2>
                        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <input type="text" placeholder="Subject" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} required style={inputStyle} />
                            <textarea placeholder="Describe your issue..." value={newTicket.message} onChange={e => setNewTicket({...newTicket, message: e.target.value})} required style={{ ...inputStyle, minHeight: '150px' }} />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Ticket</button>
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

export default Helpdesk;