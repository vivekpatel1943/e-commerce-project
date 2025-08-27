import express, { Request , Response,NextFunction } from "express";
import dotenv from 'dotenv';
import jwt,{ JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();

// configuring the environment variables
dotenv.config()

// middleware 
app.use(express.json());
app.use(cookieParser())

// to make the seller object available in the request object 
declare global{
    namespace Express {
        interface Request {
            seller? :JwtPayload
        }
    }
}

// so when the user signs up we send them a token , and he sends that token along with the requests , here we will write the code to verify that token , 
const sellerAuthMiddleware = async (req:Request,res:Response,next:NextFunction):Promise<any> => {
    // those tokens are stored in the cookies so we gotta extract it from there
    const token = req.cookies.token; 

    console.log("token",token);

    if(!token){
        return res.status(400).json({msg:"token not provided..."})
    }

    try{
        // jwt.verify function helps us to verify that the jwt being sent has not been expired or has not been tampered with 
        const verifyJwt = (token : string,secret:string) : Promise<JwtPayload> => {
            return new Promise((resolve,reject) => {
                jwt.verify(token,secret,(err,data) => {
                    if(err) return reject(err);
                    resolve(data as JwtPayload);
                })
            })
        }

        if(!process.env.jwt_secret){
            throw new Error("jwt_secret not found in the environment variables...")
        }

        const isVerified = await verifyJwt(token,process.env.jwt_secret);

        if(!isVerified){
            return res.status(400).json("invalid token...")
        }

        req.seller = isVerified;

        next();

    }catch(err){
        console.error(err);
    }
}

export default sellerAuthMiddleware;