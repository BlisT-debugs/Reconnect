import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  CreditCard, ShieldCheck, AlertCircle, 
  CheckCircle2, Settings, Zap, Crown 
} from 'lucide-react';

const Membership = () => {
    const [plans, setPlans] = useState([]);
    const [myMembership, setMyMembership] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userRes = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setRole(userRes.data.role);

            const plansRes = await API.get('/memberships/plans', { headers: { Authorization: `Bearer ${token}` } });
            setPlans(plansRes.data);

            const myRes = await API.get('/memberships/my', { headers: { Authorization: `Bearer ${token}` } });
            setMyMembership(myRes.data);
            
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSetup = async () => {
        await API.post('/memberships/setup-test', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        fetchData();
    };

    const handlePurchase = async (planId, planName, price) => {
        if (!window.confirm(`Proceed to secure checkout for the ${planName} Plan?`)) return;
        
        try {
            // Hit our backend to generate the session
            const { data } = await API.post('/memberships/purchase', { planId }, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
            });
            
            // Redirect the user to Stripe's hosted checkout page!
            if (data.url) {
                window.location.href = data.url; 
            } else if (data.free) {
                alert(`Success! Welcome to ${planName}.`);
                fetchData();
            }
        } catch (err) { 
            alert('Failed to initialize checkout'); 
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Membership Tiers...
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Crown size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Alumni Memberships</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <CreditCard size={16} className="text-emerald-600"/> 
                            Unlock premium network features and exclusive privileges
                        </p>
                    </div>
                </div>
                {role === 'admin' && plans.length === 0 && (
                    <button 
                        onClick={handleSetup} 
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-100"
                    >
                        <Settings size={18} /> Auto-Gen Pricing Tiers
                    </button>
                )}
            </div>

            {/* Current Active Status Banner */}
            {myMembership ? (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[1.5rem] mb-10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-emerald-900 font-serif mb-1">
                                Active Subscription: {myMembership.plan.title} Plan
                            </h3>
                            <p className="text-sm text-emerald-700 font-medium">
                                Valid until: <strong className="bg-emerald-100 px-2 py-0.5 rounded-md">{new Date(myMembership.endDate).toLocaleDateString()}</strong>
                            </p>
                        </div>
                    </div>
                    <span className="hidden md:flex px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-widest rounded-xl">
                        All Systems Go
                    </span>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[1.5rem] mb-10 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-amber-900 font-serif mb-1">
                            No Active Subscription
                        </h3>
                        <p className="text-sm text-amber-700 font-medium">
                            Please select a plan below to unlock full network features, directory access, and premium events.
                        </p>
                    </div>
                </div>
            )}

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const isCurrent = myMembership?.planId === plan.id;
                    
                    return (
                        <div 
                            key={plan.id} 
                            className={`relative bg-white rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:-translate-y-2
                                ${isCurrent 
                                    ? 'border-2 border-emerald-500 shadow-2xl shadow-emerald-100 scale-105 z-10' 
                                    : 'border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200'
                                }`}
                        >
                            {/* Highlight Badge for Current Plan */}
                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                                    <ShieldCheck size={14} /> Current Plan
                                </div>
                            )}

                            <div className="text-center mb-8 pt-4">
                                <h2 className="text-2xl font-bold text-emerald-700 font-serif mb-4">
                                    {plan.title}
                                </h2>
                                <div className="flex items-start justify-center text-gray-900 mb-4">
                                    <span className="text-2xl font-bold mt-2">$</span>
                                    <span className="text-6xl font-black font-serif">{plan.price}</span>
                                </div>
                                <p className="text-gray-400 text-sm italic h-10 line-clamp-2">
                                    "{plan.description}"
                                </p>
                            </div>
                            
                            <div className="flex-1 bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Plan Features</h4>
                                <ul className="space-y-4">
                                    {plan.features.split(',').map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">{feature.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button 
                                onClick={() => !isCurrent && handlePurchase(plan.id, plan.title)}
                                disabled={isCurrent}
                                className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                    ${isCurrent 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-100 active:scale-95'
                                    }`}
                            >
                                {isCurrent ? (
                                    'Currently Active'
                                ) : plan.price === 0 ? (
                                    <>Start Free <Zap size={16} /></>
                                ) : (
                                    <>Purchase Plan <CreditCard size={16} /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Membership;