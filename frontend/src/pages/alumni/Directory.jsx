import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Search, MapPin, Briefcase, GraduationCap, ArrowLeft, Users } from 'lucide-react';

// 🔹 SMART MOCK DATA (Only shows if DB is empty or API fails)
const mockAlumni = [
    { id: 'm1', first_name: 'Rahul', last_name: 'Sharma', company: 'Google', designation: 'Senior SDE', department: { name: 'Computer Science' }, passingYear: { name: '2020' }, profile_pic: null },
    { id: 'm2', first_name: 'Priya', last_name: 'Menon', company: 'Zoho', designation: 'Product Manager', department: { name: 'Information Tech' }, passingYear: { name: '2021' }, profile_pic: null },
    { id: 'm3', first_name: 'Arjun', last_name: 'Reddy', company: 'TCS', designation: 'Data Analyst', department: { name: 'Electronics & Comm' }, passingYear: { name: '2022' }, profile_pic: null },
    { id: 'm4', first_name: 'Sneha', last_name: 'Iyer', company: 'Microsoft', designation: 'Cloud Architect', department: { name: 'Computer Science' }, passingYear: { name: '2019' }, profile_pic: null },
];

const Directory = () => {
    const navigate = useNavigate();
    const [alumniList, setAlumniList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDirectory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/alumni/directory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // 🔹 LOGIC: If real data exists, use it. Else, use Mock Data!
                if (data && data.length > 0) {
                    setAlumniList(data);
                } else {
                    setAlumniList(mockAlumni);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch directory', err);
                setAlumniList(mockAlumni); // Fallback on error
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
        <div className="flex h-[80vh] items-center justify-center text-emerald-800 font-bold animate-pulse">
            Loading Global Directory...
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans animate-in fade-in duration-500">
            
            {/* Header & Controls */}
            <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Alumni Directory</h1>
                        <p className="text-gray-500 text-sm mt-1">Connect with {alumniList.length === mockAlumni.length ? '50,000' : alumniList.length}+ SRMites across the globe</p>
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
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={22} />
                <input 
                    type="text" 
                    placeholder="Search by Name, Company, or Department (e.g. CSE, Google)..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 transition-all outline-none text-gray-700 text-lg"
                />
            </div>

            {/* Grid of Alumni Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumnus) => (
                    <div 
                        key={alumnus.id} 
                        className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 flex flex-col relative overflow-hidden"
                    >
                        {/* Subtle Background Decoration */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="flex gap-5 items-start relative z-10">
                            {/* Profile Picture */}
                            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-emerald-50 shadow-inner flex-shrink-0 group-hover:border-emerald-500 transition-colors bg-gray-50 flex items-center justify-center">
                                {alumnus.profile_pic ? (
                                    <img 
                                        src={`http://localhost:5000${alumnus.profile_pic}`} 
                                        alt={alumnus.first_name} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-gray-300 font-serif uppercase">
                                        {alumnus.first_name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-bold text-gray-800 font-serif truncate">
                                    {alumnus.first_name} {alumnus.last_name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mt-1">
                                    <Briefcase size={14} />
                                    <span className="truncate">{alumnus.designation || 'Alumnus'}</span>
                                </div>
                                <div className="text-gray-400 text-sm mt-1 flex items-center gap-1 font-medium">
                                    <MapPin size={12} />
                                    <span className="truncate">{alumnus.company || 'Private Sector'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Academic Footer Tag */}
                        <div className="mt-8 pt-5 border-t border-gray-50 flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <GraduationCap size={18} className="text-emerald-500" />
                                <span className="truncate max-w-[120px]">{alumnus.department?.name || 'SRM KTR'}</span>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-emerald-100">
                                CLASS OF '{alumnus.passingYear?.name?.slice(-2) || 'XX'}'
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAlumni.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 mt-10">
                    <Search size={48} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 font-serif">No Alumni Found</h3>
                    <p className="text-gray-400 text-sm italic">
                        Try searching with a different name, batch, or company.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Directory;