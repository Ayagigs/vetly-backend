import { z } from "zod";

const roleSchema = z.object({
    user_type: z.enum(["applicant","business", "admin"], {
        required_error: "Add user type to query body"
    })
});


export default roleSchema;