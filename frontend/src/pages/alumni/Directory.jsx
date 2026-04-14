import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Search, MapPin, Briefcase, GraduationCap, ArrowLeft, Users } from 'lucide-react';

const Directory = () => {
    const navigate = useNavigate();
    const [alumniList, setAlumniList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // 🔹 TERI FUNCTIONALITY (No Changes)
    useEffect(() => {
        const fetchDirectory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/alumni/directory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlumniList(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch directory', err);
                setLoading(false);
            }
        };
        fetchDirectory();
    }, []);

    const filteredAlumni = alumniList.filter(alumnus => 
        alumnus.first_name.toLowerCase().includes(search.toLowerCase()) || 
        alumnus.last_name.toLowerCase().includes(search.toLowerCase()) ||
        (alumnus.company && alumnus.company.toLowerCase().includes(search.toLowerCase())) ||
        (alumnus.department && alumnus.department.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Global Directory...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header & Controls */}
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 font-serif">Alumni Directory</h1>
                        <p className="text-gray-500 text-sm">Connect with {alumniList.length}+ SRMites across the globe</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-bold transition-all shadow-sm"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            {/* Modern Search Bar */}
            <div className="relative mb-10 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by Name, Company, or Department (e.g. CSE, Google, Chennai)..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-200 transition-all outline-none text-gray-700 text-lg"
                />
            </div>

            {/* Grid of Alumni Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumnus) => (
                    <div 
                        key={alumnus.id} 
                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col relative overflow-hidden"
                    >
                        {/* Subtle Background Decoration */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="flex gap-5 items-start relative z-10">
                            {/* Profile Picture */}
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-50 shadow-inner flex-shrink-0 group-hover:border-emerald-500 transition-colors">
                                {alumnus.profile_pic ? (
                                    <img 
                                        src={`http://localhost:5000${alumnus.profile_pic}`} 
                                        alt={alumnus.first_name} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                        <User size={24} />
                                        <span className="text-[10px] font-bold uppercase mt-1">No Pic</span>
                                    </div>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-800 truncate">
                                    {alumnus.first_name} {alumnus.last_name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm mt-1">
                                    <Briefcase size={14} />
                                    <span className="truncate">{alumnus.designation || 'Alumnus'}</span>
                                </div>
                                <div className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span className="truncate">{alumnus.company || 'Private Sector'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Academic Footer Tag */}
                        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-tight">
                                <GraduationCap size={16} className="text-emerald-500" />
                                <span>{alumnus.department ? alumnus.department.name : 'SRM KTR'}</span>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[11px] font-black">
                                CLASS OF '{alumnus.passingYear ? alumnus.passingYear.name.slice(-2) : '??'}'
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAlumni.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mt-10">
                    <Search size={48} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 ">No Alumni Found</h3>
                    <p className="text-gray-400 text-sm" style={{ fontStyle: 'italic' }}>
                        Try searching with a different name, batch, or company.
                    </p>
                </div>
            )}
        </div>
    );
};

// Simple Icon fallback helper
const User = ({ size }) => <Users size={size} />;

export default Directory;