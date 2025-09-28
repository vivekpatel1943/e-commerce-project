import express from 'express';
import {prisma} from './utils/prisma';
import sellerRouter from './routes/seller.routes'; 
import productRouter from './routes/product.routes';
import buyerRouter from './routes/buyer.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { redisClient } from './utils/redisClient';

const app = express();

// middlewares 
// this middleware makes json available as javascript object
app.use(express.json());
app.use(cookieParser());

// with this we can send tokens in the cookies from a specific frontend 
app.use(cors({
    origin : "http://localhost:5173/",
    credentials : true //this allows cookies to be sent 
}))

// this makes form data available in the request body
app.use(express.urlencoded({extended:true}));

app.use('/api/v1',sellerRouter);
app.use('/api/v1',productRouter);
app.use('/api/v1',buyerRouter)


const port = 3000;

const databaseConnect = async () => {
    try{
        await prisma.$connect();
        console.log("connected to the database successfully.")
    }catch(err){
        console.log("error connecting to the database", err, ".")
    }
}

databaseConnect();

const redisConnect = async () => {
    try{
        await redisClient.connect();
        console.log("redis connection succesfull...")
    }catch(err){
        console.log("redis client error",err);
    }
} 

redisConnect();

app.listen(port , () => {
    console.log("your server is running on port ", port , " .")
})