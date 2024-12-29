import express, {Request, Response} from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes'

// database connect
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log('Connected to MongoDB')
})

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health-check', async (req: Request, res: Response) => {
  res.send({message: 'Health Check, OK!'})
})

// test endpoint
app.get('/test', async(req: Request, res: Response) => {
  res.json({message: 'Hello, World!'})
})

app.use("/api/my/user", userRoutes);

app.listen(8747, () => {
    console.log('Server is running on port 8747')
})