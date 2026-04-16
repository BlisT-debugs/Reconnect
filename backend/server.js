const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); 

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" } 
});

let onlineUsers = new Map(); // Track [userId -> socketId]

io.on('connection', (socket) => {
    console.log('New WebSocket Connection:', socket.id);

    // User logs in and tells the server their ID
    socket.on('identify', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    // Listen for messages and route them instantly to the receiver
    socket.on('send_message', (data) => {
        const { receiverId } = data;
        const receiverSocketId = onlineUsers.get(receiverId);
        
        if (receiverSocketId) {
            // Send to the specific user's browser instantly!
            io.to(receiverSocketId).emit('receive_message', data); 
        }
    });

    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) onlineUsers.delete(userId);
        }
    });
});

app.use(express.json()); 
app.use(cors());         
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));     

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/content', require('./routes/newsNoticeRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/elections', require('./routes/electionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/memberships', require('./routes/membershipRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/master-data', require('./routes/masterDataRoutes'));

app.get('/', (req, res) => {
    res.send('PERN Alumni API is online and waiting...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server & WebSockets running on port ${PORT}`));