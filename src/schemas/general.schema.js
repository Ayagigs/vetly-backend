import { z } from "zod";
import validator from "validator";

const tokenSchema = z.object({
    token: z.string({
        required_error: "Token is required"
    })
});

const emailSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email()
});

const mongooseIdSchema = z.object({
    id: z.string().refine(validator.isMongoId, { message: "Invalid Id" })
});

const searchSchema = z.object({
    keyword: z.string().min(1, "Keyword is required")
});

export {
    tokenSchema,
    emailSchema,
    mongooseIdSchema,
    searchSchema
};