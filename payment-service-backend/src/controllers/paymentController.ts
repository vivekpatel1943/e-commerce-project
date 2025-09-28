import express, { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import Stripe from 'stripe';
import { paymentInputSchema } from '../types/types';

import { redisSubscriber } from '../utils/redisSubscriber';

export const paymentHandler = async (req: Request, res: Response): Promise<void> => {

    try {
        const parsedPayload = paymentInputSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ msg: parsedPayload.error });
            return;
        }

        const { orderId } = parsedPayload.data;

        const payment = await prisma.payments.findUnique({
            where: { orderId: orderId }
        })

        if (!payment) {
            res.status(404).json({ msg: `no payments with the orderId ${orderId} available...` });
            return;
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            res.status(404).json({ msg: "stripe secret key not available.." })
            return;
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: payment.total * 100, //in cents , so 5000 : rs 50.00
            currency: "inr",
            automatic_payment_methods: { enabled: true } //this is a parameter which controls how stripe automatically manages and displays eligible payment methods to your customers  
        })

        console.log("paymentIntents", paymentIntent);

        res.status(200).json({ clientSecret: paymentIntent.client_secret });

        return;
    } catch (err) {
        res.status(500).json({ msg: "internal server error.." });
        return;
    }
}

// once the payment has been successfull in the frontend
export const paymentSuccess = async (req:Request,res:Response):Promise<void> => {

    try{

        const parsedPayload = paymentInputSchema.safeParse(req.body);

        if(!parsedPayload.success){
            res.status(400).json({msg:parsedPayload.error});
            return;
        }

        const {orderId} = parsedPayload.data;

        const payment_successfull = await prisma.payments.update({
            where : { orderId : orderId },
            data : {
                isPaymentSuccessfull : true
            }
        })

        res.status(200).json({msg:"payment saved as successfull...",payment_successfull});
        return;
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"internal server error"});
        return;
    }
}