import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cors  from 'cors'
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.json())
app.use(cors())
app.use(cookieParser());

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err)
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Error";
    return res.json({
        success:false,
        statusCode,
        errorMessage
    })
})