import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../../services/api';
import { Send, User, MessageSquare, ShieldCheck, MoreVertical, Search } from 'lucide-react';

const Chat = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const selectedUserIdRef = useRef(null);

    useEffect(() => {
        selectedUserIdRef.current = selectedUser?.id;
    }, [selectedUser]);

    useEffect(() => {
        const initChat = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setCurrentUserId(userRes.data.id);

            const contactRes = await API.get('/messages/contacts', { headers: { Authorization: `Bearer ${token}` } });
            setContacts(contactRes.data);

            const unreadRes = await API.get('/messages/unread', { headers: { Authorization: `Bearer ${token}` } });
            setUnreadCounts(unreadRes.data);

            socketRef.current = io('http://localhost:5000');
            socketRef.current.emit('identify', userRes.data.id);

            socketRef.current.on('receive_message', (message) => {
                if (message.senderId === selectedUserIdRef.current) {
                    setMessages((prev) => [...prev, message]);
                    API.put(`/messages/mark-read/${message.senderId}`, {}, { headers: { Authorization: `Bearer ${token}` }});
                } else {
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
                const { data } = await API.get(`/messages/${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
                setMessages(data);
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
        } catch (err) { console.error('Failed to send message'); }
    };

    return (
        <div className="flex h-[calc(100vh-60px)] m-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden font-sans">
            
            {/* 🔹 LEFT PANEL: CONTACTS */}
            <div className="w-80 md:w-96 border-r border-gray-50 flex flex-col bg-gray-50/50">
                <div className="p-6 bg-white border-b border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black tracking-tight font-serif">Messages</h2>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                    {/* Search Placeholder for UI */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search alumni..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 transition-all" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id} 
                            onClick={() => setSelectedUser(contact)}
                            className={`group p-4 mx-3 my-1 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 ${
                                selectedUser?.id === contact.id 
                                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200' 
                                : 'hover:bg-white hover:shadow-sm text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${selectedUser?.id === contact.id ? 'border-emerald-500 bg-emerald-800' : 'border-white bg-emerald-50'}`}>
                                        <User size={24} className={selectedUser?.id === contact.id ? 'text-emerald-100' : 'text-emerald-600'} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                                    <div className="flex items-center gap-1 opacity-70">
                                        {contact.role === 'admin' && <ShieldCheck size={12} />}
                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                            {contact.role === 'admin' ? 'Official Admin' : 'SRM Alumnus'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {unreadCounts[contact.id] > 0 && (
                                <div className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                                    {unreadCounts[contact.id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔹 RIGHT PANEL: CHAT BOX */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 leading-none">{selectedUser.name}</h3>
                                    <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                    </span>
                                </div>
                            </div>
                            <MoreVertical className="text-gray-400 cursor-pointer hover:text-emerald-700" size={20} />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 flex flex-col gap-4 custom-scrollbar">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUserId;
                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[75%] md:max-w-[60%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                                            isMe 
                                            ? 'bg-emerald-700 text-white rounded-br-none' 
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                        }`}>
                                            {msg.content}
                                            <div className={`text-[9px] mt-1 font-medium ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 md:p-6 bg-white border-t border-gray-50">
                            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
                                <input 
                                    type="text" 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)} 
                                    placeholder={`Write a message to ${selectedUser.name.split(' ')[0]}...`} 
                                    className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-gray-700 text-sm" 
                                />
                                <button type="submit" className="p-3 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-200">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-10">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-200 mb-6">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Your Inbox</h3>
                        <p className="text-gray-400 max-w-xs mt-2">Select a contact from the left to start a conversation with the SRM community.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;