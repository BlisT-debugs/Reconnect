import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  LayoutDashboard, User, Users, MessageSquare, Briefcase, Calendar, 
  Newspaper, Bell, Megaphone, Vote, ShieldAlert, AlertTriangle, LogOut, GraduationCap 
} from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [role, setRole] = useState('user');

    // 🔹 TERI FUNCTIONALITY (No Changes)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');
                const { data } = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                setRole(data.role);
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

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            
            {/* 🔹 FLOATING SIDEBAR */}
            <aside className="fixed left-4 top-4 bottom-4 w-20 bg-emerald-900 rounded-3xl shadow-2xl z-50 flex flex-col items-center py-6 overflow-visible">
                
                {/* Logo */}
                <div className="flex items-center justify-center w-full mb-8 pb-4 border-b border-emerald-800/50">
                    <GraduationCap className="text-emerald-400" size={32} />
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 w-full px-4 space-y-3">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" currentPath={location.pathname} />
                    <SidebarLink to="/edit-profile" icon={<User size={20}/>} label="My Profile" currentPath={location.pathname} />
                    <SidebarLink to="/directory" icon={<Users size={20}/>} label="Directory" currentPath={location.pathname} />
                    <SidebarLink to="/chat" icon={<MessageSquare size={20}/>} label="Messenger" currentPath={location.pathname} />
                    <SidebarLink to="/jobs" icon={<Briefcase size={20}/>} label="Job Board" currentPath={location.pathname} />
                    <SidebarLink to="/events" icon={<Calendar size={20}/>} label="Events" currentPath={location.pathname} />
                    <SidebarLink to="/news" icon={<Newspaper size={20}/>} label="News" currentPath={location.pathname} />
                    <SidebarLink to="/notices" icon={<Bell size={20}/>} label="Notices" currentPath={location.pathname} />
                    <SidebarLink to="/campaigns" icon={<Megaphone size={20}/>} label="Campaigns" currentPath={location.pathname} />
                    <SidebarLink to="/elections" icon={<Vote size={20}/>} label="Elections" currentPath={location.pathname} />
                    
                    {/* Admin Links */}
                    {role === 'admin' && (
                        <div className="mt-4 pt-4 border-t border-emerald-800/50 space-y-3">
                            <SidebarLink to="/admin" icon={<ShieldAlert size={20}/>} label="Admin Panel" currentPath={location.pathname} isDanger />
                            <SidebarLink to="/moderation" icon={<AlertTriangle size={20}/>} label="Moderation" currentPath={location.pathname} isDanger />
                        </div>
                    )}
                </nav>

                {/* Logout Button */}
                <div className="w-full px-4 pt-4 border-t border-emerald-800/50 mt-auto">
                    <div className="relative h-12 w-full z-10 hover:z-50">
                        <button 
                            onClick={handleLogout}
                            className="group absolute left-0 top-0 flex items-center h-12 px-3 rounded-xl transition-all duration-300 overflow-hidden text-red-400 hover:bg-red-600 hover:text-white w-12 hover:w-40 hover:shadow-xl"
                        >
                            <div className="min-w-[24px] flex items-center justify-center"><LogOut size={20} /></div>
                            <span className="ml-4 font-medium whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* 🔹 MAIN CONTENT AREA */}
            <main className="flex-1 ml-28 h-screen overflow-y-auto bg-gray-50 transition-all duration-300">
                <Outlet /> 
            </main>
            
        </div>
    );
};

/* 🔹 PILL HOVER COMPONENT 🔹 */
const SidebarLink = ({ to, icon, label, currentPath, isDanger }) => {
    const active = currentPath === to;
    return (
        <div className="relative h-12 w-full z-10 hover:z-50">
            <Link 
                to={to} 
                className={`group absolute left-0 top-0 flex items-center h-12 px-3 rounded-xl transition-all duration-300 overflow-hidden
                ${active ? 'bg-emerald-700 text-white w-12 hover:w-48 shadow-lg' : 'text-emerald-100/70 hover:bg-emerald-700 hover:text-white w-12 hover:w-48 hover:shadow-xl'}
                ${isDanger ? 'text-red-400 hover:bg-red-600 hover:text-white' : ''}`}
            >
                <div className="min-w-[24px] flex items-center justify-center flex-shrink-0">{icon}</div>
                <span className="ml-4 font-medium whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {label}
                </span>
            </Link>
        </div>
    );
};

export default Layout;