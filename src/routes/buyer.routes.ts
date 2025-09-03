import express from 'express';
import {buyerSignup, buyerVerifyEmailVerificationOTP, sendOTPForEmailVerification,buyerSignin,addToCart} from '../controllers/buyer.controller';
import { buyerSigninSchema } from '../types/types';
import buyerAuthMiddleware from '../Middlewares/buyer.auth.middleware';

const buyerRouter = express.Router();

buyerRouter.post('/buyer/signup',buyerSignup);
buyerRouter.post('/buyer/requestEmailVerification',sendOTPForEmailVerification);
buyerRouter.post('/buyer/verifyEmail',buyerVerifyEmailVerificationOTP);
buyerRouter.post('/buyer/signin',buyerSignin)
buyerRouter.post('/buyer/addToCart',buyerAuthMiddleware,addToCart);
export default buyerRouter;