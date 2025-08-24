import express from 'express';
import {prisma} from './utils/prisma';

const app = express();

const port = 3000;

app.listen(port , () => {
    console.log("your server is running on port ", port , " .")
})