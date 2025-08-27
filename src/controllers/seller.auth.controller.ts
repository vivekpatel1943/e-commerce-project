import express from 'express';
import dotenv from 'dotenv';
import {Request,Response} from 'express';
import {prisma} from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt ,{ SignOptions } from 'jsonwebtoken';

import {sellerSignupSchema,sellerSigninSchema} from '../types/types';

// configuring environment variables
dotenv.config();

// initialising express
const app = express();

// middlewares
// this makes json data available as javascript objects
app.use(express.json());

export const sellerSignupHandler = async (req:Request,res:Response):Promise<void> => {
    try{
        const parsedPayload = sellerSignupSchema.safeParse(req.body);

        console.log("parsedPayloadData", parsedPayload)

        if(!parsedPayload.success){
            const payloadError = parsedPayload.error;
            return res.status(400).json({msg:"invalid input..",payloadError}) as unknown as void;
        }

        const {storeName,gstNumber,email,address,contactNumber,password} = parsedPayload.data;

        // here the number 10 is the number of salt rounds which refer to the number of recursive hashing that the password will go through
        const hashedPassword = await bcrypt.hash(password,10);

        const seller = await prisma.seller.create({
            data : {
                storeName : storeName,
                gstNumber : gstNumber,
                email : email,
                address : address,
                contactNumber: contactNumber,
                password : hashedPassword
            },
            select : {
                id : true,
                storeName:true,
                gstNumber : true,
                email :true,
                address:true,
                contactNumber:true,
                createdAt:true,
                updatedAt : true,
            }
        })

       
        res.status(201).json({msg:"seller account has been successfully created",seller});

        return;

    }catch(err){
        res.status(500).json({msg:"internal server error..",err})
        return;
    }
}


export const sellerSigninHandler = async (req:Request,res:Response):Promise<void> => {
    try{

        const parsedPayload = sellerSigninSchema.safeParse(req.body);

        if(!parsedPayload.success){
            return res.status(400).json({msg:"invalid input..."}) as unknown as void
        }

        const {email , gstNumber, password} = parsedPayload.data;


        const seller = await prisma.seller.findUnique({
            where : {
                gstNumber : gstNumber
            }
        })


        if(!seller){
            res.status(404).json({msg:"user with the given email not found..."});
            return;
        }

        // bcrypt.compare is asynchronous function without await it is always truthy,
        const isMatch = await bcrypt.compare(password,seller.password);

        if(!isMatch){
            res.status(400).json({msg:"incorrect password.."})
            return;
        }


        // function to sign the token 
        // SignOptions is a special type imported from the jsonwebtoken module itself for optional settings like expiresIn, algorithm to sign the token 
        
        const signToken = (payload : string | object | Buffer , secret : string , options : SignOptions) : Promise<string> => {
            return new Promise((resolve,reject) => {
                jwt.sign(payload,secret,options ?? {} , (err,token) => {
                    if(err || !token) return reject(err);
                    resolve(token);
                })
            })
        } 

        if(!process.env.jwt_secret){
            res.status(500).json({msg:"you can't sign the jwt token if there is no jwt secret available.."});
            return;
        }

        const token = await signToken({sellerId : seller.id,email:seller.email,gstNumber:seller.gstNumber},process.env.jwt_secret,{expiresIn:"1w"});

        // console.log("token",token)

        res.cookie('token',token, {
            httpOnly : true , //prevents javascript access to cookies , helps avoid XSS(cross-site scripting)
            secure : process.env.NODE_ENV === 'production', //while in development this stays false 
            // while in production secure : true and this makes sure that cookie is only sent over https in production
            sameSite : process.env.NODE_ENV === 'production' ? "none" : "lax",
            //while in production sameSite will be none and the requests from all other sites shall be allowed while in development sameSite will be lax which provides a good balance between security and usability, for sameSite to be none or to allow all cross site requests secure should be true as well
            maxAge : 7 * 24 * 60 * 60 * 1000 // maxAge , a week in milliseconds
        })
        .json({msg:"logged-in successfully.."})

        return;
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."})
        return;
    }
}
