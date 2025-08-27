import zod, { regex } from 'zod';

export const sellerSignupSchema = zod.object({
    storeName : zod.string().min(2,"store name must be atleast 2 characters long."),
    gstNumber : zod.string().regex(/^[0-9A-Z]{15}$/,"GST number must be atleast 15 alphanumberic characters."),
    email : zod.string().email("Invalid email format."),
    address : zod.string().min(5,"address must be atleast 5 characters long."),
    contactNumber : zod.string().regex(/^[6-9]\d{9}$/,"Invalid Indian phone number."),
    password : zod.string()
        .min(8, "password must be atleast 8 characters long.")
        .regex(/[A-Z]/,"Password  must contain atleast one uppercase letter.")
        .regex(/[a-z]/,"password must contain atleast one lowercase letter")
        .regex(/[0-9]/,"password must contain atleast one digit")
        .regex(/[\W\s]/,"Password must contain atleast one special character.") 
})

export const sellerSigninSchema = zod.object({
    email : zod.string().email("invalid email format.."),
    gstNumber : zod.string().regex(/^[0-9A-Z]{15}$/,"GST number must be atleast 15 alphanumeric characters.."),
    password : zod.string()
})



export const createProductSchema = zod.object({
    name : zod.string().min(2,"Product must be atleast 2 characters long."),
    description : zod.string().min(10,"description must be atleast 10 characters long.."),
    price : zod.number().positive("Price must be greate than 0."),
    category : zod.string().nonempty("Category is required."),
    stock : zod.number().nonnegative("stock cannot be negative.."),
})


export const sellerProfileSchema = zod.object({
    gstNumber : zod.string()
})