import { useState, useEffect } from 'react';
import API from '../../services/api';

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

    const handlePurchase = async (planId, planName) => {
        if (!window.confirm(`Simulate secure payment for the ${planName} Plan?`)) return;
        try {
            await API.post('/memberships/purchase', { planId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            alert(`Payment successful! Welcome to ${planName}.`);
            fetchData();
        } catch (err) { alert('Transaction failed'); }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Pricing...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff', margin: 0 }}>Membership Plans</h1>
                {role === 'admin' && plans.length === 0 && (
                    <button onClick={handleSetup} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Auto-Gen Pricing Tiers
                    </button>
                )}
            </div>

            {/* Current Active Status */}
            {myMembership ? (
                <div style={{ backgroundColor: '#28a745', padding: '20px', borderRadius: '8px', marginBottom: '30px', color: '#fff' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>✅ Active Subscription: {myMembership.plan.title} Plan</h3>
                    <p style={{ margin: 0 }}>Valid until: <strong>{new Date(myMembership.endDate).toLocaleDateString()}</strong></p>
                </div>
            ) : (
                <div style={{ backgroundColor: '#dc3545', padding: '20px', borderRadius: '8px', marginBottom: '30px', color: '#fff' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>⚠️ No Active Subscription</h3>
                    <p style={{ margin: 0 }}>Please select a plan below to unlock full network features.</p>
                </div>
            )}

            {/* Pricing Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {plans.map((plan) => (
                    <div key={plan.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: myMembership?.planId === plan.id ? '2px solid #28a745' : '1px solid #333', padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>{plan.title}</h2>
                        <h1 style={{ margin: '0 0 20px 0', fontSize: '36px' }}>${plan.price}</h1>
                        <p style={{ color: '#aaa', marginBottom: '20px', fontStyle: 'italic' }}>{plan.description}</p>
                        
                        <div style={{ flex: 1, textAlign: 'left', marginBottom: '20px', padding: '15px', backgroundColor: '#2a2a3c', borderRadius: '4px' }}>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', lineHeight: '1.8' }}>
                                {plan.features.split(',').map((feature, i) => (
                                    <li key={i}>{feature.trim()}</li>
                                ))}
                            </ul>
                        </div>

                        {myMembership?.planId === plan.id ? (
                            <button disabled style={{ padding: '15px', backgroundColor: '#444', color: '#888', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Current Plan</button>
                        ) : (
                            <button onClick={() => handlePurchase(plan.id, plan.title)} style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {plan.price === 0 ? 'Select Free' : 'Purchase Plan'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Membership;