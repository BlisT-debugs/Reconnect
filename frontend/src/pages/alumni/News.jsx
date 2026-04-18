import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Newspaper, Calendar, Plus, Edit3, Trash2, 
  X, Send, Hash, Info, User as UserIcon 
} from 'lucide-react';

// 🔹 SMART MOCK DATA (Matches Landing Page + Extras)
const mockNews = [
    { 
        id: 'n1', 
        title: "SRM Alumnus Startup 'EcoDrive' Secures $50M Series B Funding", 
        date: '2026-04-10T10:00:00', 
        category: { name: 'Achievement' }, 
        details: "EcoDrive, a sustainable mobility startup founded by 2018 SRM IT alumni Rohan Verma and Sneha Krishnan, has successfully closed a $50 million Series B funding round. \n\nThe round was led by GreenFuture Ventures with participation from existing investors. The funds will be utilized to expand their AI-driven fleet management software across Southeast Asia and scale their engineering team headquartered in Bangalore.\n\n\"SRM laid the foundation for our technical expertise and entrepreneurial spirit,\" said Rohan during the press conference.", 
        image: null 
    },
    { 
        id: 'n2', 
        title: "Successful Wrap: Global Alumni Healthcare Summit 2026", 
        date: '2026-03-28T14:30:00', 
        category: { name: 'Event' }, 
        details: "The Global Alumni Healthcare Summit concluded last weekend at the KTR campus, bringing together over 500 alumni from the medical, biotech, and pharma sectors. \n\nHighlights included a keynote panel on 'Longevity 2.0' and bio-optimization for senior care, alongside a showcase of cutting-edge multimodal biometrics by the 2025 batch. \n\nThe event also facilitated direct mentoring sessions between established doctors and current final-year MBBS students.", 
        image: null 
    },
    { 
        id: 'n3', 
        title: "Launch of 'SRM NexGen' Mentorship Phase 4", 
        date: '2026-03-12T09:15:00', 
        category: { name: 'Program' }, 
        details: "The Directorate of Alumni Affairs is proud to announce the launch of Phase 4 of the 'SRM NexGen' Mentorship program. \n\nThis semester, we are pairing 1,200 pre-final year students with industry-leading alumni across 40 different domains ranging from Full Stack Development to Core Mechanical Design.\n\nAlumni interested in giving back to their alma mater by dedicating 2 hours a month can register through the Alumni Portal's 'Programs' tab.", 
        image: null 
    }
];

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('user');
    
    // States
    const [showModal, setShowModal] = useState(false); // For Creating/Editing
    const [viewArticle, setViewArticle] = useState(null); // For Viewing Detailed News
    
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
            
            if (data && data.length > 0) {
                setNewsList(data);
            } else {
                setNewsList(mockNews);
            }
            setLoading(false);
        } catch (err) { 
            setNewsList(mockNews);
            setLoading(false); 
        }
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
        if (!window.confirm('Are you sure you want to permanently delete this Article?')) return;
        try {
            await API.delete(`/admin/moderate/news/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
            setViewArticle(null); // close if open
        } catch (err) { alert('Failed to delete. Admin access required.'); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">Fetching Latest Updates...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans animate-in fade-in duration-500">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                        <Newspaper size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">News & Updates</h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            Stay connected with the latest from our global SRM alumni community
                        </p>
                    </div>
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
                        <div 
                            className="relative h-60 w-full overflow-hidden bg-gray-100 cursor-pointer"
                            onClick={() => setViewArticle(item)}
                        >
                            {item.image ? (
                                <img src={`http://localhost:5000${item.image}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-gray-200 flex items-center justify-center text-emerald-900/20 transition-transform duration-700 group-hover:scale-105">
                                    <Newspaper size={64} />
                                </div>
                            )}
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm border border-white">
                                    {item.category?.name || 'Update'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Calendar size={14} className="text-emerald-500" />
                                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>

                            <h3 
                                onClick={() => setViewArticle(item)}
                                className="text-2xl font-bold text-gray-800 font-serif mb-4 leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                                {item.title}
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                {item.details.split('\n')[0]} {/* Show only first paragraph as preview */}
                            </p>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                <button onClick={() => setViewArticle(item)} className="text-emerald-700 font-black text-xs uppercase tracking-widest hover:tracking-[0.2em] transition-all">
                                    Read Full Story →
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* 🔹 Detailed Article Modal (Blog View) 🔹 */}
            {viewArticle && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-8">
                    <div 
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto relative animate-in fade-in zoom-in-95 duration-300"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                        
                        {/* Close Button Floating */}
                        <button onClick={() => setViewArticle(null)} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-20">
                            <X size={24} />
                        </button>

                        {/* Article Header Image */}
                        <div className="relative h-64 sm:h-80 w-full bg-gray-100">
                            {viewArticle.image ? (
                                <img src={`http://localhost:5000${viewArticle.image}`} alt={viewArticle.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-gray-900 flex items-center justify-center opacity-90">
                                    <Newspaper size={80} className="text-white/20" />
                                </div>
                            )}
                            {/* Gradient Overlay for Text */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                            
                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm mb-4 inline-block">
                                    {viewArticle.category?.name || 'General News'}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif leading-tight text-balance">
                                    {viewArticle.title}
                                </h1>
                            </div>
                        </div>

                        {/* Article Body */}
                        <div className="p-8 sm:p-12">
                            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-100">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Alumni Directorate</p>
                                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Calendar size={12} /> {new Date(viewArticle.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-emerald prose-lg max-w-none text-gray-600 font-sans leading-relaxed whitespace-pre-wrap">
                                {viewArticle.details}
                            </div>
                            
                            {/* Footer actions for admin inside reading view */}
                            {role === 'admin' && (
                                <div className="mt-12 pt-6 border-t border-gray-100 flex gap-4">
                                    <button onClick={() => { setViewArticle(null); handleEdit(viewArticle); }} className="px-6 py-2 bg-amber-50 text-amber-700 font-bold rounded-xl text-sm hover:bg-amber-100 transition-colors">
                                        Edit Article
                                    </button>
                                    <button onClick={() => handleDelete(viewArticle.id)} className="px-6 py-2 bg-red-50 text-red-700 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Form Modal (Hidden Scrollbar) 🔹 */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div 
                        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                        
                        <div className="sticky top-0 bg-emerald-800 p-8 text-white z-10">
                            <h2 className="text-3xl font-bold font-serif">
                                {editMode ? 'Edit Article' : 'Publish News'}
                            </h2>
                            <p className="text-emerald-100/70 text-sm mt-1 font-sans">Updates shared here will appear on the global Alumni feed</p>
                            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 bg-emerald-900/50 hover:bg-emerald-900 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <InputField label="Article Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. SRM KTR Ranks Top in NIRF 2026" />
                            
                            <InputField label="Category" name="categoryName" value={formData.categoryName} onChange={handleChange} required placeholder="Campus, Achievement, Sports, etc." icon={<Hash size={14}/>} />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Full Details</label>
                                <textarea name="details" value={formData.details} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[200px] text-gray-700 text-sm leading-relaxed font-sans" placeholder="Write the full story here..." />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Thumbnail Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer font-sans" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 font-sans">
                                    <Send size={18} /> {editMode ? 'Save Changes' : 'Publish Article'}
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
const InputField = ({ label, name, value, onChange, placeholder, required = false, icon }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">{label} {required && "*"}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">{icon}</div>}
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                required={required} 
                className={`w-full ${icon ? 'pl-10' : 'px-4'} py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-gray-700 text-sm font-sans`} 
            />
        </div>
    </div>
);

export default News;