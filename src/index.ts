import express from 'express';
import {prisma} from './utils/prisma';
import sellerAuthRouter from './routes/seller.auth.routes'; 
import postProductRouter from './routes/post.product.routes';
import sellerProfileRouter from './routes/seller.profile.route';
import cookieParser from 'cookie-parser';

const app = express();

// middlewares 
// this middleware makes json available as javascript object
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1',sellerAuthRouter);
app.use('/api/v1',postProductRouter);
app.use('/api/v1',sellerProfileRouter);

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