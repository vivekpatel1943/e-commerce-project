import 'express';
import {Jwt, JwtPayload} from 'jsonwebtoken';

interface BuyerJwtPayload extends JwtPayload {
    buyerId : Number,
    email : string
}

interface SellerJwtPayload extends JwtPayload { 
    sellerId : Number,
    email : string,
    gstNumber : string
}

declare global {
    namespace Express {
        interface Request {
            seller? : SellerJwtPayload;
            buyer? : BuyerJwtPayload;
        }
    }
}