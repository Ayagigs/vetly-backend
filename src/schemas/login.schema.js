import { z } from "zod";

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email(),
    password: z.string({
        required_error: "Password is required"
    }).min(8, "Password length should be greater than 8"),
    user_type: z.enum(["applicant","business", "admin"], {
        required_error: "Add user type to query body"
    })
});

export default loginSchema;