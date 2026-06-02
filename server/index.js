import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { verifyToken as verifyJwt } from './utils/token.js';
import { setIo } from './config/socket.js';
import { createMessageService } from './services/messageService.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import groupRoutes from './routes/groups.js';
import friendRoutes from './routes/friends.js';
import messageRoutes from './routes/messages.js';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

setIo(io);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message });
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));
    const decoded = verifyJwt(token);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  socket.join(`user:${userId}`);

  socket.on('join_group', ({ groupId }) => {
    socket.join(`group:${groupId}`);
  });

  socket.on('join_private', ({ userId1, userId2 }) => {
    const room = `private:${[userId1, userId2].sort().join('-')}`;
    socket.join(room);
  });

  socket.on('send_message', async ({ content, group_id }) => {
    try {
      const message = await createMessageService({ sender_id: userId, group_id: parseInt(group_id), content });
      io.to(`group:${group_id}`).emit('new_message', message);
    } catch (err) {
      console.error('send_message error:', err.message);
    }
  });

  socket.on('send_private_message', async ({ content, receiver_id }) => {
    try {
      const rid = parseInt(receiver_id);
      const message = await createMessageService({ sender_id: userId, receiver_id: rid, content });
      const room = `private:${[userId, rid].sort().join('-')}`;
      io.to(room).emit('new_private_message', message);
    } catch (err) {
      console.error('send_private_message error:', err.message);
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
