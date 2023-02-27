import { z } from "zod";

const registerSchema = z.object({
    fullname: z.string({
        required_error: "Fullname is required"
    }),
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

export default registerSchema;