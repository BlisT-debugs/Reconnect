import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  LayoutDashboard, User, Users, MessageSquare, Briefcase, Calendar, 
  Newspaper, Bell, Megaphone, Vote, ShieldAlert, AlertTriangle, LogOut, GraduationCap, Search 
} from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');
                const { data } = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                setUserData(data);
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!userData) return null; // Fallback loading can be added here

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            
            {/* 🔹 FLOATING SIDEBAR (Keep as it was) */}
            <aside className="fixed left-4 top-4 bottom-4 w-20 bg-emerald-900 rounded-[2rem] shadow-2xl z-50 flex flex-col items-center py-6 overflow-visible">
                <div className="flex items-center justify-center w-full mb-8 pb-4 border-b border-emerald-800/50">
                    <GraduationCap className="text-emerald-400" size={32} />
                </div>

                <nav className="flex-1 w-full px-4 space-y-3 custom-scrollbar overflow-y-auto">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" currentPath={location.pathname} />
                    <SidebarLink to="/edit-profile" icon={<User size={20}/>} label="Profile" currentPath={location.pathname} />
                    <SidebarLink to="/directory" icon={<Users size={20}/>} label="Directory" currentPath={location.pathname} />
                    <SidebarLink to="/chat" icon={<MessageSquare size={20}/>} label="Messenger" currentPath={location.pathname} />
                    <SidebarLink to="/jobs" icon={<Briefcase size={20}/>} label="Jobs" currentPath={location.pathname} />
                    <SidebarLink to="/events" icon={<Calendar size={20}/>} label="Events" currentPath={location.pathname} />
                    <SidebarLink to="/news" icon={<Newspaper size={20}/>} label="News" currentPath={location.pathname} />
                    <SidebarLink to="/notices" icon={<Bell size={20}/>} label="Notices" currentPath={location.pathname} />
                    <SidebarLink to="/campaigns" icon={<Megaphone size={20}/>} label="Campaigns" currentPath={location.pathname} />
                    <SidebarLink to="/elections" icon={<Vote size={20}/>} label="Elections" currentPath={location.pathname} />
                    
                    {userData.role === 'admin' && (
                        <div className="mt-4 pt-4 border-t border-emerald-800/50 space-y-3">
                            <SidebarLink to="/admin" icon={<ShieldAlert size={20}/>} label="Admin" currentPath={location.pathname} isDanger />
                            <SidebarLink to="/moderation" icon={<AlertTriangle size={20}/>} label="Mod" currentPath={location.pathname} isDanger />
                        </div>
                    )}
                </nav>

                <div className="w-full px-4 pt-4 border-t border-emerald-800/50 mt-auto">
                    <button onClick={handleLogout} className="group relative flex items-center justify-center h-12 w-full rounded-2xl transition-all duration-300 text-red-400 hover:bg-red-600 hover:text-white">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* 🔹 MAIN CONTENT AREA WITH TOP NAVBAR */}
            <main className="flex-1 ml-28 h-screen overflow-y-auto bg-gray-50 flex flex-col transition-all duration-300">
                
                {/* 🔹 NEW TOP NAVBAR */}
                <header className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
                    <div className="flex-1">
                        {/* Dynamic Breadcrumb/Greeting */}
                        <h2 className="text-xl font-bold text-gray-800 font-serif capitalize">
                            {location.pathname.replace('/', '') || 'Dashboard'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Global Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search network..." 
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-emerald-200 outline-none w-64 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-500 hover:bg-white rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-gray-50 rounded-full"></span>
                        </button>

                        {/* User Mini-Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800 leading-none">{userData.name}</p>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{userData.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:bg-emerald-800 transition-colors">
                                {userData.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 pt-4">
                    <Outlet context={{ userData }} /> 
                </div>
            </main>
        </div>
    );
};

/* Sidebar Link Component */
const SidebarLink = ({ to, icon, label, currentPath, isDanger }) => {
    const active = currentPath.includes(to);
    return (
        <div className="relative h-12 w-full z-10 hover:z-50">
            <Link 
                to={to} 
                className={`group absolute left-0 top-0 flex items-center h-12 px-3 rounded-2xl transition-all duration-300 overflow-hidden
                ${active ? 'bg-emerald-700 text-white w-12 hover:w-48 shadow-lg shadow-emerald-900/50' : 'text-emerald-100/70 hover:bg-emerald-700 hover:text-white w-12 hover:w-48'}
                ${isDanger ? 'text-red-400 hover:bg-red-600 hover:text-white' : ''}`}
            >
                <div className="min-w-[24px] flex items-center justify-center flex-shrink-0">{icon}</div>
                <span className="ml-4 font-bold text-sm whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {label}
                </span>
            </Link>
        </div>
    );
};

export default Layout;