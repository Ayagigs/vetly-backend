import { z } from "zod";

const thirdPartyAuthSchema = z.object({
    user_type: z.enum(["applicant","business", "admin"], {
        required_error: "Add user type to query body"
    })
});


export default thirdPartyAuthSchema;