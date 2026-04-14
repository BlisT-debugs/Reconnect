import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Briefcase, MapPin, DollarSign, Clock, Plus, 
  Edit3, Trash2, X, Send, GraduationCap 
} from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    const [currentUserId, setCurrentUserId] = useState(null);
    
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', company: '', location: '', description: '',
        salary_range: '', experience_required: '', apply_link: '', deadline: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);
            setCurrentUserId(userRes.data.id);

            const { data } = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
            setJobs(data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', company: '', location: '', description: '', salary_range: '', experience_required: '', apply_link: '', deadline: '' });
        setShowModal(true);
    };

    const handleEdit = (job) => {
        setEditMode(true);
        setEditId(job.id);
        setFormData({
            title: job.title, company: job.company, 
            location: job.location || '', description: job.description, 
            salary_range: job.salary_range || '', experience_required: job.experience_required || '', 
            apply_link: job.apply_link || '', 
            deadline: job.deadline ? job.deadline.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await API.put(`/jobs/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await API.post('/jobs', formData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving job'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this job?')) return;
        try {
            await API.delete(`/admin/moderate/job/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete job.'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Opportunities...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 font-serif">Career Opportunities</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Briefcase size={16} className="text-emerald-600"/> 
                        Explore jobs shared by the global SRM Alumni network
                    </p>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} /> Post a Job
                </button>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => (
                    <div key={job.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative flex flex-col">
                        
                        {/* Admin/Owner Controls */}
                        {(role === 'admin' || currentUserId === job.userId) && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(job)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(job.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 font-serif mb-1 group-hover:text-emerald-700 transition-colors">{job.title}</h3>
                            <p className="text-emerald-600 font-bold text-sm tracking-wide uppercase">{job.company}</p>
                        </div>

                        <div className="space-y-3 mb-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{job.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span>Exp: {job.experience_required || 'Fresher / Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-gray-400" />
                                <span className="font-semibold text-gray-700">{job.salary_range || 'Competitive'}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                            {job.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                    {job.postedBy?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Posted by {job.postedBy?.name || 'Alumni'}
                                </span>
                            </div>
                            <a href={job.apply_link || "#"} target="_blank" rel="noreferrer" className="text-emerald-700 font-black text-xs hover:underline uppercase tracking-widest">
                                Apply Now →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

  {/* Smart Modal (Scrollbar Hidden) */}
{showModal && (
    <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ 
                scrollbarWidth: 'none',      /* Firefox */
                msOverflowStyle: 'none',     /* IE and Edge */
            }}
        >
            {/* Chrome, Safari and Opera ke liye ye niche wala style block zaroori hai */}
            <style>
                {`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            <div className="sticky top-0 bg-emerald-800 p-6 border-b border-gray-100 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-white font-serif">
                    {editMode ? 'Update Opportunity' : 'Post New Opening'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-gray-400" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Full Stack Developer" /></div>
                <InputField label="Company Name" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Google, Zoho, Startup" />
                <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Chennai, Remote" />
                <InputField label="Salary Range" name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="e.g. 12-15 LPA" />
                <InputField label="Experience Required" name="experience_required" value={formData.experience_required} onChange={handleChange} placeholder="e.g. 2+ Years, Fresher" />
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block font-sans">Job Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[120px] text-gray-700 font-sans" />
                </div>
                <div className="md:col-span-2"><InputField label="Application Link / Email" name="apply_link" value={formData.apply_link} onChange={handleChange} placeholder="URL or HR Email" /></div>
                
                <div className="md:col-span-2 flex gap-4 pt-4">
                    <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 font-sans">
                        <Send size={18} /> {editMode ? 'Update Post' : 'Share with Network'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all font-sans">Cancel</button>
                </div>
            </form>
        </div>
    </div>
)}
        </div>
    );
};

/* Internal Helpers */
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-gray-700" 
        />
    </div>
);

export default Jobs;