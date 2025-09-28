// import 'express';  //That import makes this file a module, which can sometimes stop global augmentation from applying.

///<reference types = "express" />
import {Jwt, JwtPayload} from 'jsonwebtoken';

interface BuyerJwtPayload extends JwtPayload {
    buyerId : number,
    email : string
}

interface SellerJwtPayload extends JwtPayload { 
    sellerId : number,
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