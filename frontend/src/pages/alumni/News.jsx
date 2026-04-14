import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Newspaper, Calendar, Plus, Edit3, Trash2, 
  X, Camera, Send, Hash, Info 
} from 'lucide-react';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({ title: '', details: '', categoryName: '', image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/content/news', { headers: { Authorization: `Bearer ${token}` } });
            setNewsList(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', details: '', categoryName: '', image: '' });
        setImageFile(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setEditId(item.id);
        setFormData({
            title: item.title,
            details: item.details,
            categoryName: item.category?.name || '',
            image: item.image || ''
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = formData.image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); 
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            const payload = { ...formData, image: uploadedImagePath };

            if (editMode) {
                await API.put(`/content/news/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await API.post('/content/news', payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving news'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this News Article?')) return;
        try {
            await API.delete(`/admin/moderate/news/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Fetching Latest Updates...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 font-serif">Campus News</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Newspaper size={16} className="text-emerald-600"/> 
                        The latest headlines from SRM KTR and our Alumni chapters
                    </p>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} /> Publish News
                </button>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {newsList.map((item) => (
                    <article key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative">
                        
                        {/* Admin Controls */}
                        {role === 'admin' && (
                            <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-amber-50/90 backdrop-blur-sm text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-colors shadow-sm">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50/90 backdrop-blur-sm text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        {/* Thumbnail Image */}
                        <div className="relative h-60 w-full overflow-hidden bg-emerald-50">
                            {item.image ? (
                                <img 
                                    src={`http://localhost:5000${item.image}`} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-emerald-200">
                                    <Newspaper size={48} />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    {item.category?.name || 'General'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Calendar size={12} className="text-emerald-500" />
                                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 font-serif mb-4 leading-snug group-hover:text-emerald-700 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 mb-6 italic">
                                "{item.details}"
                            </p>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                <button className="text-emerald-700 font-black text-xs uppercase tracking-widest hover:tracking-[0.2em] transition-all">
                                    Read Full Story
                                </button>
                                <Info size={16} className="text-gray-100 group-hover:text-emerald-100 transition-colors" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {newsList.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <Newspaper size={48} className="mx-auto text-gray-100 mb-4" />
                    <p className="text-gray-400 font-serif italic text-xl">No news published yet. Be the first to share an update!</p>
                </div>
            )}

            {/* Publication Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 bg-emerald-800 text-white">
                            <h2 className="text-3xl font-bold font-serif">
                                {editMode ? 'Edit Article' : 'Publish News'}
                            </h2>
                            <p className="text-emerald-100/70 text-sm mt-1">Updates shared here will appear on the global Alumni feed</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <InputField label="Article Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. SRM KTR Ranks Top in NIRF 2026" />
                            
                            <InputField label="Category" name="categoryName" value={formData.categoryName} onChange={handleChange} required placeholder="Campus, Achievement, Sports, etc." icon={<Hash size={14}/>} />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Details</label>
                                <textarea name="details" value={formData.details} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[140px] text-gray-700 text-sm leading-relaxed" placeholder="Write the full story here..." />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Thumbnail Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                                    <Send size={18} /> {editMode ? 'Save Changes' : 'Publish Article'}
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
const InputField = ({ label, name, value, onChange, placeholder, required = false, icon }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label} {required && "*"}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">{icon}</div>}
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                required={required} 
                className={`w-full ${icon ? 'pl-10' : 'px-4'} py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-gray-700 text-sm`} 
            />
        </div>
    </div>
);

export default News;