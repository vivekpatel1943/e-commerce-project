///<reference types = 'express'/>
import {jwt , JwtPayload} from 'jsonwebtoken';

interface BuyerJwtPayload extends JwtPayload {
    buyerId : number,
    email : string
}

declare global {
    namespace Express {
        interface Request {
            buyer? : BuyerJwtPayload
        }
    }
}