import express from 'express';
import {prisma} from './utils/prisma';
import sellerRouter from './routes/seller.routes'; 
import productRouter from './routes/product.routes';

import cookieParser from 'cookie-parser';

const app = express();

// middlewares 
// this middleware makes json available as javascript object
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1',sellerRouter);
app.use('/api/v1',productRouter);


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

app.listen(port , () => {
    console.log("your server is running on port ", port , " .")
})