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
import notificationRoutes from './routes/notification.js';
import { createNotification } from './services/notificationService.js';

const app = express();
const httpServer = createServer(app);

const io = initSocket(httpServer);

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://dk98qrn70lcfl4msm49zwat0.194.163.185.211.sslip.io',
  'https://dk98qrn70lcfl4msm49zwat0.194.163.185.211.sslip.io',
  'https://frontend-around-activities-v2.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (ex: Postman, mobile)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

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

      // Notifier tous les membres du groupe sauf l'expéditeur
      const sender = await prisma.users.findUnique({
        where: { id: userId },
        select: { first_name: true }
      });
      const memberships = await prisma.memberships.findMany({
        where: { group_id: parseInt(group_id) },
        select: { user_id: true }
      });
      const group = await prisma.groups.findUnique({
        where: { id: parseInt(group_id) },
        select: { name: true }
      });
      for (const { user_id } of memberships) {
        if (user_id === userId) continue;
        const notif = await createNotification({
          user_id,
          type: 'group_message',
          content: `${sender.first_name} a envoyé un message dans "${group.name}"`,
          link: `/conversations?group=${group_id}`
        });
        io.to(`user:${user_id}`).emit('new_notification', notif);
      }
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

      // Créer une notification pour le destinataire
      const sender = await prisma.users.findUnique({
        where: { id: userId },
        select: { first_name: true }
      });
     const notification = await createNotification({
        user_id: parseInt(receiver_id),
        type: 'dm',
        content: `${sender.first_name} t'a envoyé un message`,
        link: `/conversations?userId=${userId}`
         });
      io.to(`user:${parseInt(receiver_id)}`).emit('new_notification', notification);

    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('join_activity', (activityId) => {
    socket.join(`activity:${activityId}`);
  });

  socket.on('send_activity_message', async ({ activity_id, content }) => {
    try {
      const message = await createActivityMessageService({
        sender_id: userId,
        activity_id: parseInt(activity_id),
        content
      });
      io.to(`activity:${activity_id}`).emit('new_activity_message', message);

      // Notifier tous les membres de l'activité sauf l'expéditeur
      const sender = await prisma.users.findUnique({
        where: { id: userId },
        select: { first_name: true }
      });
      const activity = await prisma.activities.findUnique({
        where: { id: parseInt(activity_id) },
        select: { title: true }
      });
      const members = await prisma.activity_members.findMany({
        where: { activity_id: parseInt(activity_id) },
        select: { user_id: true }
      });
      for (const { user_id } of members) {
        if (user_id === userId) continue;
        const notif = await createNotification({
          user_id,
          type: 'activity_message',
          content: `${sender.first_name} a envoyé un message dans "${activity.title}"`,
          link: `/conversations?activity=${activity_id}`
        });
        io.to(`user:${user_id}`).emit('new_notification', notif);
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});