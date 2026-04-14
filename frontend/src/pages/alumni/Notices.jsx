import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Bell, Pin, Plus, Edit3, Trash2, X, 
  Calendar, Info, Megaphone, Send 
} from 'lucide-react';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    
    // Edit States
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({ title: '', details: '', categoryName: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/content/notices', { headers: { Authorization: `Bearer ${token}` } });
            setNotices(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', details: '', categoryName: '' });
        setShowModal(true);
    };

    const handleEdit = (notice) => {
        setEditMode(true);
        setEditId(notice.id);
        setFormData({
            title: notice.title,
            details: notice.details,
            categoryName: notice.category?.name || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await API.put(`/content/notices/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Notice Updated Successfully!');
            } else {
                await API.post('/content/notices', formData, { headers: { Authorization: `Bearer ${token}` } });
                alert('Notice Posted Successfully!');
            }
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving notice'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Notice?')) return;
        try {
            await API.delete(`/admin/moderate/notice/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Official Bulletin...
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                        <Bell size={28} className="animate-swing" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Official Notices</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <Info size={14} className="text-emerald-600"/> 
                            Important updates and administrative announcements
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} /> Post Notice
                </button>
            </div>

            {/* Notices List */}
            <div className="flex flex-col gap-6">
                {notices.map((notice) => (
                    <div 
                        key={notice.id} 
                        className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:translate-x-1 transition-all duration-300 relative flex flex-col md:flex-row gap-6 overflow-hidden"
                    >
                        {/* Vertical Indicator Bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 group-hover:w-2 transition-all"></div>

                        {/* Icon/Decoration */}
                        <div className="hidden md:flex w-14 h-14 bg-gray-50 rounded-2xl items-center justify-center text-gray-300 group-hover:text-red-400 group-hover:bg-red-50 transition-colors">
                            <Pin size={24} />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-2xl font-bold text-gray-800 font-serif leading-tight">
                                        {notice.title}
                                    </h3>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {notice.category?.name || 'Administrative'}
                                    </span>
                                </div>

                                {/* Admin Actions */}
                                {role === 'admin' && (
                                    <div className="flex gap-2 ml-4">
                                        <button onClick={() => handleEdit(notice)} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(notice.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-4 uppercase tracking-tighter">
                                <Calendar size={14} className="text-emerald-600" />
                                Posted on {new Date(notice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>

                            <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                {notice.details}
                            </p>
                        </div>
                    </div>
                ))}

                {notices.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Megaphone size={48} className="mx-auto text-gray-100 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 font-serif">Quiet on the Bulletin Board</h3>
                        <p className="text-gray-400 text-sm italic">No official notices have been posted yet.</p>
                    </div>
                )}
            </div>

            {/* Publication Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-red-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-red-600 text-white">
                            <h2 className="text-3xl font-bold font-serif flex items-center gap-3">
                                <Bell size={24} /> {editMode ? 'Edit Notice' : 'New Announcement'}
                            </h2>
                            <p className="text-red-100/70 text-sm mt-1">This announcement will be pinned to all alumni dashboards</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <InputField label="Notice Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. End Semester Exam Guidelines" />
                            
                            <InputField label="Department/Category" name="categoryName" value={formData.categoryName} onChange={handleChange} required placeholder="Admin, Placement, Examination, etc." />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Official Details</label>
                                <textarea name="details" value={formData.details} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-200 outline-none min-h-[160px] text-gray-700 text-sm leading-relaxed" placeholder="Write the complete official notice here..." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100">
                                    <Send size={18} /> {editMode ? 'Update Bulletin' : 'Post Announcement'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all">Dismiss</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Internal Helper Components */
const InputField = ({ label, name, value, onChange, placeholder, required = false }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            required={required} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-200 focus:bg-white outline-none transition-all text-gray-700 text-sm" 
        />
    </div>
);

export default Notices;