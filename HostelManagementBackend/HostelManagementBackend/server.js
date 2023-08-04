import express from 'express'
import cors from 'cors'
import colors from 'colors' 
import { errorHandler} from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import router from './routes/homeRoutes.js'
import userRouter from './routes/userRoutes.js'
import studentRouter from './routes/studentRoutes.js'
import employeeRouter from './routes/employeeRoutes.js'
import noticeRouter from './routes/noticeRoutes.js'
import allocationRouter from './routes/allocationRoutes.js'
import roomRouter from './routes/roomRoutes.js'
import complaintRouter from './routes/complaintRoutes.js'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 5000
const app = express()

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({extended: false }))

connectDB()

app.use('/', router)
app.use('/users', userRouter)
app.use('/students', studentRouter)
app.use('/employees', employeeRouter);
app.use('/notices', noticeRouter);
app.use('/rooms', roomRouter);
app.use('/seats', allocationRouter);
app.use('/complaints', complaintRouter);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on Port ${port}`))
