import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../../services/api';

const Chat = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({}); // Tracks notifications
    
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const selectedUserIdRef = useRef(null); // Keeps track of active chat for the socket

    useEffect(() => {
        // Update the ref whenever selectedUser changes
        selectedUserIdRef.current = selectedUser?.id;
    }, [selectedUser]);

    useEffect(() => {
        const initChat = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setCurrentUserId(userRes.data.id);

            // Fetch Contacts & Unread Notifications
            const contactRes = await API.get('/messages/contacts', { headers: { Authorization: `Bearer ${token}` } });
            setContacts(contactRes.data);

            const unreadRes = await API.get('/messages/unread', { headers: { Authorization: `Bearer ${token}` } });
            setUnreadCounts(unreadRes.data);

            // Connect WebSocket
            socketRef.current = io('http://localhost:5000');
            socketRef.current.emit('identify', userRes.data.id);

            // Listen for Live Messages
            socketRef.current.on('receive_message', (message) => {
                // If the message is from the person we are currently looking at, show it.
                if (message.senderId === selectedUserIdRef.current) {
                    setMessages((prev) => [...prev, message]);
                    // Auto-mark as read since we are looking at it
                    API.put(`/messages/mark-read/${message.senderId}`, {}, { headers: { Authorization: `Bearer ${token}` }});
                } else {
                    // Otherwise, increment their red notification badge!
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [message.senderId]: (prev[message.senderId] || 0) + 1
                    }));
                }
            });
        };

        initChat();

        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const loadChat = async () => {
                const token = localStorage.getItem('token');
                // Fetch history
                const { data } = await API.get(`/messages/${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
                setMessages(data);
                
                // Clear their notification badge and tell DB they are read
                setUnreadCounts(prev => ({ ...prev, [selectedUser.id]: 0 }));
                await API.put(`/messages/mark-read/${selectedUser.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            };
            loadChat();
        }
    }, [selectedUser]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const { data } = await API.post('/messages', { receiverId: selectedUser.id, content: newMessage }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
            socketRef.current.emit('send_message', data);
        } catch (err) { alert('Failed to send message'); }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 40px)', margin: '20px', backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', color: 'white', fontFamily: 'sans-serif' }}>
            
            {/* LEFT PANEL */}
            <div style={{ width: '300px', borderRight: '1px solid #333', backgroundColor: '#1a1a24', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#121212' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#007bff' }}>Messages</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {contacts.map(contact => (
                        <div 
                            key={contact.id} 
                            onClick={() => setSelectedUser(contact)}
                            style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #2a2a3c', backgroundColor: selectedUser?.id === contact.id ? '#2a2a3c' : 'transparent', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{contact.name}</h4>
                                <span style={{ fontSize: '12px', color: '#888' }}>{contact.role === 'admin' ? 'Admin' : 'Alumnus'}</span>
                            </div>
                            
                            {/* THE RED NOTIFICATION BADGE */}
                            {unreadCounts[contact.id] > 0 && (
                                <div style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '12px', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {unreadCounts[contact.id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e2f' }}>
                {selectedUser ? (
                    <>
                        <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#121212' }}>
                            <h3 style={{ margin: 0 }}>Chatting with: <span style={{ color: '#007bff' }}>{selectedUser.name}</span></h3>
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div key={index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '60%', backgroundColor: isMe ? '#007bff' : '#2a2a3c', padding: '10px 15px', borderRadius: '15px', borderBottomRightRadius: isMe ? '2px' : '15px', borderBottomLeftRadius: !isMe ? '2px' : '15px' }}>
                                        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>{msg.content}</p>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #333', backgroundColor: '#121212', display: 'flex', gap: '10px' }}>
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Message ${selectedUser.name}...`} style={{ flex: 1, padding: '15px', borderRadius: '25px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', outline: 'none' }} />
                            <button type="submit" style={{ padding: '0 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
                        <h3>Select a contact to start chatting</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;