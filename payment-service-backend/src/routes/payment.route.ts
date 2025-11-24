import express from 'express';
import { paymentHandler } from "../controllers/paymentController";
import cookieParser from 'cookie-parser';
import buyerAuthMiddleware from '../middlewares/buyer.auth';

const paymentRouter = express.Router();

// middleware
paymentRouter.use(cookieParser())

paymentRouter.post('/pay',buyerAuthMiddleware,paymentHandler);

export default paymentRouter;