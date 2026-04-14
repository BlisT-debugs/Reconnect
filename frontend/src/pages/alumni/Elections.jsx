import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Vote as VoteIcon, Calendar, Trash2, Edit3, X, 
  User, CheckCircle2, Trophy, Clock, Settings 
} from 'lucide-react';

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [role, setRole] = useState('user');
    
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
        <div className="p-8 max-w-6xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 font-serif">Committee Elections</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <VoteIcon size={16} className="text-emerald-600"/> 
                        Cast your vote and shape the future of the SRM Alumni Directorate
                    </p>
                </div>
                {role === 'admin' && (
                    <button 
                        onClick={handleSetup} 
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-100"
                    >
                        <Settings size={18} /> Auto-Gen Test Poll
                    </button>
                )}
            </div>

            {/* Elections List */}
            <div className="space-y-10">
                {elections.map(election => (
                    <div key={election.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
                        
                        {/* Status Ribbon */}
                        <div className="absolute top-0 right-0 bg-emerald-700 text-white px-8 py-2 rounded-bl-3xl text-xs font-black uppercase tracking-widest shadow-md">
                            Active Poll
                        </div>

                        {/* Poll Header */}
                        <div className="p-10 border-b border-gray-50 bg-emerald-50/30">
                            {role === 'admin' && (
                                <div className="flex gap-2 mb-4">
                                    <button onClick={() => handleEdit(election)} className="flex items-center gap-1.5 px-3 py-1 bg-white text-amber-600 rounded-lg text-xs font-bold border border-amber-100 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                                        <Edit3 size={14} /> Edit Poll
                                    </button>
                                    <button onClick={() => handleDeleteElection(election.id)} className="flex items-center gap-1.5 px-3 py-1 bg-white text-red-600 rounded-lg text-xs font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                        <Trash2 size={14} /> Close Poll
                                    </button>
                                </div>
                            )}

                            <h3 className="text-3xl font-bold text-gray-800 font-serif mb-2">{election.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                <span className="bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                                    <Clock size={14} className="text-emerald-600"/> Ends: {new Date(election.end_date).toLocaleDateString()}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-600"/> {election.committee.name}
                                </span>
                            </div>
                        </div>

                        {/* Candidates Table-style Grid */}
                        <div className="p-10 space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Candidates on Ballot</h4>
                            
                            {election.candidates.map(candidate => (
                                <div key={candidate.id} className="group bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-emerald-200 hover:bg-white transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6">
                                    
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <strong className="text-xl text-gray-800">{candidate.user.name}</strong>
                                                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                                                    {candidate.designation.name}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1 italic leading-relaxed">"{candidate.manifesto}"</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-emerald-700 flex items-center justify-center gap-2">
                                                <Trophy size={20} className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                {candidate.votes_count}
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Votes Received</span>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleVote(election.id, candidate.id, candidate.designationId)} 
                                                className="px-8 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100 uppercase text-xs tracking-widest"
                                            >
                                                Vote
                                            </button>
                                            {role === 'admin' && (
                                                <button onClick={() => handleDeleteCandidate(candidate.id)} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modern Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-emerald-800 text-white">
                            <h2 className="text-3xl font-bold font-serif">Edit Election</h2>
                            <p className="text-emerald-100/70 text-sm mt-1">Adjust poll timing and details</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <InputField label="Election Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Alumni President 2026" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Start Date" name="start_date" type="datetime-local" value={formData.start_date} onChange={handleChange} required />
                                <InputField label="End Date" name="end_date" type="datetime-local" value={formData.end_date} onChange={handleChange} required />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Internal Helper Components */
const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            required={required} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-gray-700 text-sm" 
        />
    </div>
);

export default Elections;