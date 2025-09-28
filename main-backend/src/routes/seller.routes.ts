import express from 'express';
import {prisma} from '../utils/prisma';
import cookieParser from 'cookie-parser';
import sellerAuthMiddleware from '../Middlewares/seller.auth.middleware';
import { sellerSignupHandler , sellerSigninHandler,sellerProfileHandler, sellerProfileUpdate, sellerForgotPassword, sellerVerifyOTP} from '../controllers/seller.controller';

const sellerRouter = express.Router();

// middlewares 
sellerRouter.use(cookieParser());

// auth routes for seller
sellerRouter.post('/seller/signup',sellerSignupHandler);
sellerRouter.post('/seller/signin',sellerSigninHandler);
sellerRouter.get('/seller/profile',sellerAuthMiddleware,sellerProfileHandler);
sellerRouter.post('/seller/profileUpdate',sellerAuthMiddleware,sellerProfileUpdate)
sellerRouter.post('/seller/forgotPassword',sellerAuthMiddleware,sellerForgotPassword);
sellerRouter.post('/seller/verifyOtp',sellerAuthMiddleware,sellerVerifyOTP)

export default sellerRouter;