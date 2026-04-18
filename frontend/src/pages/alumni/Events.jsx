import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Calendar, MapPin, Plus, Edit3, Trash2, X, 
  Clock, Camera, Image as ImageIcon, Send 
} from 'lucide-react';

// 🔹 SMART MOCK DATA (Past Events based on SRM KTR)
const mockEvents = [
    { 
        id: 'e1', 
        title: 'Global Alumni Healthcare Summit 2026', 
        date: '2026-02-15T09:00:00', 
        location: 'SRM Medical College Hospital (MCH&RC)', 
        description: 'A premier gathering of SRM medical, biotechnology, and healthcare alumni. The summit featured keynote speeches on Longevity 2.0, bio-optimization, and the future of multimodal biometrics in clinical setups.', 
        banner_image: null 
    },
    { 
        id: 'e2', 
        title: 'SRM Milan 2026 - Alumni VIP Lounge', 
        date: '2026-03-05T18:00:00', 
        location: 'T.P. Ganesan Auditorium', 
        description: 'The annual national-level cultural extravaganza. Alumni enjoyed exclusive VIP access, networking mixers, and prime seating for the live pro-shows and concerts.', 
        banner_image: null 
    },
    { 
        id: 'e3', 
        title: 'Tech-Startup Mixer: KTR Founders', 
        date: '2026-01-20T14:30:00', 
        location: 'SRM Innovation and Incubation Centre (SIIC)', 
        description: 'An exclusive networking event connecting alumni startup founders with angel investors and current student entrepreneurs building the next big thing.', 
        banner_image: null 
    }
];

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState('user');
    
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', banner_image: '' });
    const [imageFile, setImageFile] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const { data } = await API.get('/events', { headers: { Authorization: `Bearer ${token}` } });
            
            // 🔹 LOGIC: Show Real DB Data or Fallback to Mock Data
            if (data && data.length > 0) {
                setEvents(data);
            } else {
                setEvents(mockEvents);
            }
            setLoading(false);
        } catch (err) { 
            setEvents(mockEvents);
            setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFile(e.target.files[0]);

    const handleAddNew = () => {
        setEditMode(false);
        setEditId(null);
        setFormData({ title: '', description: '', date: '', location: '', banner_image: '' });
        setImageFile(null);
        setShowModal(true);
    };

    const handleEdit = (evt) => {
        setEditMode(true);
        setEditId(evt.id);
        const formattedDate = evt.date ? new Date(evt.date).toISOString().slice(0, 16) : '';
        setFormData({
            title: evt.title,
            description: evt.description,
            date: formattedDate,
            location: evt.location,
            banner_image: evt.banner_image || ''
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = formData.banner_image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); 
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            const payload = { ...formData, banner_image: uploadedImagePath };

            if (editMode) {
                await API.put(`/events/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await API.post('/events', payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            
            setShowModal(false);
            fetchData();
        } catch (err) { alert('Error saving event'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this Event?')) return;
        try {
            await API.delete(`/admin/moderate/event/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData(); 
        } catch (err) { alert('Failed to delete event.'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Syncing Campus Calendar...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Campus Events</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 italic font-medium">
                            <Clock size={16} className="text-emerald-600"/> 
                            Don't miss out on the latest meetups and reunions at KTR
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus size={20} /> Host Event
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((evt) => {
                    const eventDate = new Date(evt.date);
                    const isPastEvent = eventDate < new Date(); // Check if event has passed

                    return (
                        <div key={evt.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative">
                            
                            {/* Admin Controls */}
                            {role === 'admin' && (
                                <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(evt)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(evt.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Banner Image with Date Overlay */}
                            <div className={`relative h-56 w-full overflow-hidden ${isPastEvent ? 'bg-gray-100 grayscale-[30%]' : 'bg-emerald-50'}`}>
                                {evt.banner_image ? (
                                    <img 
                                        src={`http://localhost:5000${evt.banner_image}`} 
                                        alt={evt.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-emerald-200">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center min-w-[60px]">
                                    <span className={`text-xs font-black uppercase tracking-tighter ${isPastEvent ? 'text-gray-500' : 'text-emerald-800'}`}>
                                        {eventDate.toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-bold text-gray-800 leading-none">
                                        {eventDate.getDate()}
                                    </span>
                                </div>
                                {isPastEvent && (
                                    <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                                        Past Event
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className={`text-2xl font-bold font-serif mb-4 leading-tight transition-colors ${isPastEvent ? 'text-gray-700' : 'text-gray-800 group-hover:text-emerald-700'}`}>
                                    {evt.title}
                                </h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Clock size={16} className={isPastEvent ? 'text-gray-400' : 'text-emerald-600'} />
                                        <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <MapPin size={16} className={isPastEvent ? 'text-gray-400' : 'text-emerald-600'} />
                                        <span className="font-medium">{evt.location}</span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                    {evt.description}
                                </p>

                                <button className={`mt-8 w-full py-3 border-2 font-bold rounded-2xl transition-all uppercase tracking-widest text-xs
                                    ${isPastEvent 
                                        ? 'border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed' 
                                        : 'border-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white hover:border-emerald-700'}`}>
                                    {isPastEvent ? 'Event Concluded' : 'View Details'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Modern Host Event Modal with Hidden Scrollbar */}
            {showModal && (
                <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div 
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                        
                        <div className="sticky top-0 bg-emerald-800 p-8 text-white z-10 border-b border-emerald-900 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold font-serif">
                                    {editMode ? 'Edit Campus Event' : 'Host an Event'}
                                </h2>
                                <p className="text-emerald-100 text-sm mt-1 font-sans">Fill in the details for the SRM community</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-emerald-900/50 hover:bg-emerald-900 rounded-full transition-colors text-emerald-100">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <InputField label="Event Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Alumni Homecoming 2026" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Date & Time" name="date" type="datetime-local" value={formData.date} onChange={handleChange} required />
                                <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. T.P. Ganesan Auditorium" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Event Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 outline-none min-h-[100px] text-gray-700 text-sm font-sans" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">Banner Image</label>
                                <div className="relative group">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer font-sans" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 font-sans">
                                    <Send size={18} /> {editMode ? 'Update Event' : 'Launch Event'}
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
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 font-sans">{label} {required && "*"}</label>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            required={required} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-gray-700 text-sm font-sans" 
        />
    </div>
);

export default Events;