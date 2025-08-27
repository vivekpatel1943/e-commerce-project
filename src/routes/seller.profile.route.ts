import express from 'express';
import cookieParser from 'cookie-parser';
import sellerAuthMiddleware from '../Middlewares/seller.auth.middleware';
import {sellerProfileHandler} from '../controllers/seller.profile.controller';


const sellerProfileRouter = express.Router(); 

// middlewares
sellerProfileRouter.use(cookieParser());

// routes
sellerProfileRouter.use('/seller/profile',sellerAuthMiddleware,sellerProfileHandler);

export default sellerProfileRouter;