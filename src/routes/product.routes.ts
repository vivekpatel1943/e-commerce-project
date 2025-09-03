import express from 'express';
import {prisma} from '../utils/prisma';
import cookieParser from 'cookie-parser';
import upload from '../Middlewares/uploadImage';
import { postProductHandler,uploadImageHandler } from '../controllers/product.controller';
import sellerAuthMiddleware from '../Middlewares/seller.auth.middleware'

const productRouter = express.Router();

// middlewares 
productRouter.use(cookieParser());

// auth routes for seller
productRouter.use('/postProduct',sellerAuthMiddleware,postProductHandler);
productRouter.use('/uploadProductImage/:productId',sellerAuthMiddleware,upload.single("image"),uploadImageHandler);
export default productRouter;