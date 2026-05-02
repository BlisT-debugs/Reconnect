import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../services/api';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    // NEW: State to track if the user has scrolled
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Fetch User
        const fetchUser = async () => {
            try {
                const { data } = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUser(data);
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();

        // NEW: Scroll Listener for the Glassmorphism effect
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Cleanup listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            
            {/* UNIFIED PREMIUM HEADER WITH DYNAMIC GLASSMORPHISM */}
            <nav className={`z-10 sticky top-0 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
                
                {/* Primary Bar: Deep Emerald (Becomes 90% opaque + blurred on scroll) */}
                <div className={`transition-colors duration-300 ${isScrolled ? 'bg-emerald-800/90 backdrop-blur-md' : 'bg-emerald-800'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            
                            {/* Brand / Logo */}
                            <div className="flex items-center">
                                <Link to="/dashboard" className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner group-hover:bg-emerald-400 transition-colors">
                                        S
                                    </div>
                                    <span className="text-2xl font-extrabold text-white tracking-tight">
                                        SRM <span className="font-medium text-emerald-200">Alumni</span>
                                    </span>
                                </Link>
                            </div>

                            {/* User Profile & Actions */}
                            <div className="flex items-center gap-5">
                                <div className="flex flex-col text-right hidden sm:flex">
                                    <span className="text-sm font-bold text-white">{user.name}</span>
                                    <span className="text-xs font-medium text-emerald-300 capitalize">{user.role}</span>
                                </div>
                                
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:border-white transition-all">
                                    {user.name.charAt(0)}
                                </div>
                                
                                <div className="h-8 w-px bg-emerald-600/50 mx-1"></div>
                                
                                <Link to="/edit-profile" className="text-sm font-medium text-emerald-100 hover:text-white transition-colors bg-emerald-700/50 px-3 py-1.5 rounded-md hover:bg-emerald-600">
                                    Profile
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="text-sm font-medium text-emerald-100 hover:text-red-100 transition-colors bg-red-500/20 px-3 py-1.5 rounded-md hover:bg-red-500/40"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Bar: Grounding Shelf (Becomes 90% opaque + blurred on scroll) */}
                <div className={`border-b border-emerald-950 pt-3 transition-colors duration-300 ${isScrolled ? 'bg-emerald-900/90 backdrop-blur-md' : 'bg-emerald-900'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-2 overflow-x-auto scrollbar-hide items-end">
                            <NavItem to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
                            <NavItem to="/feed" label="Feed" active={isActive('/feed')} />
                            <NavItem to="/directory" label="Directory" active={isActive('/directory')} />
                            <NavItem to="/chat" label="Messages" active={isActive('/chat')} />
                            <NavItem to="/events" label="Events" active={isActive('/events')} />
                            <NavItem to="/jobs" label="Jobs" active={isActive('/jobs')} />
                            <NavItem to="/gallery" label="Gallery" active={isActive('/gallery')} />
                            <NavItem to="/campaigns" label="Donations" active={isActive('/campaigns')} />
                            <NavItem to="/elections" label="Elections" active={isActive('/elections')} />
                            <NavItem to="/membership" label="Membership" active={isActive('/membership')} />
                            <NavItem to="/helpdesk" label="Support" active={isActive('/helpdesk')} />

                            {/* Admin specific links */}
                            {user.role === 'admin' && (
                                <>
                                    <div className="w-px h-6 bg-emerald-700 my-auto mx-2 mb-2"></div>
                                    <NavItem to="/admin" label="Admin Panel" active={isActive('/admin')} isAdmin />
                                    <NavItem to="/admin/moderation" label="Moderation" active={isActive('/admin/moderation')} isAdmin />
                                    <NavItem to="/master-data" label="Master Data" active={isActive('/master-data')} isAdmin />
                                    <NavItem to="/website-settings" label="CMS" active={isActive('/website-settings')} isAdmin />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
            
        </div>
    );
};

// Reusable Top Navbar Item Component
const NavItem = ({ to, label, active, isAdmin }) => (
    <Link 
        to={to} 
        className={`whitespace-nowrap px-4 py-2.5 rounded-t-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
            active 
            ? (isAdmin ? 'bg-gray-50 text-purple-800 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.1)]' : 'bg-gray-50 text-emerald-800 shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.1)]')
            : (isAdmin ? 'text-purple-300 hover:bg-emerald-800/50 hover:text-purple-100' : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white')
        }`}
    >
        {isAdmin && (
            <svg 
                className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-purple-300 group-hover:text-purple-100'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )}
        {label}
    </Link>
);

export default Layout;