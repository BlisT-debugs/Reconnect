import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Settings, Building2, CalendarDays, Plus, 
  Trash2, Database, GraduationCap 
} from 'lucide-react';

const MasterData = () => {
    const [departments, setDepartments] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [newDept, setNewDept] = useState('');
    const [newYear, setNewYear] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const deptRes = await API.get('/master-data/departments', { headers: { Authorization: `Bearer ${token}` } });
            const yearRes = await API.get('/master-data/years', { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(deptRes.data);
            setYears(yearRes.data);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddDept = async (e) => {
        e.preventDefault();
        if (!newDept.trim()) return;
        try {
            await API.post('/master-data/departments', { name: newDept }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setNewDept('');
            fetchData();
        } catch (err) { alert('Error adding department. It might already exist.'); }
    };

    const handleAddYear = async (e) => {
        e.preventDefault();
        if (!newYear.trim()) return;
        try {
            await API.post('/master-data/years', { year: newYear }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setNewYear('');
            fetchData();
        } catch (err) { alert('Error adding year. It might already exist.'); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type === 'departments' ? 'Department' : 'Year'}? This may affect linked user profiles.`)) return;
        try {
            await API.delete(`/master-data/${type}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            fetchData();
        } catch (err) { alert('Error deleting record. It might be in use.'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Syncing Master Data...
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                        <Database size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-serif">Master Configuration</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <Settings size={16} className="text-emerald-600"/> 
                            Manage institutional dropdown options and core taxonomy
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 🔹 Departments Panel 🔹 */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 font-serif">Academic Departments</h3>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={handleAddDept} className="flex gap-3 mb-6">
                            <input 
                                type="text" 
                                value={newDept} 
                                onChange={e => setNewDept(e.target.value)} 
                                placeholder="e.g. Computer Science" 
                                required 
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                            <button type="submit" className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-md disabled:opacity-50" disabled={!newDept.trim()}>
                                <Plus size={18} /> Add
                            </button>
                        </form>

                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 h-[380px]">
                            {departments.map(dept => (
                                <div key={dept.id} className="group flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-transparent hover:border-emerald-200 hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                        <span className="font-semibold text-gray-700 group-hover:text-emerald-800 transition-colors">{dept.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete('departments', dept.id)} 
                                        className="p-2 bg-white text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100 hover:border-red-100"
                                        title="Delete Department"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {departments.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">No departments configured yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔹 Passing Years Panel 🔹 */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                            <CalendarDays size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 font-serif">Graduation Years</h3>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={handleAddYear} className="flex gap-3 mb-6">
                            <input 
                                type="number" 
                                value={newYear} 
                                onChange={e => setNewYear(e.target.value)} 
                                placeholder="e.g. 2024" 
                                required 
                                min="1950"
                                max="2050"
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                            <button type="submit" className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-md disabled:opacity-50" disabled={!newYear.trim()}>
                                <Plus size={18} /> Add
                            </button>
                        </form>

                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 h-[380px]">
                            {/* Sort years in descending order for better UX */}
                            {[...years].sort((a, b) => b.year - a.year).map(y => (
                                <div key={y.id} className="group flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-transparent hover:border-emerald-200 hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-gray-500 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                                            {y.year.toString().slice(-2)}'
                                        </div>
                                        <span className="font-bold text-gray-700 text-lg group-hover:text-emerald-800 transition-colors">Class of {y.year}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete('years', y.id)} 
                                        className="p-2 bg-white text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100 hover:border-red-100"
                                        title="Delete Year"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {years.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">No graduation years configured yet.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MasterData;