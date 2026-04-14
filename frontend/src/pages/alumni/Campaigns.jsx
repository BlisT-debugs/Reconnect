import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Heart, Target, Calendar, Plus, Edit3, Trash2, 
  X, Send, TrendingUp, HandHelping, Landmark 
} from 'lucide-react';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            const { data } = await API.get('/campaigns', { headers: { Authorization: `Bearer ${token}` } });
            setCampaigns(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', description: '', categoryName: '', target_amount: '', deadline: '' });
        setShowModal(true);
    };

    const handleEdit = (camp) => {
        setEditMode(true);
        setEditId(camp.id);
        const formattedDate = camp.deadline ? new Date(camp.deadline).toISOString().slice(0, 10) : '';
        setFormData({
            title: camp.title,
            description: camp.description,
            categoryName: camp.category?.name || '',
            target_amount: camp.target_amount,
            deadline: formattedDate
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await API.put(`/campaigns/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await API.post('/campaigns', formData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving campaign'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Campaign?')) return;
        try {
            await API.delete(`/admin/moderate/campaign/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    const handleDonate = async (campaignId) => {
        try {
            await API.post('/campaigns/donate', { campaignId, amount: 50 }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert("Thank you for your generous contribution!");
            fetchData();
        } catch (err) { alert('Donation failed'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Impact Stories...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Support & Giving</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <HandHelping size={16} className="text-emerald-600"/> 
                            Join the SRM Alumni community in making a real difference
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} /> Start Campaign
                </button>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((camp) => {
                    const progress = Math.min((camp.raised_amount / camp.target_amount) * 100, 100);
                    return (
                        <div key={camp.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative">
                            
                            {/* Management Controls */}
                            {(role === 'admin' || currentUserId === camp.userId) && (
                                <div className="absolute top-6 right-6 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(camp)} className="p-2 bg-white/90 backdrop-blur-sm text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(camp.id)} className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        {camp.category?.name || 'Community'}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                        <Calendar size={14} />
                                        {new Date(camp.deadline).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 font-serif mb-3 leading-snug group-hover:text-emerald-700 transition-colors">
                                    {camp.title}
                                </h3>
                                
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {camp.description}
                                </p>

                                {/* Progress Section */}
                                <div className="mt-auto space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raised</span>
                                            <span className="text-xl font-black text-emerald-700">₹{camp.raised_amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target</span>
                                            <span className="text-sm font-bold text-gray-600">₹{camp.target_amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Modern Progress Bar */}
                                    <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                                        <span className="flex items-center gap-1"><TrendingUp size={12}/> {progress.toFixed(0)}% Achieved</span>
                                        <span className="text-gray-400">{camp.target_amount - camp.raised_amount > 0 ? `₹${(camp.target_amount - camp.raised_amount).toLocaleString()} more to go` : 'Goal Reached!'}</span>
                                    </div>

                                    <button 
                                        onClick={() => handleDonate(camp.id)} 
                                        className="w-full mt-4 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-100 active:scale-95"
                                    >
                                        <Landmark size={18} /> Support This Cause
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Smart Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-emerald-800 text-white relative">
                            <h2 className="text-3xl font-bold font-serif">
                                {editMode ? 'Refine Campaign' : 'Start a Cause'}
                            </h2>
                            <p className="text-emerald-100/70 text-sm mt-1">Empower the SRM community through collective giving</p>
                            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 bg-emerald-900/50 hover:bg-emerald-900 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <InputField label="Campaign Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Student Research Grant 2026" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Category" name="categoryName" value={formData.categoryName} onChange={handleChange} required placeholder="Scholarship, Relief..." />
                                <InputField label="Target Amount (INR)" name="target_amount" type="number" value={formData.target_amount} onChange={handleChange} required placeholder="50000" />
                            </div>

                            <InputField label="Campaign Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Purpose & Vision</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[120px] text-gray-700 text-sm leading-relaxed" placeholder="Explain why this cause matters..." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-[1.5rem] font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                                    <Send size={18} /> {editMode ? 'Update Details' : 'Launch Campaign'}
                                </button>
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
    <div className="flex flex-col gap-2 w-full">
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

export default Campaigns;