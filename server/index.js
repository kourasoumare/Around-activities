import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './config/socket.js';
import jwt from 'jsonwebtoken';
import prisma from './config/prisma.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import groupRoutes from './routes/groups.js';
import friendRoutes from './routes/friends.js';
import messageRoutes from './routes/messages.js';
import { createMessageService, createActivityMessageService } from './services/messageService.js';

const app = express();
const httpServer = createServer(app);

const io = initSocket(httpServer);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

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
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token manquant'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error('Token invalide'));
  }
});

io.on('connection', async (socket) => {
  const userId = socket.user.id;

  // Auto-join toutes les rooms de groupe du user
  const memberships = await prisma.memberships.findMany({
    where: { user_id: userId },
    select: { group_id: true }
  });
  for (const { group_id } of memberships) {
    socket.join(`group:${group_id}`);
  }

  // Room privée personnelle (pour recevoir des messages sans join explicite)
  socket.join(`user:${userId}`);

  socket.on('join_group', (groupId) => {
    socket.join(`group:${groupId}`);
  });

  socket.on('send_message', async ({ group_id, content }) => {
    try {
      const message = await createMessageService({
  
        sender_id: userId,
        group_id: parseInt(group_id),
        content
      });
      io.to(`group:${group_id}`).emit('new_message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('join_private', ({ friendId }) => {
    const roomId = [userId, parseInt(friendId)].sort((a, b) => a - b).join('-');
    socket.join(`private:${roomId}`);
  });

  socket.on('send_private_message', async ({ receiver_id, content }) => {
    try {
      const message = await createMessageService({
        sender_id: userId,
        receiver_id: parseInt(receiver_id),
        content
      });
      const roomId = [userId, parseInt(receiver_id)].sort((a, b) => a - b).join('-');
      io.to(`private:${roomId}`).emit('new_private_message', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

   socket.on('join_activity', (activityId) => {
    socket.join(`activity:${activityId}`)
  })

  socket.on('send_activity_message', async ({ activity_id, content }) => {
    try {
      const message = await createActivityMessageService({
        sender_id: userId,
        activity_id: parseInt(activity_id),
        content
      })
      io.to(`activity:${activity_id}`).emit('new_activity_message', message)
    } catch (err) {
      socket.emit('error', { message: err.message })
    }
  })


});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
