import express from 'express';
import {prisma} from '../utils/prisma';
import cookieParser from 'cookie-parser';
import sellerAuthMiddleware from '../Middlewares/seller.auth.middleware';
import { sellerSignupHandler , sellerSigninHandler,sellerProfileHandler, sellerProfileUpdate} from '../controllers/seller.controller';

const sellerRouter = express.Router();

// middlewares 
sellerRouter.use(cookieParser());

// auth routes for seller
sellerRouter.post('/auth/seller/signup',sellerSignupHandler);
sellerRouter.post('/auth/seller/signin',sellerSigninHandler);
sellerRouter.get('/seller/profile',sellerAuthMiddleware,sellerProfileHandler);
sellerRouter.post('/seller/update',sellerAuthMiddleware,sellerProfileUpdate)

export default sellerRouter;