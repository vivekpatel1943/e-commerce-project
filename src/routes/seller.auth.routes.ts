import express from 'express';
import {prisma} from '../utils/prisma';
import cookieParser from 'cookie-parser';
import { sellerSignupHandler , sellerSigninHandler} from '../controllers/seller.auth.controller';

const sellerAuthRouter = express.Router();

// middlewares 
sellerAuthRouter.use(cookieParser());

// auth routes for seller
sellerAuthRouter.use('/auth/seller/signup',sellerSignupHandler);
sellerAuthRouter.use('/auth/seller/signin',sellerSigninHandler);

export default sellerAuthRouter;