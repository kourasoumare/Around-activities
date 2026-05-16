import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT || 5000}`);
});

