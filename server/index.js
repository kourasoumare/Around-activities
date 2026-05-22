import 'dotenv/config';
import express from 'express';
import cors from 'cors';
/*preparation des routes pour mes devs*/
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import activityRoutes from './routes/activities.js'
import groupRoutes from './routes/groups.js'

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ message: err.message })
})
app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT || 5000}`);
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})