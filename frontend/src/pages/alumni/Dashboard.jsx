import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  User, Users, Briefcase, Calendar, ShieldAlert, 
  Award, LogOut 
} from 'lucide-react';

const Dashboard = () => {
    
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/register');
                return;
            }

            try {
                const response = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Token failed", error);
                localStorage.removeItem('token');
                navigate('/register');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/register');
    };

    if (!userData) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold text-xl animate-pulse">
            Loading Dashboard...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 font-serif">Alumni Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, <span className="text-emerald-700 font-semibold">{userData.name}</span>!
                    </p>
                </div>
                {/* Logout Button */}
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Quick Action Cards (Emerald Theme) */}
            <h2 className="text-lg font-bold text-gray-700 mb-4 px-2 font-serif">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                
                <ActionCard to="/edit-profile" icon={<User size={22}/>} title="Complete Profile" />
                <ActionCard to="/directory" icon={<Users size={22}/>} title="View Directory" />
                <ActionCard to="/jobs" icon={<Briefcase size={22}/>} title="Job Board" />
                <ActionCard to="/events" icon={<Calendar size={22}/>} title="Campus Events" />

                {/* Conditional Admin Panel Card */}
                {userData.role === 'admin' && (
                    <Link to="/admin" className="bg-red-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                        <ShieldAlert size={22}/>
                        <span className="font-semibold">Admin Panel</span>
                    </Link>
                )}
            </div>

            {/* User Details Area */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                        <Award size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 font-serif">Account Information</h2>
                        <p className="text-sm text-gray-500">Your current portal details</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <InfoRow label="Full Name" value={userData.name} />
                    <InfoRow label="Email Address" value={userData.email} />
                    <InfoRow label="Role Type" value={userData.role.toUpperCase()} />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;

/* 🔹 UI HELPER COMPONENTS 🔹 */

// Emerald Action Card
const ActionCard = ({ to, icon, title }) => (
    <Link to={to} className="bg-emerald-700 text-white p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-emerald-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
        {icon}
        <span className="font-medium font-serif">{title}</span>
    </Link>
);

// Row for Details
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="text-gray-800 font-semibold text-sm">{value || 'N/A'}</span>
    </div>
);