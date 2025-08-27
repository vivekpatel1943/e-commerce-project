import {prisma} from '../utils/prisma';
import express , {Request,Response} from 'express';
import { createProductSchema } from '../types/types';

export const postProductHandler = async (req:Request,res:Response):Promise<void> => {
    try{
        const parsedPayload = createProductSchema.safeParse(req.body);

        if(!parsedPayload.success){
            res.status(400).json({errors : parsedPayload.error});
            return;
        }


        const {name,description,price,category,stock} = parsedPayload.data;

        const seller =  await prisma.seller.findUnique({
            where : {
                gstNumber : req?.seller?.gstNumber
            }
        }) 

        if(!seller){
            res.status(404).json({msg:"seller not found.."})
            return;
        }

        const product = await prisma.product.create({
            data : {
                name : name,
                description : description,
                price : price,
                category : category,
                stock : stock,
                seller : {
                    connect : {id : seller?.id}
                }
            }
        })

        res.status(500).json({msg:"product has been posted successfully..",product})
        return;
    }catch(err){
        res.status(500).json({msg:"internal server error..."});
        return;
    }
}