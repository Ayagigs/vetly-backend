import { z } from "zod";

const tokenSchema = z.object({
    token: z.string({
        required_error: "Token is required"
    })
});

const emailSchema = z.object({
    emIL: z.string({
        required_error: "Email is required"
    }).email()
});

export {
    tokenSchema,
    emailSchema
};