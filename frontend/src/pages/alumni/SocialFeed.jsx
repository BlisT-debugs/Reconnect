import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Image as ImageIcon, Send, Heart, MessageCircle, 
  Share2, MoreHorizontal, User, ShieldCheck 
} from 'lucide-react';

const SocialFeed = () => {
    const [posts, setPosts] = useState([]);
    const [newPostBody, setNewPostBody] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data } = await API.get('/posts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setPosts(data);
            setLoading(false);
        } catch (err) { console.error("Error fetching posts:", err); setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, []);

    // --- CREATE POST ---
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostBody.trim() && !imageFile) return;

        try {
            const token = localStorage.getItem('token');
            let mediaUrl = null;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); 
                const uploadRes = await API.post('/alumni/upload', uploadData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                mediaUrl = uploadRes.data.filePath; 
            }

            await API.post('/posts', { body: newPostBody, mediaUrl }, { headers: { Authorization: `Bearer ${token}` } });
            
            setNewPostBody('');
            setImageFile(null);
            fetchPosts();
        } catch (err) { alert('Failed to create post'); }
    };

    // --- TOGGLE LIKE ---
    const handleLike = async (postId) => {
        try {
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    return { ...p, isLikedByMe: !p.isLikedByMe, likeCount: p.isLikedByMe ? p.likeCount - 1 : p.likeCount + 1 };
                }
                return p;
            }));
            await API.post(`/posts/${postId}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        } catch (err) { fetchPosts(); }
    };

    // --- ADD COMMENT ---
    const handleComment = async (e, postId) => {
        e.preventDefault();
        const body = commentInputs[postId];
        if (!body?.trim()) return;

        try {
            await API.post(`/posts/${postId}/comment`, { body }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setCommentInputs({ ...commentInputs, [postId]: '' });
            fetchPosts(); 
        } catch (err) { alert('Failed to post comment'); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-emerald-800 font-bold animate-pulse">
            Loading Feed...
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto font-sans">
            
            <h1 className="text-3xl font-bold text-gray-900 font-serif mb-8 ml-2">Alumni Network</h1>

            {/* --- CREATE POST BOX --- */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 transition-shadow focus-within:shadow-md">
                <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                            <User size={24} />
                        </div>
                        <textarea 
                            placeholder="Start a discussion, share an update..." 
                            value={newPostBody} 
                            onChange={(e) => setNewPostBody(e.target.value)}
                            className="w-full pt-3 pb-2 bg-transparent border-none focus:ring-0 outline-none text-gray-700 text-lg resize-none min-h-[60px]"
                        />
                    </div>
                    
                    {/* Image Preview Area */}
                    {imageFile && (
                        <div className="ml-16 relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100">
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setImageFile(null)} className="absolute top-1 right-1 bg-gray-900/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                                <span className="sr-only">Remove</span>✕
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-50 ml-16">
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-sm font-bold">
                            <ImageIcon size={18} className="text-emerald-600" /> Photo
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                        </label>
                        <button 
                            type="submit" 
                            disabled={!newPostBody.trim() && !imageFile}
                            className="px-6 py-2 bg-emerald-700 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                        >
                            Post <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* --- FEED --- */}
            <div className="flex flex-col gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Header */}
                        <div className="p-6 pb-4 flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                                    {post.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        {post.user.name}
                                        {post.user.role === 'admin' && <ShieldCheck size={16} className="text-emerald-600" />}
                                    </h4>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {post.user.role === 'admin' ? 'University Admin' : 'Alumnus'} • {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        {post.body && (
                            <div className="px-6 pb-4">
                                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-sans">
                                    {post.body}
                                </p>
                            </div>
                        )}

                        {/* Media */}
                        {post.media.length > 0 && (
                            <div className="w-full bg-gray-50 border-y border-gray-100">
                                <img src={`http://localhost:5000${post.media[0].fileUrl}`} alt="Post attachment" className="w-full max-h-[500px] object-cover" />
                            </div>
                        )}

                        {/* Interaction Bar */}
                        <div className="px-6 py-3 border-b border-gray-50 flex items-center gap-6">
                            <button 
                                onClick={() => handleLike(post.id)} 
                                className={`flex items-center gap-2 text-sm font-bold transition-all ${post.isLikedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500 group'}`}
                            >
                                <Heart size={20} className={post.isLikedByMe ? 'fill-current' : 'group-hover:fill-current group-hover:opacity-20'} />
                                {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
                            </button>

                            <button 
                                onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })} 
                                className={`flex items-center gap-2 text-sm font-bold transition-all ${expandedComments[post.id] ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
                            >
                                <MessageCircle size={20} className={expandedComments[post.id] ? 'fill-emerald-100' : ''} />
                                {post.comments.length} Comments
                            </button>

                            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-500 ml-auto">
                                <Share2 size={18} /> Share
                            </button>
                        </div>

                        {/* Comments Section */}
                        {expandedComments[post.id] && (
                            <div className="bg-gray-50/50 p-6 animate-in slide-in-from-top-2 duration-300">
                                
                                {/* Add Comment */}
                                <form onSubmit={(e) => handleComment(e, post.id)} className="flex gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-1">
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            placeholder="Write a comment..." 
                                            value={commentInputs[post.id] || ''}
                                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                            className="w-full bg-white border border-gray-200 rounded-full pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={!(commentInputs[post.id] || '').trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-600 disabled:text-gray-300 hover:bg-emerald-50 rounded-full transition-colors"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </form>

                                {/* Comment List */}
                                <div className="space-y-5">
                                    {post.comments.map(c => (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                {c.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                                                    <span className="font-bold text-gray-800 text-sm block mb-0.5">{c.user.name}</span>
                                                    <span className="text-gray-600 text-sm">{c.body}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 block mt-1 ml-2 uppercase tracking-wider">
                                                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <MessageCircle size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 font-serif">A Quiet Network</h3>
                        <p className="text-gray-400 text-sm">Be the first to share an update with the alumni community.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialFeed;