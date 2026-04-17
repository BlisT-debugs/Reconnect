import { useState, useEffect } from 'react';
import API from '../../services/api';

const MasterData = () => {
    const [departments, setDepartments] = useState([]);
    const [years, setYears] = useState([]);
    
    const [newDept, setNewDept] = useState('');
    const [newYear, setNewYear] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const deptRes = await API.get('/master-data/departments', { headers: { Authorization: `Bearer ${token}` } });
            const yearRes = await API.get('/master-data/years', { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(deptRes.data);
            setYears(yearRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddDept = async (e) => {
        e.preventDefault();
        try {
            await API.post('/master-data/departments', { name: newDept }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setNewDept('');
            fetchData();
        } catch (err) { alert('Error adding department'); }
    };

    const handleAddYear = async (e) => {
        e.preventDefault();
        try {
            await API.post('/master-data/years', { year: newYear }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setNewYear('');
            fetchData();
        } catch (err) { alert('Error adding year. It might already exist.'); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            await API.delete(`/master-data/${type}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData();
        } catch (err) { alert('Error deleting record'); }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <h1 style={{ color: '#ffc107', marginBottom: '30px' }}>⚙️ Master Data Configuration</h1>
            <p style={{ color: '#aaa', marginBottom: '30px' }}>Configure the dropdown options available to users during registration and profile creation.</p>

            <div style={{ display: 'flex', gap: '30px' }}>
                
                {/* Departments Panel */}
                <div style={{ flex: 1, backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Departments</h3>
                    
                    <form onSubmit={handleAddDept} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="text" value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="e.g. Computer Science" required style={inputStyle} />
                        <button type="submit" style={btnStyle}>Add</button>
                    </form>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {departments.map(dept => (
                            <li key={dept.id} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#2a2a3c', padding: '10px 15px', borderRadius: '4px' }}>
                                <span>{dept.name}</span>
                                <button onClick={() => handleDelete('departments', dept.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Passing Years Panel */}
                <div style={{ flex: 1, backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Graduation Years</h3>
                    
                    <form onSubmit={handleAddYear} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="number" value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="e.g. 2024" required style={inputStyle} />
                        <button type="submit" style={btnStyle}>Add</button>
                    </form>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                        {years.map(y => (
                            <li key={y.id} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#2a2a3c', padding: '10px 15px', borderRadius: '4px' }}>
                                <span>{y.year}</span>
                                <button onClick={() => handleDelete('years', y.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

const inputStyle = { flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#121212', color: 'white' };
const btnStyle = { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default MasterData;