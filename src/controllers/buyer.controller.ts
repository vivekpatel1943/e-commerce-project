import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { prisma } from '../utils/prisma';
import { buyerSignupSchema, buyerVerifyEmailSchema, verifyEmailVerificationOTPSchema, buyerSigninSchema, addToCartSchema, addressSchema, orderSchema , paymentSchema} from '../types/types';
import { redisClient } from '../utils/redisClient';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/emailClient'
import jwt, { SignOptions } from 'jsonwebtoken';
import Stripe from 'stripe';

// initialiasing express
const app = express();

// configuring environment variables
dotenv.config();

// middlewares
app.use(express.json());



export const buyerSignup = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = buyerSignupSchema.safeParse(req.body);

        // console.log("parsedPayloadData", parsedPayload)

        if (!parsedPayload.success) {
            const payloadError = parsedPayload.error;
            return res.status(400).json({ msg: "invalid input..", payloadError }) as unknown as void;
        }

        const { username, email, password } = parsedPayload.data;

        // here the number 10 is the number of salt rounds which refer to the number of recursive hashing that the password will go through
        const hashedPassword = await bcrypt.hash(password, 10);

        const buyer = await prisma.buyer.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            },
            select: {
                username: true,
                email: true,
            }
        })


        res.status(201).json({ msg: "buyer account has been successfully created", buyer });

        return;

    } catch (err) {
        res.status(500).json({ msg: "internal server error..", err })
        return;
    }
}

export const sendOTPForEmailVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = buyerVerifyEmailSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ error: parsedPayload.error });
            return;
        }

        const { email } = parsedPayload.data;

        const buyer = await prisma.buyer.findUnique({
            where: {
                email: email
            }
        })

        if (!buyer) {
            res.status(404).json({ msg: "buyer with the provided email does not exist..." });
            return;
        }

        const emailVerificationOTP = Math.floor(Math.random() * 900000) + 100000;

        // setting up the otp in a redis instance;
        redisClient.set('emailVerificationOTP', emailVerificationOTP, { EX: 300 }); //5 mins or 300 seconds will be the ttl or time-to-live of the otp ,  then it will get deleted all by itself or automatically ,

        sendEmail(
            email,
            "<e_commerce_platform> email verification message",
            `
                <div>
                    <h1><b>${emailVerificationOTP}</b></h1>
                    <p>OTP(one-time-password) to verify your email is <b>${emailVerificationOTP}</b>, if you didn't make any request for this please ignore the message..</p>
                </div>
            `
        )

        res.status(200).json({ msg: "message sent to the user's gmail successfully..." });
        return;
    } catch (err) {
        console.error("error", err);
        res.status(500).json({ msg: "internal server error..." });
        return;
    }
}


export const buyerVerifyEmailVerificationOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = verifyEmailVerificationOTPSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ error: parsedPayload.error });
            return;
        }

        const { emailVerificationOTP, email } = parsedPayload.data;

        const storedOtp = await redisClient.get('emailVerificationOTP');

        if (!storedOtp) {
            res.status(500).json({ msg: `internal error..` })
            return;
        }

        if (emailVerificationOTP !== storedOtp) {
            const timeleft = await redisClient.ttl('emailVerficationOTP');
            console.log("timeLeft", timeleft);
            res.status(400).json({ msg: `otp doesn't match , you can generate another one ${timeleft} seconds` });
            return;
        }

        res.status(200).json({ msg: "otp verified successfully..." });

        await prisma.buyer.update({
            where: {
                email: email
            },
            data: {
                isVerified: true
            }
        })

        // delete the otp after use
        await redisClient.del('emailVerificationOTP');

        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error..." });
        return;
    }
}

export const buyerSignin = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = buyerSigninSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({ msg: "invalid input..." }) as unknown as void
        }

        const { email, password } = parsedPayload.data;


        const buyer = await prisma.buyer.findUnique({
            where: {
                email: email
            }
        })


        if (!buyer) {
            res.status(404).json({ msg: "user with the given email not found..." });
            return;
        }

        // bcrypt.compare is asynchronous function without await it is always truthy,
        const isMatch = await bcrypt.compare(password, buyer.password);

        if (!isMatch) {
            res.status(400).json({ msg: "incorrect password.." })
            return;
        }

        if (!buyer.isVerified) {
            res.status(400).json({ msg: "please verify your email before signing in..." });
            return;
        }


        // function to sign the token 
        // SignOptions is a special type imported from the jsonwebtoken module itself for optional settings like expiresIn, algorithm to sign the token 

        const signToken = (payload: string | object | Buffer, secret: string, options: SignOptions): Promise<string> => {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secret, options ?? {}, (err, token) => {
                    if (err || !token) return reject(err);
                    resolve(token);
                })
            })
        }

        if (!process.env.jwt_secret) {
            res.status(500).json({ msg: "you can't sign the jwt token if there is no jwt secret available.." });
            return;
        }

        const token = await signToken({ buyerId: buyer.id, email: buyer.email }, process.env.jwt_secret as string, { expiresIn: "1w" });


        res.cookie('buyerToken', token, {
            httpOnly: true, //prevents javascript access to cookies , helps avoid XSS(cross-site scripting)
            secure: process.env.NODE_ENV === 'production', //while in development this stays false 
            // while in production secure : true and this makes sure that cookie is only sent over https in production
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            //while in production sameSite will be none and the requests from all other sites shall be allowed while in development sameSite will be lax which provides a good balance between security and usability, for sameSite to be none or to allow all cross site requests secure should be true as well
            maxAge: 7 * 24 * 60 * 60 * 1000 // maxAge , a week in milliseconds
        })
            .json({ msg: "logged-in successfully.." })

        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error.." })
        return;
    }
}


export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = addToCartSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            return res.status(400).json({ err: parsedPayload.error }) as unknown as void;
        }

        const { productId, quantity } = parsedPayload.data;

        const buyer = await prisma.buyer.findUnique({
            where: {
                id: req.buyer?.buyerId
            }
        })

        if (!buyer) {
            res.status(404).json({ msg: "buyer not found.." });
            return;
        }

        let cart = await prisma.cart?.findUnique({
            where: {
                buyerId: buyer?.id
            }
        })

        console.log("buyer", buyer)
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        console.log("product", product)

        // okay so we have the product and the Cart

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    buyer: {
                        connect: { id: req.buyer?.buyerId }
                    }
                }
            })
        }

        console.log("cart", cart)

        const cartItem = await prisma.cartItem.create({
            data: {
                quantity: quantity,
                cartId: cart.id,
                productId: productId
            }
        })

        cart = await prisma.cart.update({
            where: {
                buyerId: buyer.id
            },
            data: {
                cartCount: { increment: 1 }
            }
        })

        res.status(201).json({ msg: "item has been added to the cart", cartItem })
        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error.." })
        return;
    }
}


// order routes 
export const addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = addressSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ error: parsedPayload.error });
            return;
        }

        const { building, street, city, state, pin, country, isDefault } = parsedPayload.data;


        const address = await prisma.address.create({
            data: {
                building: building,
                street: street,
                city: city,
                state: state,
                pin: pin,
                country: country,
                isDefault: isDefault,
                buyer: {
                    connect: { id: req.buyer?.buyerId }
                }
            }
        })

        res.status(201).json({ msg: "your address has been successfully saved...", address });
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error...", err });
        return;
    }
}


export const order = async (req: Request, res: Response): Promise<void> => {
    try {

        console.log("req.body", req.body)

        const parsedPayload = orderSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ error: parsedPayload.error });
            return;
        }

        console.log("parsedPayload", parsedPayload.data)

        const { isFromCart, contactNumber, deliveryInstructions, paymentOption, isPaid, isDelivered, isReturned, addressId } = parsedPayload.data;

        let cartId;
        let productId;
        let quantity;

        if (parsedPayload.data.isFromCart) {
            cartId = parsedPayload.data.cartId;
        } else {
            productId = parsedPayload.data.productId;
            quantity = parsedPayload.data.quantity;
        }

        let orderItemsData = [];

        const buyer = await prisma.buyer.findUnique({
            where: {
                id: req.buyer?.buyerId
            }
        })

        if (!buyer) {
            res.status(404).json({ msg: "buyer not found..." });
            return;
        }

        if (isFromCart) {
            // ----------cart-checkout-flow-------------
            if (!cartId) {
                res.status(404).json({ msg: "cartId not available.." });
                return;
            }
            const cartItems = await prisma.cartItem.findMany({
                where: { cartId: cartId },
                include: {
                    product: true
                }
            })

            orderItemsData = cartItems.map((item) => ({
                quantity: item.quantity ?? 1,
                price: item.product.price,
                product: { connect: { id: item.productId } }
            }))
        } else {

            if (!productId) {
                res.status(404).json({ msg: "productId not available..." });
                return;
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            })

            if (!product) {
                res.status(404).json({ msg: "product not found..." });
                return;
            }

            orderItemsData = [
                {
                    quantity: quantity ?? 1,
                    product: { connect: { id: product.id } },
                    price: product.price
                }
            ]
        }

        console.log("order items Data", orderItemsData)
        let total = 0;
        orderItemsData.map((item) => {
            total += item.quantity * item.price;
        })

        console.log("total", total)

        const order = await prisma.order.create({
            data: {
                total: total,
                contactNumber,
                deliveryInstructions: {
                    "call when you reach": true,
                    "leave at the door": false,
                    "please do not call": false,
                    "do not ring the door bell": false
                },
                paymentOption: {
                    pay_now: false,
                    pay_on_delivery: true
                },
                isPaid: false,
                isDelivered: false,
                isReturned: false,
                buyerId: buyer?.id,
                addressId: addressId,
                orderItems: { create: orderItemsData }
            },
            include: { orderItems: true }
        })

        if(paymentOption.pay_now){
            res.status(200).json({ msg: "order information created..." , order});
            return;
        }else{
            res.status(200).json({msg:"order successfull...", order});
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "internal server error...", err });
        return;
    }
}

export const paymentHandler = async(req:Request,res:Response):Promise<void> => {
    try{
        const parsedPayload = paymentSchema.safeParse(req.body);
        
        if(!parsedPayload.success){
            res.status(400).json({error:parsedPayload.error});
            return;
        }

        const {orderId} = parsedPayload.data;

        const order = await prisma.order.findUnique({
            where : {id : orderId},
        })

        if(!order){
            res.status(500).json({msg:"order not available..."});
            return;
        }
        console.log("order",order);

        if(!process.env.STRIPE_SECRET_KEY){
            res.status(404).json({msg:"stripe secret key not available.."})
            return;
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount : order?.total*100, //in cents , so 5000 : rs 50.00
            currency : "inr",
            automatic_payment_methods : {enabled : true}
        })

        console.log("paymentIntents", paymentIntent);

        res.status(200).json({clientSecret:paymentIntent.client_secret});
        return;
    }catch(err){
        res.status(500).json({msg:"internal server error.."});
        return;
    }
}