import express from 'express';
import {buyerSignup, buyerVerifyEmailVerificationOTP, sendOTPForEmailVerification,buyerSignin,addToCart, addAddress, createOrder} from '../controllers/buyer.controller';
import buyerAuthMiddleware from '../Middlewares/buyer.auth.middleware';

const buyerRouter = express.Router();

buyerRouter.post('/buyer/signup',buyerSignup);
buyerRouter.post('/buyer/requestEmailVerification',sendOTPForEmailVerification);
buyerRouter.post('/buyer/verifyEmail',buyerVerifyEmailVerificationOTP);
buyerRouter.post('/buyer/signin',buyerSignin)
buyerRouter.post('/buyer/addToCart',buyerAuthMiddleware,addToCart);
buyerRouter.post('/buyer/addAddress',buyerAuthMiddleware,addAddress);
buyerRouter.post('/buyer/createOrder',buyerAuthMiddleware,createOrder);


export default buyerRouter;