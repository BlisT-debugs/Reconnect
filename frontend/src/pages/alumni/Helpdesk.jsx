import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  LifeBuoy, Plus, MessageSquare, Clock, 
  CheckCircle2, XCircle, Send, X, ShieldCheck 
} from 'lucide-react';

const Helpdesk = () => {
    const [tickets, setTickets] = useState([]);
    const [role, setRole] = useState('user');
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    
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
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
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
        if (!window.confirm('Mark this ticket as resolved and closed?')) return;
        try {
            await API.put(`/tickets/${ticketId}/close`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchTickets();
        } catch (err) { alert('Failed to close ticket'); }
    };

    // Styling helper for status badges
    const getStatusStyle = (status) => {
        if (status === 'closed') return { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', icon: <CheckCircle2 size={14}/> };
        if (status === 'in_progress') return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: <Clock size={14}/> };
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <LifeBuoy size={14}/> }; // open
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Support Desk...
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <LifeBuoy size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">
                            {role === 'admin' ? 'Admin Helpdesk' : 'Support Center'}
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <MessageSquare size={16} className="text-emerald-600"/> 
                            {role === 'admin' ? 'Manage and resolve alumni queries' : 'How can we assist you today?'}
                        </p>
                    </div>
                </div>
                {!role.includes('admin') && (
                    <button 
                        onClick={() => setShowModal(true)} 
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus size={20} /> Open Ticket
                    </button>
                )}
            </div>

            {/* Tickets List */}
            <div className="flex flex-col gap-4">
                {tickets.map(ticket => {
                    const statusStyle = getStatusStyle(ticket.status);
                    const isExpanded = expandedTicket === ticket.id;

                    return (
                        <div key={ticket.id} className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-200 shadow-xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                            
                            {/* Ticket Header (Clickable) */}
                            <div 
                                onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                className={`p-6 cursor-pointer flex justify-between items-center transition-colors ${isExpanded ? 'bg-emerald-50/30' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                                        {statusStyle.icon}
                                        <span className="text-[10px] font-black uppercase mt-1">#{ticket.id}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 font-serif mb-1">{ticket.subject}</h3>
                                        <p className="text-xs text-gray-500">
                                            Opened by <strong className="text-gray-700">{ticket.user.name}</strong> • {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Thread */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                                    
                                    {/* Conversation History */}
                                    <div className="p-6 bg-gray-50/50 flex flex-col gap-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        {ticket.replies.map(reply => {
                                            const isAdmin = reply.user.role === 'admin';
                                            return (
                                                <div key={reply.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] md:max-w-[70%] p-5 rounded-3xl ${
                                                        isAdmin 
                                                        ? 'bg-emerald-700 text-white rounded-tr-sm shadow-md' 
                                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'
                                                    }`}>
                                                        <div className="flex justify-between items-center mb-3 border-b border-white/20 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <strong className="text-sm">{reply.user.name}</strong>
                                                                {isAdmin && <ShieldCheck size={14} className="text-emerald-300" />}
                                                            </div>
                                                            <span className={`text-[10px] font-medium uppercase tracking-wider ${isAdmin ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                                {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Reply Box / Closed Notice */}
                                    <div className="p-6 bg-white border-t border-gray-100">
                                        {ticket.status !== 'closed' ? (
                                            <form onSubmit={(e) => handleReply(e, ticket.id)} className="flex flex-col gap-4">
                                                <textarea 
                                                    value={replyText} 
                                                    onChange={e => setReplyText(e.target.value)} 
                                                    placeholder="Type your reply here..." 
                                                    required 
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all outline-none text-gray-700 text-sm min-h-[100px] resize-none"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <button type="submit" className="px-6 py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-md">
                                                        <Send size={16} /> Send Reply
                                                    </button>
                                                    
                                                    {/* Admin or Ticket Owner can close */}
                                                    {(role === 'admin' || role === 'user') && (
                                                        <button type="button" onClick={() => handleClose(ticket.id)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2">
                                                            <XCircle size={16} /> Mark as Closed
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl text-gray-500 font-bold text-sm">
                                                <CheckCircle2 size={18} className="text-emerald-500" />
                                                This support ticket has been resolved and closed.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}

                {tickets.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <LifeBuoy size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 font-serif">Inbox is Clear</h3>
                        <p className="text-gray-400 text-sm">No support tickets found at the moment.</p>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-emerald-800 text-white relative">
                            <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
                                <LifeBuoy size={24} /> New Ticket
                            </h2>
                            <p className="text-emerald-100/70 text-sm mt-1">Our support team will respond shortly.</p>
                            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 bg-emerald-900/50 hover:bg-emerald-900 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Need help with login" 
                                    value={newTicket.subject} 
                                    onChange={e => setNewTicket({...newTicket, subject: e.target.value})} 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-gray-700 text-sm"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea 
                                    placeholder="Please describe your issue in detail..." 
                                    value={newTicket.message} 
                                    onChange={e => setNewTicket({...newTicket, message: e.target.value})} 
                                    required 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[150px] text-gray-700 text-sm resize-none" 
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                                    <Send size={18} /> Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Helpdesk;