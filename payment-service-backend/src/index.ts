import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { prisma } from './utils/prisma';
import { redisSubscriber } from './utils/redisSubscriber';

// configuring environment variables
dotenv.config();

// initialising express module
const app = express();

// middlewares
// this middleware makes json data available as javascript object
app.use(express.json())
app.use(cookieParser());

const database_connection = async () => {
    try {
        await prisma.$connect();
        console.log(`database connection successfull...`);
    } catch (err) {
        console.log(`error connecting to the database , ${err}.`)
    }
}

database_connection();

const redisConnect = async () => {
    try {
        await redisSubscriber.connect();
        console.log(`redis connection successfull...`);


        /*  await redisSubscriber.subscribe("order.created", (message) => {
             console.log("message received", message, ".");
         }) */
    } catch (err) {
        console.error(`redis client error...${err}`);
        throw err;
    }
}

redisConnect();


redisSubscriber.subscribe("order.created", async (message) => {
    try {
        console.log("message received", message, ".");
        const orderData = JSON.parse(message);
        await prisma.payments.create({
            data: {
                orderId: orderData.orderId,
                buyerId: orderData.buyerId,
                total: orderData.total,
            }
        })
    } catch (err) {
        console.error("error subscribing to the the event order.created", err);
    }

})


const port = 4000;

app.listen(port, () => {
    console.log(`your server is running on port ${port}.`)
})