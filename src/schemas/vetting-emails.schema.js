import { z } from "zod";

const vettingEmailsSchema = z.object({
    emails: z.array(
        z.string().email()
    )
});

export default vettingEmailsSchema;