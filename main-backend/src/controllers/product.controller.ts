import { prisma } from '../utils/prisma';
import express, { Request, Response } from 'express';
import { createProductSchema } from '../types/types';

export const postProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedPayload = createProductSchema.safeParse(req.body);

        if (!parsedPayload.success) {
            res.status(400).json({ errors: parsedPayload.error });
            return;
        }

        const { name, description, price, category, stock } = parsedPayload.data;

        const seller = await prisma.seller.findUnique({
            where: {
                gstNumber: req?.seller?.gstNumber
            }
        })

        if (!seller) {
            res.status(404).json({ msg: "seller not found.." })
            return;
        }

        const product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                category: category,
                stock: stock,
                seller: {
                    connect: { id: seller?.id }
                }
            }
        })

        res.status(500).json({ msg: "product has been posted successfully..", product })
        return;
    } catch (err) {
        res.status(500).json({ msg: "internal server error..." });
        return;
    }
}

export const uploadImageHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId && parseInt(req.params.productId);

        if (!productId) {
            res.status(400).json({ msg: "invalid request" });
            return;
        }

        // multer adds file info to req.file 
        const file = req.file as Express.Multer.File;

        if (!file) {
            res.status(404).json({ msg: "no file uploaded" });
            return;
        }

        const image = await prisma.productImage.create({
            data: {
                imageUrl: (file as any).path, //cloudinary link
                product: {
                    connect: { id: productId }
                }
            }
        })

        res.status(201).json({ msg: "image saved in the database successfully...", image });
        return;
    } catch (err) {
        res.status(500).json({ msg: "internal server error..." })
        return;
    }
}