import express from 'express';
import {prisma} from '../utils/prisma';
import cookieParser from 'cookie-parser';
import { postProductHandler } from '../controllers/post.product.controller';
import sellerAuthMiddleware from '../Middlewares/seller.auth.middleware'

const postProductRouter = express.Router();

// middlewares 
postProductRouter.use(cookieParser());

// auth routes for seller
postProductRouter.use('/postProduct',sellerAuthMiddleware,postProductHandler);


export default postProductRouter;