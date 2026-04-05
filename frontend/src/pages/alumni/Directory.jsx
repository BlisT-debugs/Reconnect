import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

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
                setAlumniList(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch directory', err);
                setLoading(false);
            }
        };
        fetchDirectory();
    }, []);

    // Filter the list based on the search bar
    const filteredAlumni = alumniList.filter(alumnus => 
        alumnus.first_name.toLowerCase().includes(search.toLowerCase()) || 
        alumnus.last_name.toLowerCase().includes(search.toLowerCase()) ||
        (alumnus.company && alumnus.company.toLowerCase().includes(search.toLowerCase())) ||
        (alumnus.department && alumnus.department.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Directory...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#007bff' }}>Alumni Directory</h1>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Back to Dashboard
                </button>
            </div>

            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="Search by Name, Company, or Department..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '15px', marginBottom: '30px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2a2a3c', color: 'white', fontSize: '16px' }}
            />

            {/* Grid of Alumni Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredAlumni.map((alumnus) => (
                    <div key={alumnus.id} style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', display: 'flex', gap: '15px', alignItems: 'center' }}>
                        
                        {/* Profile Picture */}
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #0056b3', flexShrink: 0 }}>
                            {alumnus.profile_pic ? (
                                <img src={`http://localhost:5000${alumnus.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#2a2a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Pic</div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{alumnus.first_name} {alumnus.last_name}</h3>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#aaa' }}>{alumnus.designation || 'Alumnus'} at {alumnus.company || 'Unknown'}</p>
                            <p style={{ margin: '0', fontSize: '13px', color: '#007bff' }}>{alumnus.department ? alumnus.department.name : 'No Dept'} • Batch of {alumnus.passingYear ? alumnus.passingYear.name : '?'}</p>
                        </div>

                    </div>
                ))}
            </div>

            {filteredAlumni.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>No alumni found matching your search.</p>}

        </div>
    );
};

export default Directory;