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

export const sellerProfileUpdateSchema = zod.object({
    storeName : zod.string().min(2,"store name must be atleast 2 characters long.").optional(),
    email : zod.string().email("Invalid email format.").optional(),
    address : zod.string().min(5,"address must be atleast 5 characters long.").optional(),
    contactNumber : zod.string().regex(/^[6-9]\d{9}$/,"Invalid Indian phone number.").optional(),
}).optional();


export const sellerForgotPasswordSchema = zod.object({
    email : zod.string().nonempty(),
    gstNumber : zod.string().nonempty() 
}) 

export const sellerForgotPasswordOTPSchema = zod.object({
    email : zod.string(),
    otp : zod.string()
})

export const buyerSignupSchema = zod.object({
    username : zod.string().min(2,"store name must be atleast 2 characters long."),
    email : zod.string().email("Invalid email format."),
    password : zod.string()
        .min(8, "password must be atleast 8 characters long.")
        .regex(/[A-Z]/,"Password  must contain atleast one uppercase letter.")
        .regex(/[a-z]/,"password must contain atleast one lowercase letter")
        .regex(/[0-9]/,"password must contain atleast one digit")
        .regex(/[\W\s]/,"Password must contain atleast one special character.") 
})
 

export const buyerVerifyEmailSchema = zod.object({
    email : zod.string().email("Invalid email format..")
})

export const verifyEmailVerificationOTPSchema = zod.object({
    emailVerificationOTP : zod.string(),
    email : zod.string().email("Invalid email format...")
})


export const buyerSigninSchema = zod.object({
    email : zod.string().email("Invalid email format..."),
    password : zod.string()
})


export const addToCartSchema = zod.object({
    productId : zod.number().positive("productId must be greater than 0"),
    quantity : zod.number().positive("quantity must be greater than 0"),
})

export const addressSchema = zod.object({
    building : zod.string(),
    street : zod.string(),
    city : zod.string(),
    state : zod.string(),
    pin : zod.string(),
    country : zod.string(),

    // is the address being set as the default address by the user 
    isDefault : zod.boolean()
})

const baseOrderFields = zod.object({
    contactNumber : zod.string(),
    deliveryInstructions : zod.object({"call when you reach":zod.boolean().default(false),"leave at the door":zod.boolean().default(false),"please do not call":zod.boolean().default(false),  "do not ring the door bell" :zod.boolean().default(false)}).optional(),
    paymentOption : zod.object({pay_now  : zod.boolean().default(false),pay_on_delivery:zod.boolean().default(false)}),
    isPaid : zod.boolean().default(false),
    isDelivered : zod.boolean().default(false),
    isReturned : zod.boolean().default(false),    
    addressId : zod.string()
})

// checkout from cart
const cartCheckoutSchema = baseOrderFields.extend({
    isFromCart : zod.literal(true),
    cartId : zod.string()
})


// direct Buy 
const directBuySchema = baseOrderFields.extend({
    isFromCart : zod.literal(false).default(false),
    productId : zod.number(),
    quantity : zod.number().default(1)
})

export const orderSchema = zod.discriminatedUnion("isFromCart",[
    cartCheckoutSchema,
    directBuySchema
])

export const paymentSchema = zod.object({
    orderId : zod.string().nonempty("orderId cannot be empty..")
})