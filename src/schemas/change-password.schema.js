import { z } from "zod";

const changePasswordSchema = z.object({
    token: z.string({
        required_error: "Token is required"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(8, "Password length should be greater than 8")
});

export default changePasswordSchema;