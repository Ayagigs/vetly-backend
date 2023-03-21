import { z } from "zod";

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email(),
    password: z.string({
        required_error: "Password is required"
    }).min(8, "Password length should be greater than 8")
});

export default loginSchema;