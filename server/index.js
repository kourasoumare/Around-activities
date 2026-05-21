import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import groupRoutes from './routes/groups.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})