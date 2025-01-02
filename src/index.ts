import express, {Request, Response} from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes'
import restaurantRoutes from './routes/restaurantRoutes'
import { v2 as cloudinary } from 'cloudinary';
import allRestaurantsRoutes from './routes/allRestaurantsRoutes'

// database connect
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log('Connected to MongoDB')
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

const app = express()
app.use(cors())
app.use(express.json()); // To parse application/json
app.use(express.urlencoded({ extended: true })); // To parse application/x-www-form-urlencoded

app.get('/health-check', async (req: Request, res: Response) => {
  res.send({message: 'Health Check, OK!'})
})

// test endpoint
app.get('/test', async(req: Request, res: Response) => {
  res.json({message: 'Hello, World!'})
})

app.use("/api/my/user", userRoutes);
app.use("/api/my/restaurant", restaurantRoutes)
app.use("/api/restaurants", allRestaurantsRoutes)

const port = process.env.PORT ? parseInt(process.env.PORT) : 8747;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
