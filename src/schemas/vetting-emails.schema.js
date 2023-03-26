import { z } from "zod";

const vettingEmailsSchema = z.object({
    resume_id: z.string().optional(),
    emails: z.array(
        z.string().email()
    )
});

export default vettingEmailsSchema;