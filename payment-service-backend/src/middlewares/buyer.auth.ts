import express , {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import jwt,{JwtPayload} from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { BuyerJwtPayload } from '../types/express';

// configuring the environment variables 
dotenv.config();

// initialising express
const app = express();

//middleware 
app.use(express.json())
app.use(cookieParser());

const buyerAuthMiddleware = async (req:Request,res:Response,next:NextFunction):Promise<any> => {
    // these tokens are stored in the cookies as we gotta extract it from there
    const token = req.cookies.buyerToken;

    console.log("token",token);

    if(!token){
        return res.status(404).json({msg:"token not provided"});
    }

    try{
        // we gotta verify the tokens being sent from the browser so that we can ensure that the tokens have not been tampered with or expired ,
        const verifyJwt = (token:string,secret:string) => {
            return new Promise((resolve,reject) => {
                return jwt.verify(token,secret,(err,data) => {
                    if(err) return reject(err);
                    resolve(data as JwtPayload);
                })
            })
        }

        if(!process.env.jwt_secret){
            throw new Error("jwt secret not available in the environment variables..");
        }

        const isVerified = await verifyJwt(token,process.env.jwt_secret as string);

        if(!isVerified){
            return res.status(400).json({msg:"invalid token"})
        }

        req.buyer = isVerified as BuyerJwtPayload;

        next()

    }catch(err){
        console.error(err);
        return;
    }  
}

export default buyerAuthMiddleware;