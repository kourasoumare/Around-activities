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

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Around Activities" })
})

/*preparations des routes pour mes devs*/
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/groups', groupRoutes)
app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT || 5000}`);
});

