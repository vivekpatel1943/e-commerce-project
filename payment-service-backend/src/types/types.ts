import zod from 'zod';

export const paymentInputSchema = zod.object({
    orderId : zod.string()
}) 