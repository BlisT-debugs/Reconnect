import { useState, useEffect } from 'react';
import API from '../../services/api';

const SocialFeed = () => {
    const [posts, setPosts] = useState([]);
    const [newPostBody, setNewPostBody] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [commentInputs, setCommentInputs] = useState({}); // Track comment inputs per post
    const [expandedComments, setExpandedComments] = useState({}); // Track which comment sections are open

    const fetchPosts = async () => {
        try {
            const { data } = await API.get('/posts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setPosts(data);
        } catch (err) { console.error("Error fetching posts:", err); }
    };

    useEffect(() => { fetchPosts(); }, []);

    // --- CREATE POST ---
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostBody.trim()) return;

        try {
            const token = localStorage.getItem('token');
            let mediaUrl = null;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('profile_pic', imageFile); // Reusing standard upload endpoint
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
            // Optimistic UI update (makes it feel instant)
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    return { ...p, isLikedByMe: !p.isLikedByMe, likeCount: p.isLikedByMe ? p.likeCount - 1 : p.likeCount + 1 };
                }
                return p;
            }));

            // Network call
            await API.post(`/posts/${postId}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        } catch (err) { fetchPosts(); /* Revert on fail */ }
    };

    // --- ADD COMMENT ---
    const handleComment = async (e, postId) => {
        e.preventDefault();
        const body = commentInputs[postId];
        if (!body?.trim()) return;

        try {
            await API.post(`/posts/${postId}/comment`, { body }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setCommentInputs({ ...commentInputs, [postId]: '' });
            fetchPosts(); // Refresh to show new comment
        } catch (err) { alert('Failed to post comment'); }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            
            {/* --- CREATE POST BOX --- */}
            <div style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '30px' }}>
                <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <textarea 
                        placeholder="What's on your mind?" 
                        value={newPostBody} 
                        onChange={(e) => setNewPostBody(e.target.value)}
                        style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#121212', color: 'white', minHeight: '100px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ fontSize: '13px', color: '#aaa' }} />
                        <button type="submit" style={{ padding: '10px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Post</button>
                    </div>
                </form>
            </div>

            {/* --- FEED --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {posts.map(post => (
                    <div key={post.id} style={{ backgroundColor: '#1e1e2f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                        
                        {/* Header */}
                        <div style={{ padding: '20px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{post.user.name}</h4>
                                <span style={{ fontSize: '12px', color: '#888' }}>{post.user.role === 'admin' ? 'Admin' : 'Alumnus'} • {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '0 20px 15px 20px' }}>
                            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px', color: '#ddd' }}>{post.body}</p>
                        </div>

                        {/* Media */}
                        {post.media.length > 0 && (
                            <div style={{ width: '100%', backgroundColor: '#121212' }}>
                                <img src={`http://localhost:5000${post.media[0].fileUrl}`} alt="Post attached media" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                            </div>
                        )}

                        {/* Stats & Actions */}
                        <div style={{ padding: '10px 20px', borderTop: '1px solid #333', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#aaa' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', color: post.isLikedByMe ? '#007bff' : '#aaa', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {post.isLikedByMe ? '❤️ Liked' : '🤍 Like'} ({post.likeCount})
                                </button>
                                <button onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '14px' }}>
                                    💬 Comment ({post.comments.length})
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        {expandedComments[post.id] && (
                            <div style={{ padding: '20px', backgroundColor: '#1a1a24' }}>
                                <form onSubmit={(e) => handleComment(e, post.id)} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Write a comment..." 
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                        style={{ flex: 1, padding: '10px', borderRadius: '25px', border: '1px solid #444', backgroundColor: '#121212', color: 'white', outline: 'none' }}
                                    />
                                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Send</button>
                                </form>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {post.comments.map(c => (
                                        <div key={c.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'inline-block', backgroundColor: '#2a2a3c', padding: '10px 15px', borderRadius: '15px', alignSelf: 'flex-start' }}>
                                                <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '3px' }}>{c.user.name}</strong>
                                                <span style={{ fontSize: '14px', color: '#ccc' }}>{c.body}</span>
                                            </div>
                                            <span style={{ fontSize: '11px', color: '#777', marginLeft: '10px', marginTop: '4px' }}>{new Date(c.createdAt).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No posts yet. Be the first to start the conversation!</p>}
            </div>
        </div>
    );
};

export default SocialFeed;