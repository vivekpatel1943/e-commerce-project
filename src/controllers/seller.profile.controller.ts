import {prisma} from '../utils/prisma';
import express , {Request,Response} from 'express';
import { sellerProfileSchema } from '../types/types';


export const sellerProfileHandler  = async (req:Request,res:Response):Promise<void> => {
    try{
       const parsedPayload = sellerProfileSchema.safeParse(req.body);

       if(!parsedPayload.success){
        res.status(400).json({errors:parsedPayload.error});
        return;
       }

       const {gstNumber} = parsedPayload.data;

        const seller = await prisma.seller.findUnique({
            where : {
                
                gstNumber : gstNumber
            },
            select : {
                products : true
            }
        })

        res.status(200).json({msg:"seller account retrieved successfully",seller})
        return;
    }catch(err){
        res.status(500).json({msg:"internal server error..."});
        return;
    }
}