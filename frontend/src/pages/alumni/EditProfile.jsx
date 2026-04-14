import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { 
  User, GraduationCap, Briefcase, MapPin, 
  Globe, Camera, Save, X, Mail 
} from 'lucide-react';

const EditProfile = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', official_email: '', nickname: '', 
        phone: '', dob: '', blood_group: '', gender: '', about_me: '',
        company: '', designation: '',
        facebook_url: '', twitter_url: '', linkedin_url: '', instagram_url: '', github_url: '',
        state: '', city: '', zip: '', address: '',
        batch: '', department: '', passing_year: '',
        profile_pic: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExistingProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/alumni/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (data) {
                    if (data.dob) data.dob = data.dob.split('T')[0];
                    const mappedData = {
                        ...data,
                        batch: data.batch?.name || '',
                        department: data.department?.name || '',
                        passing_year: data.passingYear?.name || ''
                    };
                    const sanitizedData = Object.fromEntries(
                        Object.entries(mappedData).map(([key, value]) => [key, value === null ? '' : value])
                    );
                    setFormData(sanitizedData);
                    if (sanitizedData.profile_pic) {
                        setImagePreview(`http://localhost:5000${sanitizedData.profile_pic}`);
                    }
                }
                setLoading(false);
            } catch (err) {
                setLoading(false); 
            }
        };
        fetchExistingProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.official_email && !formData.official_email.endsWith('@srmist.edu.in')) {
            alert('Official Email must end with @srmist.edu.in');
            return; 
        }
        try {
            const token = localStorage.getItem('token');
            let uploadedImagePath = formData.profile_pic;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile);

                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadedImagePath = uploadRes.data.filePath; 
            }

            const finalProfileData = { ...formData, profile_pic: uploadedImagePath };

            await API.post('/alumni/profile', finalProfileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Full Profile & Image Updated Successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert('Error updating profile');
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Profile Data...
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 font-serif">Profile Settings</h1>
                    <p className="text-gray-500 mt-1">Update your personal and professional information</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm">
                        <X size={18} /> Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all font-semibold shadow-md">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                
                {/* 🔹 PHOTO & BIO SECTION */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full bg-emerald-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={60} className="text-emerald-200" />
                                )}
                            </div>
                            <label className="absolute bottom-2 right-2 p-2 bg-emerald-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-emerald-700 transition-all">
                                <Camera size={20} />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 font-serif">
                            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><User size={20}/></span>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            <InputField label="Official Email" name="official_email" placeholder="email@srmist.edu.in" value={formData.official_email} onChange={handleChange} icon={<Mail size={16}/>}/>
                            <InputField label="Nickname" name="nickname" value={formData.nickname} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* 🔹 DETAILS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Academic Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeader icon={<GraduationCap size={20}/>} title="Academic Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Batch" name="batch" placeholder="2022-2026" value={formData.batch} onChange={handleChange} />
                            <InputField label="Passing Year" name="passing_year" placeholder="2026" value={formData.passing_year} onChange={handleChange} />
                            <div className="md:col-span-2">
                                <InputField label="Department" name="department" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Professional Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeader icon={<Briefcase size={20}/>} title="Professional Experience" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Current Company" name="company" value={formData.company} onChange={handleChange} />
                            <InputField label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                            <div className="md:col-span-2">
                                <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeader icon={<Globe size={20}/>} title="Additional Info" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                            <SelectField label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                            <div className="md:col-span-2">
                                <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeader icon={<MapPin size={20}/>} title="Location Details" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                            </div>
                            <InputField label="ZIP" name="zip" value={formData.zip} onChange={handleChange} />
                            <div className="md:col-span-3">
                                <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔹 SOCIAL & BIO SECTION */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <SectionHeader icon={<Globe size={20}/>} title="Social Profiles & Bio" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <InputField label="LinkedIn" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                        <InputField label="GitHub" name="github_url" value={formData.github_url} onChange={handleChange} />
                        <InputField label="Twitter/X" name="twitter_url" value={formData.twitter_url} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 ml-1">About Me / Bio</label>
                        <textarea 
                            name="about_me" 
                            value={formData.about_me} 
                            onChange={handleChange} 
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all outline-none text-gray-700 min-h-[120px] resize-none"
                            placeholder="Tell the alumni community about your journey..."
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

/* 🔹 HELPER COMPONENTS 🔹 */

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 font-serif">{title}</h3>
    </div>
);

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false, icon }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">{label} {required && "*"}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full ${icon ? 'pl-10' : 'px-4'} py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all outline-none text-gray-800 font-medium`}
            />
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">{label}</label>
        <select 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all outline-none text-gray-800 font-medium appearance-none"
        >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default EditProfile;